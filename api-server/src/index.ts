import cors from "cors";
import express from "express";
import { assertProductionSecrets, env } from "./config/env.js";
import { isDatabaseEnabled, testConnection } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import usersRouter from "./routes/users.js";
import listingsRouter from "./routes/listings.js";
import bookingsRouter from "./routes/bookings.js";

assertProductionSecrets();

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    database: isDatabaseEnabled() ? "configured" : "disabled",
  });
});

app.use("/users", usersRouter);
app.use("/listings", listingsRouter);
app.use("/bookings", bookingsRouter);

app.use(errorHandler);

async function start(): Promise<void> {
  if (env.dbEnabled) {
    const connected = await testConnection();
    if (connected) {
      console.log("PostgreSQL connection established");
    } else {
      console.warn(
        "DB_ENABLED is true but connection failed — check your PostgreSQL/RDS settings"
      );
    }
  } else {
    console.log(
      "Database disabled (DB_ENABLED=false). API routes will return 503 until configured."
    );
  }

  app.listen(env.port, () => {
    console.log(`Stay N Go API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
