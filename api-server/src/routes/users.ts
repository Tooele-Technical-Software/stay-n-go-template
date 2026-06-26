import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { query } from "../config/database.js";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import type { User, UserRow } from "../types/index.js";
import { AppError } from "../utils/errors.js";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(120),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    email: z.string().email().optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one field is required",
  });

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

function toPublicUser(user: UserRow | User): Omit<User, never> {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
  };
}

function signToken(user: User): string {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"] };
  return jwt.sign({ userId: user.id, email: user.email }, env.jwt.secret, options);
}

router.use(requireDatabase);

router.post("/signup", async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, 12);

    const existing = await query<UserRow>(
      "SELECT id FROM users WHERE email = $1",
      [body.email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      throw new AppError(409, "Email already registered");
    }

    const result = await query<UserRow>(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at, password_hash`,
      [body.email.toLowerCase(), passwordHash, body.name]
    );

    const user = toPublicUser(result.rows[0]);
    const token = signToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const result = await query<UserRow>(
      "SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1",
      [body.email.toLowerCase()]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(body.password, userRow.password_hash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const user = toPublicUser(userRow);
    const token = signToken(user);

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const result = await query<UserRow>(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [req.user!.userId]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      throw new AppError(404, "User not found");
    }

    res.json({ user: toPublicUser(userRow) });
  } catch (error) {
    next(error);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const body = updateProfileSchema.parse(req.body);
    const userId = req.user!.userId;

    if (body.email) {
      const normalizedEmail = body.email.toLowerCase();
      const existing = await query<UserRow>(
        "SELECT id FROM users WHERE email = $1 AND id <> $2",
        [normalizedEmail, userId]
      );

      if (existing.rows.length > 0) {
        throw new AppError(409, "Email already in use");
      }
    }

    const result = await query<UserRow>(
      `UPDATE users
       SET
         name = COALESCE($2, name),
         email = COALESCE($3, email),
         updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, created_at, password_hash`,
      [userId, body.name ?? null, body.email?.toLowerCase() ?? null]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      throw new AppError(404, "User not found");
    }

    const user = toPublicUser(userRow);
    const token = signToken(user);

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.patch("/me/password", requireAuth, async (req, res, next) => {
  try {
    const body = changePasswordSchema.parse(req.body);
    const userId = req.user!.userId;

    const result = await query<UserRow>(
      "SELECT id, email, name, password_hash, created_at FROM users WHERE id = $1",
      [userId]
    );

    const userRow = result.rows[0];
    if (!userRow) {
      throw new AppError(404, "User not found");
    }

    const valid = await bcrypt.compare(body.currentPassword, userRow.password_hash);
    if (!valid) {
      throw new AppError(401, "Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(body.newPassword, 12);

    await query(
      "UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1",
      [userId, passwordHash]
    );

    res.json({ message: "Password updated" });
  } catch (error) {
    next(error);
  }
});

export default router;
