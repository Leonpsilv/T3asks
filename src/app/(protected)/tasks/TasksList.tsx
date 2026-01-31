"use client";

import { useCallback, useMemo, useState } from "react";
import { api } from "~/trpc/react";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type Row
} from "@tanstack/react-table";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { DeleteTasksModal } from "../../_components/DeleteTasksModal";
import { SimpleDateRangePicker } from "~/app/_components/DateRangePicker";
import type { DateRange } from "react-day-picker";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { getLabelByValue } from "~/lib/constantsToLabels";
import { SimpleSelect } from "~/app/_components/SimpleSelect";
import { Edit, Trash } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ITasks } from "~/app/_types/tasks.types";
import { EditTasksModal } from "../../_components/EditTasksModal";



interface ITasksListFilters {
    page: number;
    pageSize: number;
    createdAtStart: Date;
    createdAtEnd: Date;
    search?: string;
    status?: string;
}

const defaultCreatedAtEnd = new Date();
const defaultCreatedAtStart = new Date(defaultCreatedAtEnd);
defaultCreatedAtStart.setDate(defaultCreatedAtStart.getDate() - 7);

const statusOptions = [
    { value: undefined, label: "Todos os status" },
    ...Object.values(TasksStatusConfig).map((status) => ({
        value: status.value,
        label: status.label,
    })),
];

export default function TasksList() {
    const router = useRouter();

    const [dateRange, setDateRange] = useState<DateRange>({
        from: defaultCreatedAtStart,
        to: defaultCreatedAtEnd,
    });

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({ id: "createdAt", desc: true });

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>();

    const [filters, setFilters] = useState<ITasksListFilters>({
        page: 1,
        pageSize: 10,
        createdAtStart: defaultCreatedAtStart,
        createdAtEnd: defaultCreatedAtEnd,
    })

    const [editSelectedTask, setEditSelectedTask] = useState<ITasks | undefined>();
    const [deleteSelectedTask, setDeleteSelectedTask] = useState<ITasks | undefined>();

    const queryInput = useMemo(() => (filters), [filters]);

    const { data, isFetching } = api.tasks.list.useQuery(queryInput, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    function applyFilters() {
        setFilters({
            page,
            pageSize,
            createdAtStart: dateRange.from || defaultCreatedAtStart,
            createdAtEnd: dateRange.to || defaultCreatedAtEnd,
            ...(search.trim().length > 0 && { search: search }),
            ...(status && { status }),
        });
    }

    const columnHelper = useMemo(() => createColumnHelper<ITasks>(), []);

    const ActionButtons = useCallback(({ row }: { row: Row<ITasks> }) => {
        const handleEdit = () => setEditSelectedTask(row.original);
        const handleDelete = () => setDeleteSelectedTask(row.original);

        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleEdit}><Edit className={cn("size-5 cursor-pointer text-gray-300 hover:text-gray-500/50")} /></button>
                <button onClick={handleDelete}><Trash className={cn("size-5 cursor-pointer text-red-400 hover:text-red-500/50")} /></button>
            </div>
        );
    }, []);

    const columns: Array<ColumnDef<ITasks>> = useMemo(() => [
        {
            accessorKey: "code",
            header: "Código",
        },
        {
            accessorKey: "title",
            header: "Nome",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => getLabelByValue(TasksStatusConfig, getValue<string>()),
        },
        {
            accessorKey: "priority",
            header: "Prioridade",
            cell: ({ getValue }) => getLabelByValue(TasksPriorityConfig, getValue<string>()),
        },
        {
            accessorKey: "category",
            header: "Categoria",
            cell: ({ getValue }) => getLabelByValue(TasksCategoryConfig, getValue<string>()),
        },
        {
            accessorKey: "createdAt",
            header: "Criada em",
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return "--";
                return new Date(value).toLocaleDateString();
            },
        },
        {
            accessorKey: "startedAt",
            header: "Iniciada em",
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return "--";
                return new Date(value).toLocaleDateString();
            },
        },
        {
            accessorKey: "resolvedAt",
            header: "Finalizada em",
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return "--";
                return new Date(value).toLocaleDateString();
            },
        },
        {
            accessorKey: "deadline",
            header: "Prazo",
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return "--";
                return new Date(value).toLocaleDateString();
            },
        },
        columnHelper.display({
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => <ActionButtons row={row} />,
        }),
    ], [columnHelper, ActionButtons]);

    const tasks = useMemo(() => data?.items ?? [], [data?.items]);

    const tableSorting = useMemo(() => [{ id: sorting.id, desc: sorting.desc }], [sorting.id, sorting.desc]);

    const table = useReactTable({
        data: tasks,
        columns,
        state: {
            sorting: tableSorting,
        },
        onSortingChange: (newSort: any) => {
            if (newSort.length > 0) {
                setSorting({ id: newSort[0].id, desc: newSort[0].desc });
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <>
            <DeleteTasksModal setData={setDeleteSelectedTask} data={deleteSelectedTask} />
            <EditTasksModal setData={setEditSelectedTask} data={editSelectedTask} />

            <div className="space-y-4 p-4 border rounded-md bg-white/10 w-[90%] max-w-[1300px] mx-auto">
                <Button
                    className="cursor-pointer"
                    onClick={() => router.push("/tasks/form")}
                >
                    Criar nova tarefa
                </Button>
                <div className="flex gap-2">
                    <Input placeholder="Pesquisar" value={search} onChange={(e) => setSearch(e.target.value)} />
                    {/* <Input placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} /> */}

                    <SimpleSelect
                        name="status"
                        value={status}
                        onChange={(value) => {
                            console.log({ value })
                            setStatus(value);
                            setPage(1);
                        }}
                        options={statusOptions}
                    />

                    <SimpleDateRangePicker
                        name="period"
                        value={dateRange}
                        onChange={setDateRange as any}
                        dateFormat="dd/MM/yy"
                    />

                    <Button onClick={() => applyFilters()}>Aplicar</Button>
                </div>

                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        className="cursor-pointer"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: " ▲",
                                            desc: " ▼",
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {isFetching ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="flex gap-2 items-center">
                    <Button onClick={() => setPage(() => Math.max(page - 1, 1))} disabled={page === 1}>Previous</Button>
                    <span>{`Page ${data?.page ?? 1} of ${data?.totalPages ?? 1}`}</span>
                    <Button onClick={() => setPage(() => page + 1)} disabled={page === data?.totalPages}>Next</Button>
                </div>
            </div>
        </>
    );
}
