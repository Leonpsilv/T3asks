"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { getLabelByValue } from "~/lib/constantsToLabels";
import { api } from "~/trpc/react";
import LiveClock from "../_components/LiveClock";
import { TasksTable, type ITasksTableColumn } from "../_components/TasksTable";
import { TaskActions } from "../_components/TasksTable/TaskActions";
import { MetricsCard } from "../_components/UserMetricsCards";
import { ViewTasksModal } from "../_components/ViewTasksModal";
import { useAuth } from "../_contexts/authContext";
import type { ITasks } from "../_types/tasks.types";

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [viewSelectedTask, setViewSelectedTask] = useState<ITasks | undefined>()

    const { data, isLoading } = api.tasks.dashboard.useQuery();
    const { inProgress, completed, delayed, metrics } = data ?? { inProgress: [], completed: [], delayed: [], metrics: {} };

    const actionsColumn: ITasksTableColumn<ITasks> = {
        key: "actions",
        label: "Ações",
        render: (_, row) => (
            <TaskActions
                task={row}
                onView={setViewSelectedTask}
            />
        ),
    };

    const defaultColumns: ITasksTableColumn<ITasks>[] = [
        {
            key: "code",
            label: "Código",
        },
        {
            key: "title",
            label: "Tarefa",
        },
    ];

    const delayedColumns: ITasksTableColumn<ITasks>[] = [
        ...defaultColumns,
        {
            key: "status",
            label: "Status",
            render: (value: ITasks[keyof ITasks]) => {
                const typed = value as string | undefined;
                return getLabelByValue(TasksStatusConfig, typed)
            }
        },
        {
            key: "deadline",
            label: "Prazo",
            bodyClassName: "text-center text-red-500 font-semibold",
            render: (value: ITasks[keyof ITasks]) => {
                const typed = value as Date | undefined;
                return typed ? typed.toLocaleDateString("pt-BR") : "—"
            }
        },
        actionsColumn
    ]

    const startedColumns: ITasksTableColumn<ITasks>[] = [
        ...defaultColumns,
        {
            key: "startedAt",
            label: "Iniciada em",
            render: (value: ITasks[keyof ITasks]) => {
                const typed = value as Date | undefined;
                return typed ? typed.toLocaleDateString("pt-BR") : "—"
            }
        },
        {
            key: "deadline",
            label: "Prazo",
            render: (value: ITasks[keyof ITasks]) => {
                const typed = value as Date | undefined;
                return typed ? typed.toLocaleDateString("pt-BR") : "—"
            }
        },
        actionsColumn
    ]

    const completedColumns: ITasksTableColumn<ITasks>[] = [
        ...defaultColumns,
        {
            key: "startedAt",
            label: "Iniciada em",
            render: (value: ITasks[keyof ITasks]) => {
                const typed = value as Date | undefined;
                return typed ? typed.toLocaleDateString("pt-BR") : "—"
            }
        },
        {
            key: "resolvedAt",
            label: "Concluída em",
            render: (value: ITasks[keyof ITasks]) => {
                const typed = value as Date | undefined;
                return typed ? typed.toLocaleDateString("pt-BR") : "—"
            }
        },
        actionsColumn
    ]

    return (
        <>
            <ViewTasksModal data={viewSelectedTask} setData={setViewSelectedTask} />
            <div className="w-full h-[calc(100%-40px)] p-[20px] m-[20px] rounded-xl bg-white/15 p-8 text-white shadow-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-[60px] font-semibold">
                            Bem-vindo, {user?.name}! 👋
                        </h1>

                        <LiveClock />
                    </div>

                    <Button
                        onClick={() => router.push("/tasks/form")}
                        className="w-full md:w-auto gap-2 bg-green-400/50 hover:bg-green-700/50 cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        Nova tarefa
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-[20px] mb-[20px]">
                    <MetricsCard
                        isLoading={isLoading}
                        title="Resumo dos últimos 30 dias"
                        items={[
                            {
                                label: "Tasks criadas",
                                value: metrics?.createdLast30Days,
                            },
                            {
                                label: "Tasks concluídas",
                                value: metrics?.completedLast30Days,
                                valueClassName: "text-green-500",
                            },
                        ]}
                    />

                    <MetricsCard
                        isLoading={isLoading}
                        title="Informações importantes"
                        items={[
                            {
                                label: "Tasks atrasadas",
                                value: metrics?.delayedNotCompleted,
                                valueClassName: "text-red-500",
                            },
                            {
                                label: "Tasks congeladas",
                                value: metrics?.holdingNotCompleted,
                                valueClassName: "text-blue-500",
                            },
                        ]}
                    />
                </div>

                <div
                    className="grid gap-6 max-w-full md:grid-cols-2 xl:grid-cols-3"
                >
                    <TasksTable
                        isLoading={isLoading}
                        title="Em andamento"
                        tasks={inProgress}
                        emptyLabel="Nenhuma tarefa em andamento"
                        columns={startedColumns}
                        defaultBodyCellsClassName={"text-center font-semibold"}
                        defaultHeaderCellsClassName={"text-center"}
                    />

                    <TasksTable
                        isLoading={isLoading}
                        title="Concluídas recentemente"
                        tasks={completed}
                        emptyLabel="Nenhuma tarefa concluída"
                        columns={completedColumns}
                        defaultBodyCellsClassName={"text-center font-semibold"}
                        defaultHeaderCellsClassName={"text-center"}
                    />

                    <TasksTable
                        isLoading={isLoading}
                        title="Últimas atrasadas"
                        tasks={delayed}
                        emptyLabel="Nenhuma tarefa atrasada 🎉"
                        columns={delayedColumns}
                        defaultBodyCellsClassName={"text-center font-semibold"}
                        defaultHeaderCellsClassName={"text-center"}
                    />
                </div>
            </div>
        </>
    );
}