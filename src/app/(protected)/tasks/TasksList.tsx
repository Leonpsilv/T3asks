"use client";

import { redirect } from "next/navigation";
import { useMemo, useState } from "react";
import { api } from "~/trpc/react";

export default function TasksList() {
    const utils = api.useUtils();
    const [status, setStatus] = useState<string>();
    const [search, setSearch] = useState("");

    const createdAtStart = useMemo(() => new Date("2026-01-01"), []);
    const createdAtEnd = useMemo(() => new Date("2026-02-10"), []);


    const { data: tasks, isLoading } = api.tasks.list.useQuery({
        status,
        search,
        createdAtStart,
        createdAtEnd,
    });


    const deleteTask = api.tasks.delete.useMutation({
        onSuccess: () => {
            utils.tasks.list.invalidate();
        },
    });

    if (isLoading) return <p>Carregando tasks...</p>;

    return (
        <div className="space-y-4">
            <header className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Minhas Tasks</h1>

                <button className="btn-primary" onClick={() => redirect("/tasks/form")}>
                    Nova Task
                </button>
            </header>

            {/* Filtros */}
            <div className="flex gap-2">
                <input
                    placeholder="Buscar por título"
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="input"
                    onChange={(e) => setStatus(e.target.value || undefined)}
                >
                    <option value="">Todas</option>
                    <option value="pending">Pendentes</option>
                    <option value="done">Concluídas</option>
                </select>
            </div>

            {/* Tabela */}
            <table className="w-full border">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Status</th>
                        <th>Criada em</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {tasks?.map((task) => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.status}</td>
                            <td>
                                {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="flex gap-2">
                                <button className="btn-secondary">Editar</button>
                                <button
                                    className="btn-danger"
                                    onClick={() => deleteTask.mutate({ id: task.id })}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
