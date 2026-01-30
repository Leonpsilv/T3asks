"use client";

import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Plus } from "lucide-react";
import { TasksStatusConfig, type TaskStatusType } from "~/constants/tasksStatus";
import { api } from "~/trpc/react";
import type { ITasks } from "../_types/tasks.types";
import { router } from "better-auth/api";
import { useRouter } from "next/navigation";

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

// export default function DashboardPage({ tasks, onCreateTask }: DashboardProps) {
export default function DashboardPage() {
    const router = useRouter();

    const { data, isLoading } = api.tasks.dashboard.useQuery();
    // const { data, isLoading } = api.tasks.dashboard.useQuery(undefined, {
    //     refetchOnMount: false,
    //     refetchOnWindowFocus: false,
    //     refetchOnReconnect: false,
    // });

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

    // const inProgress = tasks?.filter((t) => t.status === TasksStatusConfig.IN_PROGRESS.value);
    // const done = tasks?.filter((t) => t.status === TasksStatusConfig.DONE.value).slice(0, 5);
    // const late = tasks?.filter((t) => t.deadline && t.deadline < now && t.status !== TasksStatusConfig.DONE.value);

    return (
        <div className="w-full h-[calc(100%-40px)] p-[20px] m-[20px] rounded-xl bg-gray-700/25 p-8 text-white shadow-xl">
            {/* // <div className="space-y-6 p-6"> */}
            {/* Header */}
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
                {/* <Button onClick={onCreateTask} className="gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Nova tarefa
                </Button> */}
            </div>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <TaskTable
                    title="Em andamento"
                    tasks={inProgress}
                    emptyLabel="Nenhuma tarefa em andamento"
                />

                <TaskTable
                    title="Concluídas recentemente"
                    tasks={completed}
                    emptyLabel="Nenhuma tarefa concluída"
                />

                <TaskTable
                    title="Atrasadas"
                    tasks={delayed}
                    highlight="danger"
                    emptyLabel="Nenhuma tarefa atrasada 🎉"
                />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function TaskTable({
    title,
    tasks,
    emptyLabel,
    highlight,
}: {
    title: string;
    tasks: ITasks[] | undefined;
    emptyLabel: string;
    highlight?: "danger";
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                {tasks?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{emptyLabel}</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tarefa</TableHead>
                                <TableHead className="text-right">Prazo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks?.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">
                                        {task.title}
                                    </TableCell>
                                    <TableCell
                                        className={`text-right text-sm ${highlight === "danger"
                                            ? "text-red-500 font-semibold"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {task.deadline
                                            ? task.deadline.toLocaleDateString("pt-BR")
                                            : "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
