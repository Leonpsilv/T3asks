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

import { Edit, Trash, View } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { DataTable } from "~/app/_components/DataTable";
import { SimpleDateRangePicker } from "~/app/_components/DateRangePicker";
import { SimpleSelect } from "~/app/_components/SimpleSelect";
import { ViewTasksModal } from "~/app/_components/ViewTasksModal";
import type { ITasks } from "~/app/_types/tasks.types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { getLabelByValue } from "~/lib/constantsToLabels";
import { cn } from "~/lib/utils";
import { DeleteTasksModal } from "../../_components/DeleteTasksModal";
import { EditTasksModal } from "../../_components/EditTasksModal";
import { FiltersActions } from "~/app/_components/DataTable/FiltersAction";
import { FiltersContainer } from "~/app/_components/DataTable/FiltersContainer";



interface ITasksListFilters {
    page: number;
    pageSize: number;
    createdAtStart: Date;
    createdAtEnd: Date;
    search?: string;
    status?: string;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
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

const DEFAULT_FILTERS: ITasksListFilters = {
    page: 1,
    pageSize: 10,
    createdAtStart: defaultCreatedAtStart,
    createdAtEnd: defaultCreatedAtEnd,
    orderBy: "createdAt",
    orderDirection: "desc",
};

export default function TasksList() {
    const router = useRouter();

    const [dateRange, setDateRange] = useState<DateRange>({
        from: defaultCreatedAtStart,
        to: defaultCreatedAtEnd,
    });

    const [pageSize] = useState(10);
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({ id: "createdAt", desc: true });

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>();

    const [filters, setFilters] = useState<ITasksListFilters>(DEFAULT_FILTERS);

    const [editSelectedTask, setEditSelectedTask] = useState<ITasks | undefined>();
    const [deleteSelectedTask, setDeleteSelectedTask] = useState<ITasks | undefined>();
    const [viewSelectedTask, setViewSelectedTask] = useState<ITasks | undefined>()

    const queryInput = useMemo(() => (filters), [filters]);

    const { data, isFetching } = api.tasks.list.useQuery(queryInput);

    function applyFilters() {
        setFilters({
            ...filters,
            page: 1,
            pageSize,
            createdAtStart: dateRange.from || defaultCreatedAtStart,
            createdAtEnd: dateRange.to || defaultCreatedAtEnd,
            ...(search.trim().length > 0 && { search }),
            ...(status && { status }),
        });
    }

    function clearFilters() {
        setSearch("");
        setStatus(undefined);

        setDateRange({
            from: defaultCreatedAtStart,
            to: defaultCreatedAtEnd,
        });

        setFilters(DEFAULT_FILTERS);
    }

    const goToPage = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };


    const columnHelper = useMemo(() => createColumnHelper<ITasks>(), []);

    const ActionButtons = useCallback(({ row }: { row: Row<ITasks> }) => {
        const task = row.original;
        const handleEdit = () => setEditSelectedTask(task);
        const handleDelete = () => setDeleteSelectedTask(task);
        const handleView = () => setViewSelectedTask(task);

        return (
            <div className="flex gap-[8px] items-center">
                <button onClick={handleView}><View className={cn("size-5 cursor-pointer text-blue-300 hover:text-blue-300/50")} /></button>
                {(task.status !== TasksStatusConfig.DONE.value) && <button onClick={handleEdit}><Edit className={cn("size-5 cursor-pointer text-gray-300 hover:text-gray-500/50")} /></button>}
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
            enableSorting: false,
        },
        {
            accessorKey: "priority",
            header: "Prioridade",
            cell: ({ getValue }) => getLabelByValue(TasksPriorityConfig, getValue<string>()),
            enableSorting: false,
        },
        {
            accessorKey: "category",
            header: "Categoria",
            cell: ({ getValue }) => getLabelByValue(TasksCategoryConfig, getValue<string>()),
            enableSorting: false,
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
            enableSorting: false,
            cell: ({ row }) => <ActionButtons row={row} />,
        }),
    ], [columnHelper, ActionButtons]);

    const tasks = useMemo(() => data?.items ?? [], [data?.items]);

    const table = useReactTable({
        data: tasks,
        columns,
        state: {
            sorting: [{ id: sorting.id, desc: sorting.desc }],
        },
        manualSorting: true,
        onSortingChange: (updaterFn: any) => {
            const updater = updaterFn()
            const nextSort = updater[0];

            if (!nextSort) return;

            setSorting({
                id: nextSort.id,
                desc: nextSort.desc,
            });

            setFilters((prev) => ({
                ...prev,
                page: 1,
                sortBy: nextSort.id,
                sortOrder: nextSort.desc ? "desc" : "asc",
            }));
        },
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <DeleteTasksModal setData={setDeleteSelectedTask} data={deleteSelectedTask} />
            <EditTasksModal setData={setEditSelectedTask} data={editSelectedTask} />
            <ViewTasksModal data={viewSelectedTask} setData={setViewSelectedTask} />

            <div className="space-y-4 p-4 rounded-xl shadow-xl bg-white/15 w-[90%] max-w-[1300px] mx-auto">
                <Button
                    className="cursor-pointer w-full sm:w-fit bg-green-400/50 hover:bg-green-700/50 disabled:cursor-default disabled:bg-green-400/20"
                    onClick={() => router.push("/tasks/form")}
                >
                    Criar nova tarefa
                </Button>

                <FiltersContainer>
                    <Input
                        placeholder="Pesquisar"
                        className="!placeholder-gray-300 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <SimpleSelect
                        name="status"
                        value={status}
                        onChange={setStatus}
                        options={statusOptions}
                    />

                    <SimpleDateRangePicker
                        name="period"
                        value={dateRange}
                        onChange={setDateRange as any}
                        dateFormat="dd/MM/yy"
                    />

                    <FiltersActions
                        onApply={applyFilters}
                        onClear={clearFilters}
                        disableClear={!search && !status}
                    />
                </FiltersContainer>

                <DataTable
                    columns={columns}
                    table={table}
                    isLoading={isFetching}
                    page={data?.page ?? 1}
                    totalPages={data?.totalPages ?? 1}
                    onPageChange={goToPage}
                    pageSize={pageSize}
                    emptyMessage="Nenhuma tarefa encontrada"
                />
            </div>
        </>
    );
}
