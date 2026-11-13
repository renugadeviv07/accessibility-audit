/**
 * Data access for feedback. All SQL lives here and every query is parameterised.
 */
export function createFeedbackRepository(db) {
  const insertStmt = db.prepare(
    `INSERT INTO feedback (full_name, email, category, subject, message)
     VALUES (@fullName, @email, @category, @subject, @message)`,
  );
  const byIdStmt = db.prepare('SELECT id, created_at AS createdAt FROM feedback WHERE id = ?');
  const listStmt = db.prepare(
    `SELECT id, full_name AS fullName, email, category, subject, message, created_at AS createdAt
     FROM feedback ORDER BY id DESC LIMIT @limit OFFSET @offset`,
  );
  const countStmt = db.prepare('SELECT COUNT(*) AS total FROM feedback');

  return {
    insert({ fullName, email, category, subject, message }) {
      const info = insertStmt.run({ fullName, email, category, subject, message });
      return byIdStmt.get(info.lastInsertRowid);
    },
    findAll({ limit, offset }) {
      return listStmt.all({ limit, offset });
    },
    count() {
      return countStmt.get().total;
    },
  };
}
