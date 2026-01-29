"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Modal } from "~/app/_components/Modal";
import type { ITasks } from "~/app/_types/tasks.types";
import { DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { updateTaskSchema, type UpdateTaskInput } from "~/schemas/updateTask.schema";

interface IEditTasksModal {
    data: ITasks | undefined;
    setData: (data: ITasks | undefined) => void;
}

export function EditTasksModal({ data, setData }: IEditTasksModal) {
    const utils = api.useUtils();

    const form = useForm<UpdateTaskInput>({
        resolver: zodResolver(updateTaskSchema),
    });

    const updateTask = api.tasks.update.useMutation({
        onSuccess: async () => {
            await utils.tasks.list.invalidate();
            setData(undefined);
        },
    });

    useEffect(() => {
        if (!data) return;

        const oldData = {
            title: data.title ?? undefined,
            description: data.description ?? "",
            status: data.status ?? undefined,
            priority: data.priority ?? undefined,
            category: data.category ?? undefined,
            deadline: data.deadline ? new Date(data.deadline) : undefined,
        }

        console.log({ oldData })

        form.reset(oldData);
    }, [data, form]);

    function onSubmit(formData: UpdateTaskInput) {
        if (!data) return;

        updateTask.mutate({
            id: data.id,
            title: formData.title,
            description: formData.description,
            status: formData.status!,
            priority: formData.priority,
            category: formData.category,
            deadline: formData.deadline,
        });
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

                            <SimpleDatePicker
                                className="min-w-fit max-w-[200px]"
                                name="deadline"
                                title="Data limite"
                                register={form.register}
                                value={form.getValues("deadline")}
                                onChange={(date) =>
                                    form.setValue("deadline", date ?? undefined)
                                }
                            />
                        </div>

                        <SimpleTextarea
                            name="description"
                            title="Descrição"
                            placeholder=""
                            value={form.getValues("description")}
                            onChange={(description) =>
                                form.setValue("description", description)
                            }
                            register={form.register}
                            errorMsg={form.formState.errors.description?.message}
                        />

                        <div className="flex gap-4">
                            <SimpleSelect
                                name="status"
                                title="Status"
                                value={form.getValues("status")}
                                options={configToOptions(TasksStatusConfig)}
                                onChange={(value) =>
                                    form.setValue("status", value)
                                }
                            />

                            <SimpleSelect
                                name="priority"
                                title="Prioridade"
                                value={form.getValues("priority")}
                                options={configToOptions(TasksPriorityConfig)}
                                onChange={(value) =>
                                    form.setValue("priority", value)
                                }
                            />

                            <SimpleSelect
                                name="category"
                                title="Categoria"
                                value={form.getValues("category")}
                                options={configToOptions(TasksCategoryConfig)}
                                onChange={(value) =>
                                    form.setValue("category", value)
                                }
                            />
                        </div>
                    </FieldGroup>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setData(undefined)}
                            disabled={updateTask.isPending}
                            className="min-w-[120px]"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={updateTask.isPending}
                            className="min-w-[120px]"
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
