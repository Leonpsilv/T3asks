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
    type OnChangeFn,
    type Row,
    type SortingState,
} from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { DeleteTasksModal } from "./_components/DeleteTasksModal";
import { useRouter } from "next/navigation";

interface ITasks {
    id: string;
    code: number;
    title: string | null;
    description: string | null;
    status: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    resolvedAt: Date | null;
    deadline: Date | null;
    priority: string | null;
    category: string | null;
}

const defaultCreatedAtStart = new Date(0);
const defaultCreatedAtEnd = new Date("2026-02-10");

export default function TasksList() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({ id: "createdAt", desc: true });
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [createdAtStart, setCreatedAtStart] = useState<Date | null>(null);
    const [createdAtEnd, setCreatedAtEnd] = useState<Date | null>(null);

    const [deleteSelectedTask, setDeleteSelectedTask] = useState<boolean>(false);

    const queryInput = useMemo(() => ({
        page,
        pageSize,
        search: search || undefined,
        status: status || undefined,
        createdAtStart: createdAtStart ?? defaultCreatedAtStart,
        createdAtEnd: createdAtEnd ?? defaultCreatedAtEnd,
    }), [page, pageSize, search, status, createdAtStart, createdAtEnd]);

    const { data, isFetching } = api.tasks.list.useQuery(queryInput, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const columnHelper = useMemo(() => createColumnHelper<ITasks>(), []);

    const ActionButtons = useCallback(({ row }: { row: Row<ITasks> }) => {
        const handleView = () => { };
        const handleDelete = () => setDeleteSelectedTask(true);

        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleView}>View</button>
                <button onClick={handleDelete}>Delete</button>
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
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return "--";
                return value ?? "--";
            },
        },
        {
            accessorKey: "priority",
            header: "Prioridade",
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return "--";
                return value ?? "--";
            },
        },
        {
            accessorKey: "category",
            header: "Categoria",
            cell: ({ getValue }) => {
                const value = getValue<string>();
                if (!value) return "--";
                return value ?? "--";
            },
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
            <DeleteTasksModal setOpen={setDeleteSelectedTask} open={deleteSelectedTask} />

            <div className="space-y-4 p-4 border rounded-md bg-white/10 w-[90%] max-w-[1300px] mx-auto">
                <Button onClick={() => router.push("/tasks/form")}>Criar nova tarefa</Button>
                <div className="flex gap-2">
                    <Input placeholder="Search title" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Input placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />

                    {/* <DatePicker
                    selected={createdAtStart}
                    onChange={(date) => setCreatedAtStart(date)}
                    placeholderText="Created From"
                />

                <DatePicker
                    selected={createdAtEnd}
                    onChange={(date) => setCreatedAtEnd(date)}
                    placeholderText="Created To"
                /> */}

                    <Button onClick={() => setPage(1)}>Aplicar</Button>
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
