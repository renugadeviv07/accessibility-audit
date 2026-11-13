import { useEffect, useRef, useState } from 'react';
import FormField from './FormField.jsx';
import StatusMessage from './StatusMessage.jsx';
import { submitFeedback } from '../services/feedbackService.js';
import {
  FEEDBACK_CATEGORIES,
  FIELD_ORDER,
  LIMITS,
  validateFeedback,
  validateField,
} from '../services/validation.js';

const EMPTY_VALUES = { fullName: '', email: '', category: '', subject: '', message: '' };

export default function FeedbackForm({ submit = submitFeedback, onSubmitted }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');
  const [reference, setReference] = useState(null);
  const [summaryTick, setSummaryTick] = useState(0);
  const summaryRef = useRef(null);

  const isSubmitting = status === 'submitting';
  const errorEntries = FIELD_ORDER.filter((field) => errors[field]).map((field) => [field, errors[field]]);

  // Move focus to the error summary after a failed submit so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (summaryTick > 0) summaryRef.current?.focus();
  }, [summaryTick]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (reference) setReference(null);
    if (errors[name]) {
      const message = validateField(name, value);
      setErrors((current) => {
        const next = { ...current };
        if (message) next[name] = message;
        else delete next[name];
        return next;
      });
    }
  }

  function focusField(name) {
    document.getElementById(name)?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const found = validateFeedback(values);
    setErrors(found);
    setServerError('');
    setReference(null);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      setSummaryTick((tick) => tick + 1);
      return;
    }

    const payload = Object.fromEntries(FIELD_ORDER.map((field) => [field, values[field].trim()]));
    setStatus('submitting');
    try {
      const result = await submit(payload);
      setStatus('success');
      setReference({ id: result.data.id, createdAt: result.data.createdAt });
      setValues(EMPTY_VALUES);
      setErrors({});
      onSubmitted?.({
        id: result.data.id,
        createdAt: result.data.createdAt,
        subject: payload.subject,
        category: payload.category,
      });
    } catch (error) {
      setStatus('error');
      setServerError(error.message || 'Something went wrong. Please try again.');
      if (error.errors && Object.keys(error.errors).length > 0) {
        setErrors(error.errors);
        setSummaryTick((tick) => tick + 1);
      }
    }
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      {errorEntries.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="error-summary">
          <h3>There is a problem</h3>
          <ul>
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="form-note">All fields are required.</p>

      <FormField
        id="fullName"
        label="Full name"
        type="text"
        autoComplete="name"
        value={values.fullName}
        onChange={handleChange}
        error={errors.fullName}
      />
      <FormField
        id="email"
        label="Email address"
        hint="We will only use this to reply to your feedback."
        type="email"
        autoComplete="email"
        spellCheck={false}
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <FormField
        id="category"
        label="Service category"
        as="select"
        value={values.category}
        onChange={handleChange}
        error={errors.category}
      >
        <option value="">Select a category</option>
        {FEEDBACK_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </FormField>
      <FormField
        id="subject"
        label="Feedback subject"
        type="text"
        autoComplete="off"
        value={values.subject}
        onChange={handleChange}
        error={errors.subject}
      />
      <FormField
        id="message"
        label="Feedback description"
        hint={`Tell us what happened and how it affected you. ${LIMITS.message.min} to ${LIMITS.message.max} characters.`}
        as="textarea"
        rows={6}
        value={values.message}
        onChange={handleChange}
        error={errors.message}
      />

      <button type="submit" className="btn btn--primary" aria-disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit feedback'}
      </button>

      <StatusMessage kind="status">
        {isSubmitting && <p className="message message--info">Submitting your feedback…</p>}
        {reference && (
          <p className="message message--success">
            Thank you. Your feedback has been submitted. Your reference number is {reference.id}.
          </p>
        )}
      </StatusMessage>
      <StatusMessage kind="alert">
        {serverError && <p className="message message--error">{serverError}</p>}
      </StatusMessage>
    </form>
  );
}
