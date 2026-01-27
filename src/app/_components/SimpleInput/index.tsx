"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "~/components/ui/field"
import { Input } from "~/components/ui/input"

export interface ISimpleInputProps {
    onChange: (props?: any) => void;
    placeholder: string;
    name: string;
    value?: string | number | undefined;
    errorMsg?: string | undefined;
    disable?: boolean;
    required?: boolean;
    title?: string;
    description?: string;
    type?: string;
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
}: ISimpleInputProps) {
    return (
        <Field>
            {!!title && <FieldLabel htmlFor={`input-field-${name}`}>{title}</FieldLabel>}
            <Input
                name={name}
                id={`input-field-${name}`}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disable}
                value={value}
                required={required}
                
            />
            {!!errorMsg && <FieldError>{errorMsg}</FieldError>}
            {!!description && <FieldDescription>
                {description}
            </FieldDescription>}
        </Field >
    )
}
