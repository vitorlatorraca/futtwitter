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
 */

import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { registerRoutes } from "../server/routes";

// ── Express app ─────────────────────────────────────────────────────────────
const app = express();

// Trust Vercel's reverse proxy so req.ip and secure cookies work correctly
app.set("trust proxy", 1);

const isProd = process.env.NODE_ENV !== "development";

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

// CORS — allow the Vercel frontend (same project) + any extras from env
const extraOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = ["https://futtwitter.vercel.app", ...extraOrigins];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Same-origin requests (no Origin header)
    if (!origin) return callback(null, true);
    // Explicitly allowed
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Any *.vercel.app preview deployment
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    // Dev: localhost
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
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
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
