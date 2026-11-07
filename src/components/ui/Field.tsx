import type { ReactNode } from 'react';

export interface FieldControlProps {
  id: string;
  'aria-invalid': boolean;
  'aria-describedby'?: string;
  'aria-required': boolean;
  className: string;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  /** Render the actual control (input/select/textarea) with the a11y props spread onto it. */
  children: (props: FieldControlProps) => ReactNode;
}

/** Label + control + error, wired together for screen readers and keyboard users. */
export default function Field({ id, label, error, required, children }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
        'aria-required': Boolean(required),
        className: error ? 'error' : '',
      })}
      {error && (
        <div id={errorId} className="field-error show" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
