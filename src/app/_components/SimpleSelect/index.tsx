"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "~/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

export interface ISimpleInputProps {
    options: Array<{ value: string; label: string }>;
    onChange: (props?: any) => void;
    name: string;
    defaultValue?: string;
    errorMsg?: string | undefined;
    disable?: boolean;
    description?: string;
    title?: string;
}

export function SimpleSelect({
    onChange,
    options,
    defaultValue,
    errorMsg,
    disable = false,
    description,
    title,
    name
}: ISimpleInputProps) {

    return (
        <Field>
            {!!title && <FieldLabel htmlFor={`input-field-${name}`}>{title}</FieldLabel>}
            <Select
                defaultValue={defaultValue}
                onValueChange={onChange}
                name={name}
            >
                <SelectTrigger
                    disabled={disable}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent
                    position={"popper"}
                >
                    <SelectGroup>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            {!!errorMsg && <FieldError>{errorMsg}</FieldError>}
            {!!description && <FieldDescription>
                {description}
            </FieldDescription>}
        </Field >
    )
}
