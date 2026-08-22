import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function FormField({ label, error, hint, id, name, ...props }: FieldProps) {
  const fieldId = id ?? name;
  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field-label">{label}</span>
      <input id={fieldId} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} {...props} />
      {hint && !error ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error" id={`${fieldId}-error`}>{error}</span> : null}
    </label>
  );
}

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function TextAreaField({ label, error, id, name, ...props }: AreaProps) {
  const fieldId = id ?? name;
  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field-label">{label}</span>
      <textarea id={fieldId} name={name} aria-invalid={Boolean(error)} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
