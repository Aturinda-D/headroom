import type { Request, Response, NextFunction } from "express";

/**
 * Centralized error handler for JSON responses.
 * - Converts CORS origin errors into 403s
 * - Handles invalid JSON body parse errors (400)
 * - Returns JSON responses for all errors
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // CORS disallowed origin (thrown as Error('Not allowed by CORS') in cors middleware)
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS origin not allowed" });
  }

  // JSON parse error from express.json
  if (
    err instanceof SyntaxError &&
    (err as any).status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  // Fallback handler
  console.error(err);
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ error: message });
}
