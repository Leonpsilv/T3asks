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
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState<IUsersListFilters>(DEFAULT_FILTERS);

    const queryInput = useMemo(() => filters, [filters]);

    const { data, isFetching } = api.users.list.useQuery(queryInput);

    function applyFilters() {
        setPage(1);
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
        setPage(1);
        setFilters(DEFAULT_FILTERS);
    }


    return (
        <div className="space-y-4 p-4 border rounded-md bg-white/10 w-[90%] max-w-[1100px] mx-auto">
            <div className="flex gap-2">
                <Input
                    placeholder="Pesquisar usuário"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button className="cursor-pointer" onClick={applyFilters}>Aplicar</Button>
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
                                <TableCell key={header.id}>
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
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* ⏭ Paginação */}
            <div className="flex gap-2 items-center justify-end">
                <Button
                    onClick={() => {
                        const newPage = Math.max(page - 1, 1);
                        setPage(newPage);
                        setFilters((f) => ({ ...f, page: newPage }));
                    }}
                    disabled={page === 1}
                >
                    Previous
                </Button>

                <span>
                    Page {data?.page ?? 1} of {data?.totalPages ?? 1}
                </span>

                <Button
                    onClick={() => {
                        const newPage = page + 1;
                        setPage(newPage);
                        setFilters((f) => ({ ...f, page: newPage }));
                    }}
                    disabled={page === data?.totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
