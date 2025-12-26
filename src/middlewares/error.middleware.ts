import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response | void {
  // Operational error from our app
  if (err instanceof ApiError) {
    const e = err as ApiError;
    const payload: Record<string, unknown> = { message: e.message };
    if (e.details) payload.details = e.details;
    return res.status(e.statusCode).json(payload);
  }

  // Mongoose / Mongo validation error
  // (mongoose validation errors have name "ValidationError")
  if (typeof err === "object" && err !== null && (err as any).name === "ValidationError") {
    const e = err as any;
    const message = e.message || "Validation error";
    const details = e.errors || undefined;
    return res.status(400).json({ message, details });
  }

  // Mongo duplicate key error
  if (typeof err === "object" && err !== null && (err as any).code === 11000) {
    // e.g. { code: 11000, keyValue: { email: '...' } }
    const e = err as any;
    return res.status(409).json({ message: "Duplicate key", details: e.keyValue || undefined });
  }

  // JWT errors from jsonwebtoken
  if (typeof err === "object" && err !== null && (err as any).name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (typeof err === "object" && err !== null && (err as any).name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Unknown error — log and respond
  // Show stack in development only
  // eslint-disable-next-line no-console
  console.error(err);

  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    // Try to include useful info when in development
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message, stack: err.stack });
    }
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }

  return res.status(500).json({ message: "Internal Server Error" });
}

