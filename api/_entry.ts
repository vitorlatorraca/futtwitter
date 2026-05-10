/**
 * Vercel Serverless Entry Point
 *
 * This file wraps the Express app as a Vercel serverless function.
 * - Static files are served by Vercel from dist/public (see vercel.json)
 * - All /api/* requests are routed here by Vercel rewrites
 * - Sessions are stored in PostgreSQL via connect-pg-simple (persists across cold starts)
 * - WebSockets are NOT available in Vercel serverless (real-time notifications fall back to polling)
 *
 * Required environment variables in Vercel dashboard:
 *   DATABASE_URL   — PostgreSQL connection string (Neon)
 *   SESSION_SECRET — Random string ≥ 32 chars for session signing
 *   NODE_ENV       — "production"
 *
 * Image uploads (posts, news, avatars) require Cloudinary:
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { registerRoutes } from "../server/routes";

// ── Express app ─────────────────────────────────────────────────────────────
const app = express();

// Trust Vercel's reverse proxy so req.ip (rate limiting) and secure cookies work
app.set("trust proxy", 1);

const isProd = process.env.NODE_ENV !== "development";

if (isProd && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production (Vercel env)");
}

// Security headers (CSP disabled — SPA assets are served by Vercel CDN, not by this function)
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    noSniff: true,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// CORS — frontend and backend share the Vercel origin, so most requests are
// same-origin (no Origin header). Cross-origin is only allowed via explicit
// allowlist (CORS_ORIGIN env). We deliberately do NOT trust *.vercel.app —
// any attacker could deploy there with the same wildcard.
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const PROD_ORIGIN = "https://futtwitter.vercel.app";
if (!allowedOrigins.includes(PROD_ORIGIN)) allowedOrigins.push(PROD_ORIGIN);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (
      !isProd &&
      (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))
    )
      return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

// ── Lazy initialization (singleton per warm instance) ───────────────────────
let initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = registerRoutes(app)
      .then(() => {
        // Global error handler — must be registered AFTER all routes
        app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          // Always log the error so 500s show up in Vercel logs with stack traces
          console.error(
            `[express] ${req.method} ${req.url} → ${status}: ${message}`,
            err.stack || err,
          );
          res.status(status).json({ message });
        });
      })
      .catch((err) => {
        console.error("[vercel] Failed to initialise routes:", err);
        initPromise = null; // allow retry on next request
        throw err;
      });
  }
  return initPromise;
}

// ── Vercel serverless handler ───────────────────────────────────────────────
export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    await ensureInit();
  } catch (err) {
    console.error("[vercel] Init error:", err);
    res.status(503).json({ message: "Service temporarily unavailable. Check server logs." });
    return;
  }

  // Hand off to Express — it routes based on req.method + req.url
  app(req, res, (err) => {
    if (err) {
      console.error("[vercel] Unhandled Express error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
}
