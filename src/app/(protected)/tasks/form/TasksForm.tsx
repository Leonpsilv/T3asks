"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { api } from "~/trpc/react";

import { taskFormSchema, type TaskFormInputType } from "~/schemas/task.schema";


import { SimpleSelect } from "~/app/_components/SimpleSelect";
import { Button } from "~/components/ui/button";

import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SimpleInput } from "~/app/_components/SimpleInput";
import { SimpleTextarea } from "~/app/_components/SimpleTextarea";
import { FieldGroup } from "~/components/ui/field";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { configToOptions } from "~/lib/constantsToOptions";
import { cn } from "~/lib/utils";
import { SimpleDatePicker } from "~/app/_components/DatePicker";
import { useAppToast } from "~/app/_contexts/toastContext";


export function CreateTaskForm() {
    const router = useRouter();
    const toast = useAppToast();
    const utils = api.useUtils();

    const form = useForm<TaskFormInputType>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            status: TasksStatusConfig.PENDING.value,
            priority: TasksPriorityConfig.LOW.value,
            category: TasksCategoryConfig.OTHERS.value,
        },
    });

    const createTask = api.tasks.create.useMutation({
        onSuccess: async () => {
            toast.success("Tarefa cadastrada com sucesso!");
            form.reset();
            await Promise.all([
                utils.tasks.dashboard.invalidate(),
                utils.tasks.list.invalidate(),
            ]);
            router.push("/tasks");
        },
    });

    function onSubmit(data: TaskFormInputType) {
        try {
            createTask.mutate({
                ...data,
                deadline: (!!data?.deadline && data?.deadline.toString().length) ? new Date(data.deadline) : undefined,
            });
        } catch (error) {
            toast.error(error);
        }
    }

    function handleBackBtn(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        router.back();
    }

    return (
        <div className="space-y-4 p-4 bg-white/15 shadow-xl rounded-xl w-full max-w-[900px] mx-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup>
                    <div className="flex align-center flex-col md:flex-row gap-4">
                        <SimpleInput
                            name="title"
                            type="text"
                            placeholder="Título da task"
                            title={<span><strong className="text-red-500 mr-[4px]">*</strong>Título</span>}
                            errorMsg={form.formState.errors.title?.message}
                            register={form.register}
                            required
                        />
                        <Controller
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <SimpleDatePicker
                                    name="deadline"
                                    title="Data limite"
                                    placeholder="Escolha uma data"
                                    value={field.value}
                                    errorMsg={form.formState.errors.deadline?.message}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <SimpleTextarea
                        name="description"
                        title="Descrição"
                        placeholder="Descrição"
                        register={form.register}
                        errorMsg={form.formState.errors.description?.message}
                    />

                    <div className="flex flex-col md:flex-row gap-4">
                        <SimpleSelect
                            onChange={(value) => form.setValue("status", value)}
                            options={configToOptions(TasksStatusConfig)}
                            defaultValue={TasksStatusConfig.PENDING.value}
                            name="status"
                            title="Status"
                        />

                        <SimpleSelect
                            onChange={(value) => form.setValue("priority", value)}
                            options={configToOptions(TasksPriorityConfig)}
                            defaultValue={TasksPriorityConfig.LOW.value}
                            name="priority"
                            title="Prioridade"
                        />

                        <SimpleSelect
                            onChange={(value) => form.setValue("category", value)}
                            options={configToOptions(TasksCategoryConfig)}
                            defaultValue={TasksCategoryConfig.OTHERS.value}
                            name="category"
                            title="Categoria"
                        />
                    </div>
                </FieldGroup>


                <div className="flex flex-col md:flex-row gap-3">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto min-w-[120px] cursor-pointer hover:bg-white/80"
                        onClick={handleBackBtn}
                    >
                        voltar
                    </Button>

                    <Button
                        className="cursor-pointer w-full sm:w-auto min-w-[120px] bg-green-400/50 hover:bg-green-700/50 disabled:cursor-default disabled:bg-green-400/20"
                        type="submit"
                        disabled={createTask.isPending}
                    >
                        {createTask.isPending ?
                            <LoaderIcon
                                role="status"
                                aria-label="Loading"
                                className={cn("size-4 animate-spin text-white")}
                            />
                            :
                            "Criar task"
                        }
                    </Button>
                </div>
            </form>
        </div>
    );
}
