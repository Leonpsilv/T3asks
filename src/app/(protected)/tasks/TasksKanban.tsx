"use client";

import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { api } from "~/trpc/react";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { TaskColumn } from "~/app/_components/Kanban/Column";
import { SimpleDateRangePicker } from "~/app/_components/DateRangePicker";
import { SimpleSelect } from "~/app/_components/SimpleSelect";
import { Input } from "~/components/ui/input";
import { FiltersContainer } from "~/app/_components/DataTable/FiltersContainer";
import { FiltersActions } from "~/app/_components/DataTable/FiltersAction";

const statusOptions = [
    { value: "clear", label: "Todos os status" },
    ...Object.values(TasksStatusConfig).map((status) => ({
        value: status.value,
        label: status.label,
    })),
];

export default function TasksBoardPage() {
    const getDefaultDates = () => {
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 60);
        return { start, end };
    };

    const [dateRange, setDateRange] = useState<DateRange>(() => {
        const { start, end } = getDefaultDates();
        return { from: start, to: end };
    });

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>("clear");

    const [filters, setFilters] = useState(() => {
        const { start, end } = getDefaultDates();
        return {
            createdAtStart: start,
            createdAtEnd: end,
        };
    });

    const queryInput = useMemo(() => filters, [filters]);

    const { data, isFetching } = api.tasks.boardWithFilters.useQuery(queryInput, {
        refetchOnMount: true,
    });

    function applyFilters() {
        const { start, end } = getDefaultDates();
        setFilters({
            createdAtStart: dateRange.from ?? start,
            createdAtEnd: dateRange.to ?? end,
            ...(search.trim().length > 0 && { search }),
            ...((status && status !== "clear") && { status }),
        });
    }

    function clearFilters() {
        setSearch("");
        setStatus("clear");

        const { start, end } = getDefaultDates();

        setDateRange({
            from: start,
            to: end,
        });

        setFilters({
            createdAtStart: start,
            createdAtEnd: end,
        });
    }

    return (
        <div className="space-y-4 p-4">
            <div className="rounded-xl shadow-xl bg-white/15 p-4 w-full max-w-[1600px] mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-white">Quadro Kanban</h1>

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
                        defaultValue="clear"
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
            </div>

            {isFetching ? (
                <div className="flex items-center justify-center p-12">
                    <p className="text-white text-lg">Carregando...</p>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {Object.values(TasksStatusConfig).map((statusConfig) => (
                        <TaskColumn
                            key={statusConfig.value}
                            status={statusConfig.value}
                            label={statusConfig.label}
                            tasks={data?.filter((task) => task.status === statusConfig.value) ?? []}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
