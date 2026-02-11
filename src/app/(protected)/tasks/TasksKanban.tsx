"use client";

import { api } from "~/trpc/react";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { TaskColumn } from "~/app/_components/Kanban/Column";

export default function TasksBoardPage() {
    const { data, isLoading } = api.tasks.board.useQuery();

    if (isLoading) return <p>Carregando...</p>;

    return (
        <div className="flex gap-4 overflow-x-auto p-4">
            {Object.values(TasksStatusConfig).map((status) => (
                <TaskColumn
                    key={status.value}
                    status={status.value}
                    label={status.label}
                    tasks={data?.filter((task) => task.status === status.value) ?? []}
                />
            ))}
        </div>
    );
}
