import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes, sessionStore } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initNotificationGateway } from "./websocket";

const app = express();

// Serve uploaded files (DEV + PROD)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// Railway/Neon: trust proxy in production for secure cookies
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Configure CORS
const isDev = process.env.NODE_ENV === "development";
const corsAllowedOrigins = (process.env.CORS_ORIGIN ?? process.env.CLIENT_URL ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Only enable CORS when needed:
// - dev: allow localhost
// - prod: only if CORS_ORIGIN is explicitly set
if (isDev || corsAllowedOrigins.length > 0) {
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // In development, allow localhost
      if (isDev) {
        if (
          origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:")
        ) {
          return callback(null, true);
        }
      }

      // In production, only allow explicitly configured origins
      if (corsAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
}

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      // Avoid logging response bodies in production (can contain sensitive data)
      if (capturedJsonResponse && app.get("env") === "development") {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Initialize WebSocket server for real-time notifications
  initNotificationGateway(server, sessionStore);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Log full stack in dev so we can see the real cause of 500s
    console.error("[express] Error handler:", message);
    if (err.stack) console.error(err.stack);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 5000;
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error('\n[express] Porta ' + port + ' em uso. Nenhum processo pode escutar nela.');
      console.error('  Diagnosticar (ver PID na última coluna):  netstat -ano | findstr :' + port);
      console.error('  Matar processo:  taskkill /PID <PID> /F');
      if (port === 5000) console.error('  Ou rode:  npm run kill:5000');
      console.error('');
      process.exit(1);
    }
    throw err;
  });

  server.listen({
    port,
    host,
  }, async () => {
    log(`serving on ${host}:${port} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
    try {
      const { pool } = await import("./db");
      await pool.query("SELECT 1");
      log("DB connection OK");
    } catch (err) {
      console.error("[express] DB connection failed:", (err as Error).message);
    }
  });
})();
