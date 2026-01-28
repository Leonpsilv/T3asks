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
  rows = 4,
  onChange,
  register,
}: ISimpleTextareaProps) {
  return (
    <Field>
      {!!title && (
        <FieldLabel htmlFor={`textarea-field-${name}`}>
          {title}
        </FieldLabel>
      )}

      <Textarea
        id={`textarea-field-${name}`}
        placeholder={placeholder}
        disabled={disable}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        {...(register && register(name))}
      />

      {!!errorMsg && <FieldError>{errorMsg}</FieldError>}
      {!!description && (
        <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
