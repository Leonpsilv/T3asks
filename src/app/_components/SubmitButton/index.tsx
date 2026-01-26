"use client";

import { useFormStatus } from "react-dom";
import { Spinner } from "~/components/ui/spinner";

interface SubmitButtonProps {
    label: string;
}

export function SubmitButton({ label, className, ...props }: React.ComponentProps<"button"> & SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={className}
            {...props}
        >
            {pending && <Spinner />}
            {pending ? "Carregando..." : label}
        </button>
    );
}
