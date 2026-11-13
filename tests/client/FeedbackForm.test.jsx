import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackForm from '../../client/src/components/FeedbackForm.jsx';
import { FeedbackRequestError } from '../../client/src/services/feedbackService.js';

const success = { message: 'ok', data: { id: 12, createdAt: '2026-01-01T10:00:00.000Z' } };

async function fillValid(user) {
  await user.type(screen.getByLabelText(/full name/i), '  Asha Raman ');
  await user.type(screen.getByLabelText(/email address/i), 'asha@example.com');
  await user.selectOptions(screen.getByLabelText(/service category/i), 'postal-services');
  await user.type(screen.getByLabelText(/feedback subject/i), 'Delayed parcel');
  await user.type(screen.getByLabelText(/feedback description/i), 'My parcel was delayed by a week.');
}

describe('FeedbackForm: rendering', () => {
  it('renders every field with an accessible label and a submit button', () => {
    render(<FeedbackForm submit={vi.fn()} />);
    for (const label of [/full name/i, /email address/i, /service category/i, /feedback subject/i, /feedback description/i]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
  });

  it('shows no errors before the user interacts', () => {
    render(<FeedbackForm submit={vi.fn()} />);
    expect(screen.queryByText(/there is a problem/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).not.toHaveAttribute('aria-invalid');
  });
});

describe('FeedbackForm: validation', () => {
  it('blocks an empty submission, lists the problems and moves focus to the summary', async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<FeedbackForm submit={submit} />);

    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(submit).not.toHaveBeenCalled();
    const heading = screen.getByRole('heading', { name: /there is a problem/i });
    expect(heading.closest('[role="alert"]')).toHaveFocus();
    expect(screen.getAllByRole('link', { name: /enter|select/i })).toHaveLength(5);

    const name = screen.getByLabelText(/full name/i);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription(/enter your full name/i);
  });

  it('shows a format message for an invalid email', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm submit={vi.fn()} />);
    await fillValid(user);
    const email = screen.getByLabelText(/email address/i);
    await user.clear(email);
    await user.type(email, 'not-an-email');
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));
    expect(email).toHaveAccessibleDescription(/correct format/i);
  });

  it('clears a field error as soon as the value becomes valid', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm submit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));
    const name = screen.getByLabelText(/full name/i);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    await user.type(name, 'Asha');
    expect(name).not.toHaveAttribute('aria-invalid');
  });

  it('moves focus to the field when an error-summary link is activated', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm submit={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));
    await user.click(screen.getByRole('link', { name: /enter your email address/i }));
    expect(screen.getByLabelText(/email address/i)).toHaveFocus();
  });
});

describe('FeedbackForm: submission', () => {
  it('sends trimmed values, announces success with the reference number and resets the form', async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockResolvedValue(success);
    const onSubmitted = vi.fn();
    render(<FeedbackForm submit={submit} onSubmitted={onSubmitted} />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(submit).toHaveBeenCalledWith({
      fullName: 'Asha Raman',
      email: 'asha@example.com',
      category: 'postal-services',
      subject: 'Delayed parcel',
      message: 'My parcel was delayed by a week.',
    });
    const status = await screen.findByRole('status');
    await waitFor(() => expect(status).toHaveTextContent(/reference number is 12/i));
    expect(screen.getByLabelText(/full name/i)).toHaveValue('');
    expect(onSubmitted).toHaveBeenCalledWith(expect.objectContaining({ id: 12, subject: 'Delayed parcel' }));
  });

  it('shows a loading state, announces progress and ignores a second click', async () => {
    const user = userEvent.setup();
    let finish;
    const submit = vi.fn(() => new Promise((resolve) => (finish = resolve)));
    render(<FeedbackForm submit={submit} />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    const busy = await screen.findByRole('button', { name: /submitting/i });
    expect(busy).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(/submitting your feedback/i);
    await user.click(busy);
    expect(submit).toHaveBeenCalledTimes(1);

    finish(success);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/thank you/i));
    expect(screen.getByRole('button', { name: /submit feedback/i })).toHaveAttribute('aria-disabled', 'false');
  });

  it('shows server-side field errors returned by the API', async () => {
    const user = userEvent.setup();
    const submit = vi
      .fn()
      .mockRejectedValue(new FeedbackRequestError('validation', 'Please correct the highlighted fields.', { email: 'Server says the email is invalid.' }, 400));
    render(<FeedbackForm submit={submit} />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    expect(await screen.findByText('Please correct the highlighted fields.')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toHaveAccessibleDescription(/server says the email is invalid/i);
  });

  it('announces a network failure as an alert and keeps what the user typed', async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockRejectedValue(new FeedbackRequestError('network', 'We could not reach the server. Check your connection and try again.'));
    render(<FeedbackForm submit={submit} />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    const message = await screen.findByText(/could not reach the server/i);
    expect(message.closest('[role="alert"]')).not.toBeNull();
    expect(screen.getByLabelText(/feedback subject/i)).toHaveValue('Delayed parcel');
  });
});

describe('FeedbackForm: keyboard', () => {
  it('follows a logical tab order from the first field to the submit button', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm submit={vi.fn()} />);
    const expected = [/full name/i, /email address/i, /service category/i, /feedback subject/i, /feedback description/i];
    for (const label of expected) {
      await user.tab();
      expect(screen.getByLabelText(label)).toHaveFocus();
    }
    await user.tab();
    expect(screen.getByRole('button', { name: /submit feedback/i })).toHaveFocus();
  });

  it('submits when Enter is pressed on the button', async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockResolvedValue(success);
    render(<FeedbackForm submit={submit} />);
    await fillValid(user);
    screen.getByRole('button', { name: /submit feedback/i }).focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  });
});
