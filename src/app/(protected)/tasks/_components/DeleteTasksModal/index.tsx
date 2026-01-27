"use client";

import { useEffect, useState } from "react";



import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Modal } from "~/app/_components/Modal";
import { DialogHeader } from "~/components/ui/dialog";
import { api } from "~/trpc/react";

interface IDeleteTasksModal {
    open: boolean
    setOpen: (open: boolean) => void;
}

export function DeleteTasksModal({ open, setOpen }: IDeleteTasksModal) {
    const utils = api.useUtils();

    const deleteTask = api.tasks.delete.useMutation({
        onSuccess: () => {
            utils.tasks.list.invalidate();
        },
    });

    return (
        <>
            <Modal
                open={open}
                setOpen={setOpen}
            >
                <div className="p-[40px]">
                    <DialogHeader>
                        <DialogTitle>Scrollable Content</DialogTitle>
                        <DialogDescription>
                            This is a dialog with scrollable content.
                        </DialogDescription>
                    </DialogHeader>
                    <span className="background">TESTANDO AQUI</span>
                </div>
            </Modal>
        </>
    );
}
