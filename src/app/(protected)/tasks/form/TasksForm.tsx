"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "~/trpc/react";

import { createTaskSchema, type CreateTaskInputType } from "~/schemas/createTask.schema";


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

    const form = useForm<CreateTaskInputType>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            status: TasksStatusConfig.PENDING.value,
            priority: TasksPriorityConfig.LOW.value,
            category: TasksCategoryConfig.OTHERS.value,
        },
    });

    const createTask = api.tasks.create.useMutation({
        onSuccess: async () => {
            await utils.tasks.list.invalidate();
            toast.success("Tarefa cadastrada com sucesso!");
            form.reset();
            router.back();

        },
    });

    function onSubmit(data: CreateTaskInputType) {
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
        <div className="space-y-4 p-4 border rounded-md bg-white/10 w-[90%] max-w-[1300px] mx-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup>
                    <div className="flex align-center gap-4">
                        <SimpleInput
                            name="title"
                            type="text"
                            placeholder="Título da task"
                            title={<span><strong className="text-red-500 mr-[4px]">*</strong>Título</span>}
                            errorMsg={form.formState.errors.title?.message}
                            register={form.register}
                            required
                        />

                        <SimpleDatePicker
                            className="min-w-fit max-w-[200px]"
                            name="deadline"
                            title="Data limite"
                            placeholder="Escolha uma data"
                            errorMsg={form.formState.errors.deadline?.message}
                            register={form.register}
                            onChange={(date) =>
                                form.setValue(
                                    "deadline",
                                    date
                                        ? new Date(date)
                                        : undefined
                                )
                            }
                        />
                    </div>

                    <SimpleTextarea
                        name="description"
                        title="Descrição"
                        placeholder="Descrição"
                        register={form.register}
                        errorMsg={form.formState.errors.description?.message}
                    />

                    <div className="flex items-center justify-start gap-4">
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


                <div className="flex items-center justify-between gap-4 max-w-fit">
                    <Button
                        variant="outline"
                        className="cursor-pointer min-w-[120px]"
                        onClick={handleBackBtn}
                    >
                        voltar
                    </Button>

                    <Button
                        className="cursor-pointer min-w-[120px]"
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
