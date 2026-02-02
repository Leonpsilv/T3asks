"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

interface IUserTasksSummary {
    userId: string;
    name: string;
    email: string;
    totalTasks: number;
    completedRate: number;
    delayedRate: number;
    inProgress: number;
}

interface IUsersListFilters {
    page: number;
    pageSize: number;
    search?: string;
}

const DEFAULT_FILTERS: IUsersListFilters = {
    page: 1,
    pageSize: 10,
};


export default function UsersList() {
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState<IUsersListFilters>(DEFAULT_FILTERS);

    const queryInput = useMemo(() => filters, [filters]);

    const { data, isFetching } = api.users.list.useQuery(queryInput);

    function applyFilters() {
        setFilters({
            page: 1,
            pageSize,
            ...(search.trim().length > 0 && { search }),
        });
    }

    const columns = useMemo<ColumnDef<IUserTasksSummary>[]>(() => [
        {
            accessorKey: "name",
            header: "Usuário",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "totalTasks",
            header: "Tasks Criadas",
        },
        {
            accessorKey: "inProgress",
            header: "Em Andamento",
        },
        {
            accessorKey: "completedRate",
            header: "Conclusão",
            cell: ({ getValue }) => `${getValue<number>()}%`,
        },
        {
            accessorKey: "delayedRate",
            header: "Atraso",
            cell: ({ getValue }) => `${getValue<number>()}%`,
        },
    ], []);

    const users = useMemo(() => data?.items ?? [], [data?.items]);

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    function clearFilters() {
        setSearch("");
        setFilters(DEFAULT_FILTERS);
    }

    const goToPage = (newPage: number) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };


    return (
        <div className="space-y-4 p-4 rounded-xl shadow-xl bg-white/15 w-[90%] max-w-[1300px] mx-auto">
            <div className="flex gap-2">
                <Input
                    placeholder="Pesquisar usuário"
                    className="!placeholder-gray-300 text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    className="cursor-pointer bg-green-400/50 hover:bg-green-700/50 disabled:cursor-default disabled:bg-green-400/20"
                    onClick={applyFilters}
                >
                    Aplicar
                </Button>
                <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!search}
                    className="cursor-pointer"
                >
                    Limpar
                </Button>
            </div>

            {/* 📋 Tabela */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableCell className="text-white" key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isFetching ? (
                        Array.from({ length: pageSize }).map((_, rowIndex) => (
                            <TableRow key={`skeleton-row-${rowIndex}`}>
                                {columns.map((_, colIndex) => (
                                    <TableCell key={`skeleton-cell-${colIndex}`}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell className="text-white" key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center text-muted-foreground text-white"
                            >
                                Nenhum usuário encontrada
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

            </Table>

            {/* ⏭ Paginação */}
            <div className="flex gap-2 items-center justify-end">
                <Button
                    onClick={() => goToPage(Math.max(filters.page - 1, 1))}
                    disabled={filters.page === 1}
                >
                    <ArrowBigLeft />
                </Button>

                <span className="text-white">
                    Página {data?.page ?? 1} de {data?.totalPages ?? 1}
                </span>

                <Button
                    onClick={() => goToPage(filters.page + 1)}
                    disabled={filters.page === data?.totalPages}
                >
                    <ArrowBigRight />
                </Button>
            </div>
        </div>
    );
}
