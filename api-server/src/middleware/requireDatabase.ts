import type { NextFunction, Request, Response } from "express";
import { isDatabaseEnabled } from "../config/database.js";

export function requireDatabase(_req: Request, res: Response, next: NextFunction): void {
  if (!isDatabaseEnabled()) {
    res.status(503).json({
      error: "Database not configured",
      message:
        "Set DB_ENABLED=true and configure PostgreSQL or Amazon RDS credentials in .env",
    });
    return;
  }

  next();
}
