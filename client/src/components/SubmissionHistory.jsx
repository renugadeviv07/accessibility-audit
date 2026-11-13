import { getCategoryLabel } from '../services/validation.js';

/** Shows submissions made in this browser tab only. Nothing is fetched from the server's feedback list. */
export default function SubmissionHistory({ items }) {
  return (
    <div className="card history">
      <h3>Your submissions in this session</h3>
      {items.length === 0 ? (
        <p className="empty-state">
          You have not submitted any feedback in this session yet. After you submit, your reference numbers will
          appear here.
        </p>
      ) : (
        <ul className="history-list">
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.subject}</strong>
              <span>
                {getCategoryLabel(item.category)} &middot; Reference {item.id}
              </span>
              <span>
                Submitted <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="hint">This list is kept in your browser only and clears when you reload the page.</p>
    </div>
  );
}
