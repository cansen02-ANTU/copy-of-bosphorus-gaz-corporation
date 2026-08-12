/**
 * Activity Log — records security events (failed logins, 2FA resets, rate limit blocks, etc.)
 * Stored in the activity_log database table.
 */

const isMySQL = (process.env.DATABASE_URL ?? "").startsWith("mysql://");

export type ActivityEvent =
  | "login_failed"
  | "login_success"
  | "login_rate_limited"
  | "2fa_failed"
  | "2fa_success"
  | "2fa_rate_limited"
  | "2fa_setup_complete"
  | "2fa_reset";

export interface ActivityLogEntry {
  id: number;
  event: string;
  ip: string | null;
  details: string | null;
  createdAt: Date;
}

/**
 * Log a security event to the activity_log table.
 * Fails silently to avoid disrupting the main flow.
 */
export async function logActivity(
  event: ActivityEvent,
  ip: string | null,
  details?: string
): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) return;

  try {
    if (isMySQL) {
      const mysql = await import("mysql2/promise");
      const conn = await mysql.createConnection({ uri: url, ssl: { rejectUnauthorized: true } });
      await conn.execute(
        "INSERT INTO activity_log (event, ip, details, createdAt) VALUES (?, ?, ?, NOW())",
        [event, ip ?? null, details ?? null]
      );
      await conn.end();
    } else {
      const pg = await import("postgres");
      const sql = pg.default(url, { ssl: "require" });
      await sql`
        INSERT INTO "activity_log" ("event", "ip", "details", "createdAt")
        VALUES (${event}, ${ip ?? null}, ${details ?? null}, NOW())
      `;
      await sql.end();
    }
  } catch (err) {
    console.warn("[ActivityLog] Failed to log event:", event, err);
  }
}

/**
 * Fetch recent activity log entries (newest first).
 */
export async function getActivityLogs(limit = 50): Promise<ActivityLogEntry[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];

  try {
    if (isMySQL) {
      const mysql = await import("mysql2/promise");
      const conn = await mysql.createConnection({ uri: url, ssl: { rejectUnauthorized: true } });
      const [rows] = await conn.execute(
        "SELECT id, event, ip, details, createdAt FROM activity_log ORDER BY createdAt DESC LIMIT ?",
        [limit]
      );
      await conn.end();
      return rows as ActivityLogEntry[];
    } else {
      const pg = await import("postgres");
      const sql = pg.default(url, { ssl: "require" });
      const rows = await sql`
        SELECT "id", "event", "ip", "details", "createdAt"
        FROM "activity_log"
        ORDER BY "createdAt" DESC
        LIMIT ${limit}
      `;
      await sql.end();
      return rows as unknown as ActivityLogEntry[];
    }
  } catch (err) {
    console.warn("[ActivityLog] Failed to fetch logs:", err);
    return [];
  }
}
