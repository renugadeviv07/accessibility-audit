/**
 * A labelled form control with optional hint and error text.
 * Uses native <label>, `required` and aria-describedby / aria-invalid only where they add information.
 */
export default function FormField({ id, label, hint, error, as: Control = 'input', children, ...controlProps }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={hintId} className="hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error">
          <span className="visually-hidden">Error: </span>
          {error}
        </p>
      )}
      <Control
        id={id}
        name={id}
        required
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...controlProps}
      >
        {children}
      </Control>
    </div>
  );
}
