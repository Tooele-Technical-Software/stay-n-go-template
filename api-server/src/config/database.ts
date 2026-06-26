import { Pool, type PoolConfig, type QueryResultRow } from "pg";
import { env } from "./env.js";

let pool: Pool | null = null;

function buildPoolConfig(): PoolConfig {
  if (env.databaseUrl) {
    return {
      connectionString: env.databaseUrl,
      ssl: env.db.ssl
        ? { rejectUnauthorized: env.db.sslRejectUnauthorized }
        : undefined,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    };
  }

  return {
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
    ssl: env.db.ssl
      ? { rejectUnauthorized: env.db.sslRejectUnauthorized }
      : undefined,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  };
}

export function isDatabaseEnabled(): boolean {
  return env.dbEnabled;
}

export function getPool(): Pool {
  if (!env.dbEnabled) {
    throw new Error(
      "Database is disabled. Set DB_ENABLED=true and configure PostgreSQL/RDS credentials in .env"
    );
  }

  if (!pool) {
    pool = new Pool(buildPoolConfig());

    pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL pool error:", err);
    });
  }

  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const result = await getPool().query<T>(text, params);
  return { rows: result.rows, rowCount: result.rowCount };
}

export async function testConnection(): Promise<boolean> {
  if (!env.dbEnabled) {
    return false;
  }

  try {
    const client = await getPool().connect();
    await client.query("SELECT 1");
    client.release();
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
