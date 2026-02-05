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
    options: Array<{ value: string | undefined; label: string }>;
    onChange: (props?: any) => void;
    name: string;
    defaultValue?: string;
    errorMsg?: string | undefined;
    disable?: boolean;
    description?: string;
    title?: string;
    value?: string; 
}

export function SimpleSelect({
    onChange,
    options,
    defaultValue,
    errorMsg,
    disable = false,
    description,
    title,
    name,
    value
}: ISimpleInputProps) {

    return (
        <Field>
            {!!title && <FieldLabel htmlFor={`input-field-${name}`} className="text-white">{title}</FieldLabel>}
            <Select
                defaultValue={defaultValue}
                onValueChange={onChange}
                name={name}
                value={value}
            >
                <SelectTrigger
                    disabled={disable}
                    className="cursor-pointer"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent
                    position={"popper"}
                >
                    <SelectGroup>
                        {options.map((option) => (
                            <SelectItem key={option.value ?? `item-${Math.random()}`} value={option.value!}>
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
