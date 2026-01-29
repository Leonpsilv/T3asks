"use client";

import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Modal } from "~/app/_components/Modal";
import type { ITasks } from "~/app/_types/tasks.types";
import { DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { LoaderIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface IDeleteTasksModal {
    data: ITasks | undefined;
    setData: (data: ITasks | undefined) => void;
}

export function DeleteTasksModal({ data, setData }: IDeleteTasksModal) {
    const utils = api.useUtils();

    const deleteTask = api.tasks.delete.useMutation({
        onSuccess: async () => {
            await utils.tasks.list.invalidate();
            setData(undefined);
        },
    });

    function handleDelete() {
        if (!data) return;

        deleteTask.mutate({
            id: data.id,
        });
    }

    return (
        <Modal open={!!data} setOpen={() => setData(undefined)}>
            <div className="p-10 space-y-6 max-w-md">
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
