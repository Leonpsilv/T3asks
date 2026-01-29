"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Modal } from "~/app/_components/Modal";
import type { ITasks } from "~/app/_types/tasks.types";
import { DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";

import { SimpleInput } from "~/app/_components/SimpleInput";
import { SimpleTextarea } from "~/app/_components/SimpleTextarea";
import { SimpleSelect } from "~/app/_components/SimpleSelect";
import { SimpleDatePicker } from "~/app/_components/DatePicker";
import { FieldGroup } from "~/components/ui/field";

import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { configToOptions } from "~/lib/constantsToOptions";

import { LoaderIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import {
    updateTaskSchema,
    type UpdateTaskInputType,
} from "~/schemas/updateTask.schema";
import { useAppToast } from "~/app/_contexts/toastContext";

interface IEditTasksModal {
    data: ITasks | undefined;
    setData: (data: ITasks | undefined) => void;
}

export function EditTasksModal({ data, setData }: IEditTasksModal) {
    const utils = api.useUtils();
    const toast = useAppToast();

    const form = useForm<UpdateTaskInputType>({
        resolver: zodResolver(updateTaskSchema),
    });

    const updateTask = api.tasks.update.useMutation({
        onSuccess: async () => {
            await utils.tasks.list.invalidate();
            toast.success("Tarefa alterada com sucesso!");
            setData(undefined);
        },
    });

    useEffect(() => {
        if (!data) return;

        form.reset({
            title: data.title ?? undefined,
            description: data.description ?? "",
            status: data.status ?? undefined,
            priority: data.priority ?? undefined,
            category: data.category ?? undefined,
            deadline: data.deadline ? new Date(data.deadline) : undefined,
        });
    }, [data, form]);

    function onSubmit(formData: UpdateTaskInputType) {
        try {
            if (!data) throw new Error("Falha ao obter dados da tarefa!");

            updateTask.mutate({
                id: data.id,
                title: formData.title!,
                description: formData.description,
                status: formData.status!,
                priority: formData.priority,
                category: formData.category,
                deadline: formData.deadline,
            });
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <Modal
            className="sm:max-w-[1200px]"
            open={!!data}
            setOpen={() => setData(undefined)}
        >
            <div className="p-10 space-y-6 max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Editar task
                    </DialogTitle>

                    <DialogDescription>
                        Atualize as informações da task{" "}
                        <strong>{data?.title}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FieldGroup>
                        <div className="flex gap-4">
                            <SimpleInput
                                name="title"
                                title="Título"
                                register={form.register}
                                errorMsg={form.formState.errors.title?.message}
                                required
                            />

                            <Controller
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                    <SimpleDatePicker
                                        name="deadline"
                                        className="min-w-fit max-w-[200px]"
                                        title="Data limite"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <Controller
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <SimpleTextarea
                                    {...field}
                                    placeholder=""
                                    name="description"
                                    title="Descrição"
                                    errorMsg={
                                        form.formState.errors.description
                                            ?.message
                                    }
                                />
                            )}
                        />

                        <div className="flex gap-4">
                            <Controller
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <SimpleSelect
                                        title="Status"
                                        name="status"
                                        options={configToOptions(
                                            TasksStatusConfig
                                        )}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <SimpleSelect
                                        name="priority"
                                        title="Prioridade"
                                        options={configToOptions(
                                            TasksPriorityConfig
                                        )}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <SimpleSelect
                                        name="category"
                                        title="Categoria"
                                        options={configToOptions(
                                            TasksCategoryConfig
                                        )}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </FieldGroup>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setData(undefined)}
                            disabled={updateTask.isPending}
                            className="min-w-[120px] cursor-pointer"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={updateTask.isPending}
                            className="min-w-[120px] cursor-pointer"
                        >
                            {updateTask.isPending ? (
                                <LoaderIcon
                                    role="status"
                                    aria-label="Loading"
                                    className={cn(
                                        "size-4 animate-spin text-white"
                                    )}
                                />
                            ) : (
                                "Salvar alterações"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
