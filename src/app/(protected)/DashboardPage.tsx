"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { TasksStatusConfig, type TaskStatusType } from "~/constants/tasksStatus";
import { getLabelByValue } from "~/lib/constantsToLabels";
import { api } from "~/trpc/react";
import { TasksTable, type ITasksTableColumn } from "../_components/TasksTable";
import type { ITasks } from "../_types/tasks.types";

// Tipagem simples para o dashboard
type Task = {
    id: string;
    title: string;
    status: TaskStatusType;
    deadline?: Date;
    createdAt: Date;
};

interface DashboardProps {
    tasks: Task[];
    onCreateTask: () => void;
}

export default function DashboardPage() {
    const router = useRouter();

    const { data, isLoading } = api.tasks.dashboard.useQuery();

    console.log({ data })
    const { inProgress, completed, delayed } = data || { inProgress: [], done: [], late: [] };

    const now = new Date();

    const greeting = useMemo(() => {
        return now.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }, [now]);

    const time = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

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
    ]

    return (
        <div className="w-full h-[calc(100%-40px)] p-[20px] m-[20px] rounded-xl bg-gray-700/25 p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[60px] font-semibold">Bem-vindo 👋</h1>
                    <p className="text-[30px] text-muted-foreground capitalize">
                        {greeting} · {time}
                    </p>
                </div>

                <Button onClick={() => router.push("/tasks/form")} className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Nova tarefa
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <TasksTable
                    title="Em andamento"
                    tasks={inProgress}
                    emptyLabel="Nenhuma tarefa em andamento"
                    columns={startedColumns}
                    defaultBodyCellsClassName={"text-center font-semibold"}
                    defaultHeaderCellsClassName={"text-center"}
                />

                <TasksTable
                    title="Concluídas recentemente"
                    tasks={completed}
                    emptyLabel="Nenhuma tarefa concluída"
                    columns={completedColumns}
                    defaultBodyCellsClassName={"text-center font-semibold"}
                    defaultHeaderCellsClassName={"text-center"}
                />

                <TasksTable
                    title="Últimas atrasadas"
                    tasks={delayed}
                    emptyLabel="Nenhuma tarefa atrasada 🎉"
                    columns={delayedColumns}
                    defaultBodyCellsClassName={"text-center font-semibold"}
                    defaultHeaderCellsClassName={"text-center"}
                />
            </div>
        </div>
    );
}