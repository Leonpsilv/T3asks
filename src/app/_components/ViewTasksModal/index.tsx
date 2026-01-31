"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Modal } from "~/app/_components/Modal";
import type { ITasks } from "~/app/_types/tasks.types";
import { DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";

import { getLabelByValue } from "~/lib/constantsToLabels";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { InfoItem } from "../InfoItem";

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
                        Visualizar task
                    </DialogTitle>

                    <DialogDescription>
                        Detalhes da task <strong>{data.title}</strong>
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <div className="grid grid-cols-2 gap-6">
                        <InfoItem label="Código" value={data.code} />
                        <InfoItem
                            label="Status"
                            value={getLabelByValue(TasksStatusConfig, data.status)}
                        />
                    </div>

                    <InfoItem
                        label="Título"
                        value={data.title}
                    />

                    <InfoItem
                        label="Descrição"
                        value={data.description}
                        multiline
                    />

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
