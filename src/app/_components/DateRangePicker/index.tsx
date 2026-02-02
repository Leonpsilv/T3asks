"use client";

import { format, type FormatDateOptions } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import type { UseFormRegister } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "~/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

interface ISimpleDateRangePickerProps {
    name: string;
    title?: string;
    description?: string;
    placeholder?: string;
    value?: DateRange;
    onChange?: (range?: DateRange) => void;
    errorMsg?: string;
    disable?: boolean;
    register?: UseFormRegister<any>;
    className?: string;
    dateFormat?: string;
}

export function SimpleDateRangePicker({
    name,
    title,
    description,
    placeholder = "Selecione um período",
    value,
    onChange,
    errorMsg,
    disable = false,
    register,
    className,
    dateFormat
}: ISimpleDateRangePickerProps) {
    const [range, setRange] = React.useState<DateRange | undefined>(value);

    function handleSelect(selectedRange?: DateRange) {
        setRange(selectedRange);
        onChange?.(selectedRange);
    }

    function renderLabel() {
        if (!range?.from) {
            return <span className="text-muted-foreground">{placeholder}</span>;
        }

        if (!range.to) {
            return format(range.from, dateFormat ?? "LLL dd, y", { locale: ptBR });
        }

        return (
            <>
                {format(range.from, dateFormat ?? "LLL dd, y", { locale: ptBR })} – {" "}
                {format(range.to, dateFormat ?? "LLL dd, y", { locale: ptBR })}
            </>
        );
    }

    return (
        <Field className={className}>
            {!!title && (
                <FieldLabel htmlFor={`date-range-picker-${name}`}>
                    {title}
                </FieldLabel>
            )}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        id={`date-range-picker-${name}`}
                        disabled={disable}
                        className="justify-start gap-2 px-2.5 font-normal bg-transparent cursor-pointer !placeholder-gray-300 text-white"
                    >
                        <CalendarIcon className="h-4 w-4" />
                        {renderLabel()}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        locale={ptBR} 
                    />
                </PopoverContent>
            </Popover>

            {!!errorMsg && <FieldError>{errorMsg}</FieldError>}
            {!!description && (
                <FieldDescription>{description}</FieldDescription>
            )}

            {/* Integração com React Hook Form */}
            {register && (
                <>
                    <input
                        type="hidden"
                        {...register(`${name}.from`)}
                        value={range?.from?.toISOString() ?? ""}
                    />
                    <input
                        type="hidden"
                        {...register(`${name}.to`)}
                        value={range?.to?.toISOString() ?? ""}
                    />
                </>
            )}
        </Field>
    );
}
