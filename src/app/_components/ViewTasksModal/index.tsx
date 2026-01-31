"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Modal } from "~/app/_components/Modal";
import type { ITasks } from "~/app/_types/tasks.types";
import { DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";

import { getLabelByValue } from "~/lib/constantsToLabels";
import { TasksStatusConfig, type TaskStatusType } from "~/constants/tasksStatus";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { InfoItem } from "../InfoItem";
import { getColorByStatus } from "~/lib/getColorByStatus";

interface IViewTasksModal {
    data: ITasks | undefined;
    setData: (data: ITasks | undefined) => void;
}

export function ViewTasksModal({ data, setData }: IViewTasksModal) {
    if (!data) return null;

    return (
        <Modal
            className="sm:max-w-[900px]"
            open={!!data}
            setOpen={() => setData(undefined)}
        >
            <div className="p-10 space-y-6 max-w-[900px]">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        <strong>{data.code} — {data.title}</strong>
                    </DialogTitle>

                    {!!data.description?.length && <DialogDescription>
                        {data.description}
                    </DialogDescription>}
                </DialogHeader>

                <FieldGroup>
                    <div className="grid grid-cols-2 gap-6">
                        <InfoItem label="Código" value={data.code} />
                        <InfoItem
                            label="Status"
                            value={getLabelByValue(TasksStatusConfig, data.status)}
                            className={`text-sm font-medium ${getColorByStatus(data.status as TaskStatusType)}`}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <InfoItem
                            label="Categoria"
                            value={getLabelByValue(
                                TasksCategoryConfig,
                                data.category
                            )}
                        />

                        <InfoItem
                            label="Prioridade"
                            value={getLabelByValue(
                                TasksPriorityConfig,
                                data.priority
                            )}
                        />

                        <InfoItem
                            label="Prazo"
                            value={
                                data.deadline
                                    ? data.deadline.toLocaleDateString("pt-BR")
                                    : "—"
                            }
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <InfoItem
                            label="Criada em"
                            value={data.createdAt.toLocaleDateString("pt-BR")}
                        />

                        <InfoItem
                            label="Iniciada em"
                            value={
                                data.startedAt
                                    ? data.startedAt.toLocaleDateString("pt-BR")
                                    : "—"
                            }
                        />

                        <InfoItem
                            label="Concluída em"
                            value={
                                data.resolvedAt
                                    ? data.resolvedAt.toLocaleDateString("pt-BR")
                                    : "—"
                            }
                        />
                    </div>
                </FieldGroup>

                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setData(undefined)}
                        className="min-w-[120px] cursor-pointer"
                    >
                        Fechar
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
