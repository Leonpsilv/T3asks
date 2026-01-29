"use client";

import {
    Dialog,
    DialogContent
} from "~/components/ui/dialog";

export interface IModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ open, setOpen, children, className }: IModalProps) {

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent showCloseButton={false} className={className ?? "sm:max-w-[425px]"}>
                {children}
            </DialogContent>
        </Dialog >
    )
}
