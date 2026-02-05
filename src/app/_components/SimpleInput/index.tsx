"use client"

import type { UseFormRegister } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"

export interface ISimpleInputProps {
    name: string;
    placeholder?: string;
    onChange?: (props?: any) => void;
    value?: string | number | undefined;
    errorMsg?: string | undefined;
    disable?: boolean;
    required?: boolean;
    title?: string | React.ReactNode;
    description?: string;
    type?: string;
    register?:  UseFormRegister<any>;
    className?: string;
}

export function SimpleInput({
    onChange,
    placeholder,
    name,
    type = "text",
    value,
    errorMsg,
    disable = false,
    title,
    description,
    required = false,
    register,
    className
}: ISimpleInputProps) {
    return (
        <Field className={className}>
            {!!title && <FieldLabel htmlFor={`input-field-${name}`} className="text-white">{title}</FieldLabel>}
            <Input
                className="!placeholder-gray-300 text-white"
                name={name}
                id={`input-field-${name}`}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disable}
                value={value}
                required={required}
                {...register?.(name)}
                
            />
            {!!errorMsg && <FieldError>{errorMsg}</FieldError>}
            {!!description && <FieldDescription>
                {description}
            </FieldDescription>}
        </Field >
    )
}
