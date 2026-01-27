"use client"

import { Field, FieldDescription, FieldError } from "~/components/ui/field";
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
    defaultValue?: string;
    errorMsg?: string | undefined;
    disable?: boolean;
    description?: string;
}

export function SimpleSelect({
    onChange,
    options,
    defaultValue,
    errorMsg,
    disable = false,
    description,
}: ISimpleInputProps) {

    return (
        <Field>
            <Select
                defaultValue={defaultValue}
                onValueChange={onChange}
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
