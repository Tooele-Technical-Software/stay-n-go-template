import "dotenv/config";
import pg from "pg";

const adminUrl =
  process.env.DATABASE_URL?.replace(/\/[^/]+$/, "/postgres") ??
  "postgresql://postgres:tomnookisbest@localhost:5432/postgres";

const dbName = "stay_n_go";

async function createDatabase(): Promise<void> {
  const client = new pg.Client({ connectionString: adminUrl });

  try {
    await client.connect();
    const exists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (exists.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Created database "${dbName}"`);
    } else {
      console.log(`Database "${dbName}" already exists`);
    }
  } finally {
    await client.end();
  }
}

createDatabase().catch((err) => {
  console.error("Failed to create database:", err.message);
  process.exit(1);
});
