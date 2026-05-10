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

// CORS — frontend and backend share the Vercel origin. Same-origin requests
// (Origin matches the request Host) are trusted automatically, so per-deploy
// preview URLs (futtwitter-{hash}-...vercel.app) work without env config.
// Cross-origin still requires the explicit allowlist (CORS_ORIGIN env).
// We deliberately do NOT trust *.vercel.app — any attacker could deploy there.
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const PROD_ORIGIN = "https://futtwitter.vercel.app";
if (!allowedOrigins.includes(PROD_ORIGIN)) allowedOrigins.push(PROD_ORIGIN);

const corsDelegate: cors.CorsOptionsDelegate = (req, callback) => {
  const origin = (req.headers.origin as string | undefined) ?? "";
  const host = req.headers.host as string | undefined;

  let allow = false;
  if (!origin) {
    allow = true; // no Origin header (same-origin GET, server-to-server)
  } else if (host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) allow = true; // same-origin POST/PUT/DELETE
    } catch {
      /* malformed Origin — fall through to allowlist */
    }
  }
  if (!allow && allowedOrigins.includes(origin)) allow = true;
  if (
    !allow &&
    !isProd &&
    (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:"))
  ) {
    allow = true;
  }

  callback(allow ? null : new Error(`CORS blocked for origin: ${origin}`), {
    origin: allow,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  });
};

app.use(cors(corsDelegate));
app.options("*", cors(corsDelegate));

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
