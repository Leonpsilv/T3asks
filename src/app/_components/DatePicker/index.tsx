"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "~/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import type { UseFormRegister } from "react-hook-form";

export interface ISimpleDatePickerProps {
    name: string;
    title?: string;
    description?: string;
    placeholder?: string;
    value?: Date;
    onChange?: (date?: Date) => void;
    errorMsg?: string;
    disable?: boolean;
    className?: string;
}

export function SimpleDatePicker({
    name,
    title,
    description,
    placeholder = "Selecione uma data",
    value,
    onChange,
    errorMsg,
    disable = false,
    className
}: ISimpleDatePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(value);

    function handleSelect(selectedDate?: Date) {
        onChange?.(selectedDate);
        setDate(selectedDate)
    }

    return (
        <Field className={className}>
            {!!title && (
                <FieldLabel className="text-white" htmlFor={`date-picker-${name}`}>
                    {title}
                </FieldLabel>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        id={`date-picker-${name}`}
                        disabled={disable}
                        className="justify-start font-normal bg-transparent cursor-pointer !placeholder-gray-300 text-white"
                    >
                        {date ? (
                            format(date, "PPP", {
                                locale: ptBR
                            })
                        ) : (
                            <span className="text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        locale={ptBR} 
                    />
                </PopoverContent>
            </Popover>

            {!!errorMsg && <FieldError>{errorMsg}</FieldError>}
            {!!description && (
                <FieldDescription>{description}</FieldDescription>
            )}
        </Field>
    );
}
