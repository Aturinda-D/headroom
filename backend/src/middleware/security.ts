import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import cors from "cors";

/**
 * CORS Configuration
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // In development, allow localhost with any port
    if (process.env.NODE_ENV === "development") {
      const localhostPattern = /^http:\/\/localhost:\d+$/;
      if (localhostPattern.test(origin)) {
        return callback(null, true);
      }
    }

    // Build allowed origins list from env and sanitize input
    const raw = process.env.CORS_ORIGIN || "http://localhost:3000";
    const allowedOrigins = raw
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    // If caller configured wildcard '*' while credentials are allowed, explicitly reject to avoid leaking cookies
    const credentialsEnabled = true;
    if (allowedOrigins.includes("*") && credentialsEnabled) {
      console.warn(
        'CORS misconfiguration: wildcard origin "*" used while credentials are enabled. Please set a specific `CORS_ORIGIN`.',
      );
      return callback(new Error("Not allowed by CORS"));
    }

    // Support exact matches and simple wildcard patterns like '*.example.com'
    const isAllowed = allowedOrigins.some((pattern) => {
      if (pattern.includes("*")) {
        // Escape regexp special chars except '*' and convert '*' -> '.*'
        const esc = pattern
          .replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&")
          .replace(/\\\*/g, ".*")
          .replace(/\*/g, ".*");
        const re = new RegExp("^" + esc + "$");
        return re.test(origin);
      }
      return pattern === origin;
    });

    if (isAllowed) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // Cache preflight requests for 24 hours
});

/**
 * Helmet Configuration
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },

  // Prevents clickjacking attacks
  frameguard: {
    action: "deny",
  },

  // Prevents MIME type sniffing
  noSniff: true,

  // Enables HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // Prevents browsers from sending referrer header
  referrerPolicy: {
    policy: "no-referrer",
  },
});

/**
 * Rate Limiting Configuration
 */

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  // Skip rate limiting for health checks and preflight requests
  skip: (req) => req.method === "OPTIONS" || req.path === "/health",
});

// Stricter rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator (by IP + user email if available)
  keyGenerator: (req) => {
    const email = req.body?.email || "";
    // Use the express-rate-limit helper to normalize IPv6 addresses properly
    // ipKeyGenerator expects the IP string, not the request — pass req.ip
    const ip = ipKeyGenerator(req.ip as string);
    return `${ip}-${email}`;
  },
});

// Even stricter for password reset/sensitive operations
export const sensitiveRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    error: "Too many attempts, please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
