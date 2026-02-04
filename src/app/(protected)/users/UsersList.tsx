"use client";

import {
    getCoreRowModel,
    useReactTable,
    type ColumnDef
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "~/app/_components/DataTable";
import { FiltersActions } from "~/app/_components/DataTable/FiltersAction";
import { FiltersContainer } from "~/app/_components/DataTable/FiltersContainer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
            <FiltersContainer>
                <Input
                    placeholder="Pesquisar usuário"
                    className="!placeholder-gray-300 text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div />

                <div />

                <FiltersActions
                    onApply={applyFilters}
                    onClear={clearFilters}
                    disableClear={!search}
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
                emptyMessage="Nenhum usuário encontrado"
            />
        </div>
    );
}
