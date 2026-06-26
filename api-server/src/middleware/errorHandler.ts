import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError, isAppError } from "../utils/errors.js";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: error.flatten().fieldErrors,
    });
    return;
  }

  if (isAppError(error)) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof Error && error.message.includes("Database is disabled")) {
    res.status(503).json({
      error: "Database not configured",
      message:
        "Set DB_ENABLED=true and configure PostgreSQL or Amazon RDS credentials in .env",
    });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
}
