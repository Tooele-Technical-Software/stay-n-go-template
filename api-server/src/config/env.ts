import "dotenv/config";

export const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  dbEnabled: process.env.DB_ENABLED === "true",
  databaseUrl: process.env.DATABASE_URL,
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    name: process.env.DB_NAME ?? "stay_n_go",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "",
    ssl: process.env.DB_SSL === "true",
    sslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "dev-only-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
} as const;

export function assertProductionSecrets(): void {
  if (env.nodeEnv === "production" && env.jwt.secret === "dev-only-change-in-production") {
    throw new Error("JWT_SECRET must be set in production");
  }
}
