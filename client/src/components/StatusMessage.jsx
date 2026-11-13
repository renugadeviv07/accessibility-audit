/**
 * Always-mounted live region. Screen readers reliably announce changes to a live region
 * that already exists in the page, so the wrapper stays rendered and only its content changes.
 *  - kind="status": polite announcements (progress, success)
 *  - kind="alert":  assertive announcements (errors)
 */
export default function StatusMessage({ kind = 'status', children }) {
  return (
    <div role={kind === 'alert' ? 'alert' : 'status'} className="live-region">
      {children}
    </div>
  );
}
