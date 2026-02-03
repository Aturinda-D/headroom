import "dotenv/config";
import express from "express";
import {
  corsMiddleware,
  helmetMiddleware,
  apiRateLimiter,
} from "./middleware/security.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./utils/prisma.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for correct client IP detection behind proxies/load balancers
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", true);
}

// Security Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(apiRateLimiter);
app.use(express.json({ limit: "10kb" })); // Limit JSON body to 10kb
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Limit URL-encoded body to 10kb

// Basic Routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/health", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "OK",
      message: "Server is healthy, database connection successful",
      timeStamp: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(error);
    res.status(500).json({ error: msg });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(error);
    res.status(500).json({ error: `Failed to create user\n${msg}` });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: msg });
  }
});

// Error handling middleware (register after routes)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
