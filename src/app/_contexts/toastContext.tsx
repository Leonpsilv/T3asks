"use client";

import { createContext, useContext, type ReactNode, } from "react";
import { toast } from "sonner";

type ToastContextType = {
    success: (title: string, description?: string) => void;
    error: (error: unknown, description?: unknown) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    function success(title: string, description?: string) {
        toast.success(title, { description });
    }

    function error(error: unknown, descriptionErr?: unknown) {
        let message = "Algo deu errado. Tente novamente.";
        let description;

        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === "string") {
            message = error;
        }

        if (descriptionErr instanceof Error) {
            description = descriptionErr.message;
        } else if (typeof descriptionErr === "string") {
            description = descriptionErr;
        }

        toast.error(message, {
            descriptionClassName: "!text-gray-700",
            description
        });
    }

    function info(message: string) {
        toast(message); // sonner usa toast() para mensagem padrão
    }

    function warning(message: string, description?: string) {
        toast.warning(message, { description });
    }

    return (
        <ToastContext.Provider value={{ success, error, info, warning }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useAppToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useAppToast deve ser usado dentro de ToastProvider");
    }
    return ctx;
}
