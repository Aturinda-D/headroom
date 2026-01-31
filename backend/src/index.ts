import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./utils/prisma.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    timeStamp: new Date().toISOString(),
  });
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
    console.error(error);
    res.status(500).json({ error: `Failed to fetch users\n${msg}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
