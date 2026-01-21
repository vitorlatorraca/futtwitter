import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes, sessionStore } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initNotificationGateway } from "./websocket";

const app = express();

// Configure CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [];

    // In development, allow localhost
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
    }

    // Check if origin is in allowed list
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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
      if (capturedJsonResponse) {
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
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Railway injects PORT automatically. Default to 5000 if not specified.
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || '5000', 10);
  // In production (Railway), bind to 0.0.0.0 to accept external connections
  // In development, use 127.0.0.1 for localhost only
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
  server.listen({
    port,
    host,
  }, () => {
    log(`serving on ${host}:${port}`);
  });
})();
