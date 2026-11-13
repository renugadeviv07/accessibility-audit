import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../client/src/App.jsx';
import { NAV_ITEMS } from '../../client/src/components/Header.jsx';

describe('App structure and semantics', () => {
  it('exposes the main landmarks', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument();
  });

  it('has exactly one h1 and never skips a heading level', () => {
    render(<App />);
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName[1]));
    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    levels.forEach((level, index) => {
      if (index > 0) expect(level - levels[index - 1]).toBeLessThanOrEqual(1);
    });
  });

  it('contains every section required by the brief and every nav link targets one', () => {
    render(<App />);
    for (const item of NAV_ITEMS) {
      expect(document.getElementById(item.id), `#${item.id}`).not.toBeNull();
    }
    const primary = screen.getByRole('navigation', { name: 'Primary' });
    for (const item of NAV_ITEMS) {
      expect(within(primary).getByRole('link', { name: item.label })).toHaveAttribute('href', `#${item.id}`);
    }
  });

  it('gives the hero illustration a descriptive text alternative', () => {
    render(<App />);
    expect(screen.getByRole('img', { name: /envelope with a gold check mark/i })).toBeInTheDocument();
  });

  it('shows a meaningful empty state before any submission', () => {
    render(<App />);
    expect(screen.getByText(/have not submitted any feedback in this session yet/i)).toBeInTheDocument();
  });
});

describe('App keyboard behaviour', () => {
  it('makes the skip link the first tab stop and targets the main region', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    const skip = screen.getByRole('link', { name: /skip to main content/i });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', '#main');
    expect(document.getElementById('main')).toHaveAttribute('tabindex', '-1');
  });

  it('exposes the menu button state and closes the menu with Escape, returning focus', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole('button', { name: /menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'primary-nav');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('opens the menu with the keyboard (Enter)', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole('button', { name: /menu/i });
    toggle.focus();
    await user.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});
