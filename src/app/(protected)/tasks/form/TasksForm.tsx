"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "~/trpc/react";

import { createTaskSchema, type CreateTaskInput } from "~/schemas/create-task.schema";


import { SimpleSelect } from "~/app/_components/SimpleSelect";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { configToOptions } from "~/lib/constantsToOptions";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksCategoryConfig } from "~/constants/tasksCategory";


export function CreateTaskForm() {
    const utils = api.useUtils();

    const form = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            status: TasksStatusConfig.PENDING.value,
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
                onChange={(value) => form.setValue("status", value)}
                options={configToOptions(TasksStatusConfig)}
                defaultValue={TasksStatusConfig.PENDING.value}
            />

            {/* Prioridade */}
            <SimpleSelect
                onChange={(value) => form.setValue("priority", value)}
                options={configToOptions(TasksPriorityConfig)}
                defaultValue={TasksPriorityConfig.LOW.value}
            />

            {/* Categoria */}
            <SimpleSelect
                onChange={(value) => form.setValue("category", value)}
                options={configToOptions(TasksCategoryConfig)}
                defaultValue={TasksCategoryConfig.OTHERS.value}
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
