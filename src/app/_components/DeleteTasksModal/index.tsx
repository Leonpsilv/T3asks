"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Modal } from "~/app/_components/Modal";
import type { ITasks } from "~/app/_types/tasks.types";
import { DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { LoaderIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useAppToast } from "~/app/_contexts/toastContext";

interface IDeleteTasksModal {
    data: ITasks | undefined;
    setData: (data: ITasks | undefined) => void;
}

export function DeleteTasksModal({ data, setData }: IDeleteTasksModal) {
    const utils = api.useUtils();
    const toast = useAppToast();

    const deleteTask = api.tasks.delete.useMutation({
        onSuccess: async () => {
            toast.success("Tarefa excluída com sucesso!");
            await utils.tasks.list.invalidate();
            setData(undefined);
        },
    });

    function handleDelete() {
        try {
            if (!data) throw new Error("Falha ao obter informações da tarefa!");

            deleteTask.mutate({
                id: data.id,
            });
        } catch (e) {
            console.error({ e })
            const error = "Erro inesperado. Tente novamente em alguns minutos."
            toast.error(error);
        }
    }

    return (
        <Modal open={!!data} setOpen={() => setData(undefined)}>
            <div className="sm:p-10 p-3 space-y-6 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Excluir task
                    </DialogTitle>

                    <DialogDescription>
                        Tem certeza que deseja excluir a task{" "}
                        <strong>{data?.title}</strong>?
                        Essa ação não poderá ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-end gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setData(undefined)}
                        disabled={deleteTask.isPending}
                        className="cursor-pointer min-w-[120px]"
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteTask.isPending}
                        className="cursor-pointer min-w-[120px]"
                    >
                        {deleteTask.isPending ?
                            <LoaderIcon
                                role="status"
                                aria-label="Loading"
                                className={cn("size-4 animate-spin text-white")}
                            /> : "Excluir"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
