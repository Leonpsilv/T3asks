"use client";

import type { UseFormRegister } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";

export interface ISimpleTextareaProps {
  onChange?: (props?: any) => void;
  placeholder: string;
  name: string;
  value?: string;
  errorMsg?: string;
  disable?: boolean;
  required?: boolean;
  title?: string;
  description?: string;
  className?: string;
  rows?: number;
  register?:  UseFormRegister<any>;
}

export function SimpleTextarea({
  placeholder,
  name,
  value,
  errorMsg,
  disable = false,
  title,
  description,
  required = false,
  className,
  rows = 4,
  onChange,
  register,
}: ISimpleTextareaProps) {
  return (
    <Field>
      {!!title && (
        <FieldLabel  className="!text-white" htmlFor={`textarea-field-${name}`}>
          {title}
        </FieldLabel>
      )}

      <Textarea
        id={`textarea-field-${name}`}
        className={className ?? `!placeholder-gray-300 text-white`}
        placeholder={placeholder}
        disabled={disable}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        {...register?.(name)}
      />

      {!!errorMsg && <FieldError>{errorMsg}</FieldError>}
      {!!description && (
        <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
