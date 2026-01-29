"use client";

import { Spinner } from "~/components/ui/spinner";

interface SubmitButtonProps {
    label: string;
    isPending?: boolean;
}

export function SubmitButton({ label, className, isPending, ...props }: React.ComponentProps<"button"> & SubmitButtonProps) {

    return (
        <button
            type="submit"
            disabled={isPending}
            className={className}
            {...props}
        >
            {isPending && <Spinner />}
            {isPending ? "Carregando..." : label}
        </button>
    );
}
