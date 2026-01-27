"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "~/trpc/react";

import { createTaskSchema, type CreateTaskInput } from "~/schemas/create-task.schema";


import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectItem } from "~/components/ui/select";
import { SimpleSelect } from "~/app/_components/SimpleSelect";


export function CreateTaskForm() {
    const utils = api.useUtils();

    const form = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            status: "pending",
        },
    });

    const createTask = api.tasks.create.useMutation({
        onSuccess: async () => {
            await utils.tasks.list.invalidate();
            form.reset();
        },
    });

    function onSubmit(data: CreateTaskInput) {
        createTask.mutate(data);
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Título */}
            <Input
                placeholder="Título da task"
                {...form.register("title")}
            />

            {/* Descrição */}
            <Textarea
                placeholder="Descrição"
                {...form.register("description")}
            />

            {/* Status */}
            <SimpleSelect
                onChange={(value) =>
                    form.setValue("status", value)}
                options={[
                    { value: "pending", label: "Pendente" },
                    { value: "holding", label: "Congelada" },
                    { value: "in_progress", label: "Em progresso" },
                    { value: "done", label: "Concluída" },
                ]}
                defaultValue="pending"
            />

            {/* Prioridade */}
            <SimpleSelect
                onChange={(value) =>
                    form.setValue("priority", value)}
                options={[
                    { value: "low", label: "Baixa" },
                    { value: "medium", label: "Média" },
                    { value: "high", label: "Alta" },
                ]}
                defaultValue="low"
            />

            {/* Categoria */}
            <Input
                placeholder="Categoria"
                {...form.register("category")}
            />

            {/* Deadline */}
            <Input
                type="date"
                onChange={(e) =>
                    form.setValue(
                        "deadline",
                        e.target.value
                            ? new Date(e.target.value)
                            : undefined
                    )
                }
            />

            <Button type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? "Criando..." : "Criar task"}
            </Button>
        </form>
    );
}
