import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { spawn } from "child_process";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import trainRouter from "./routes/trainRoutes.js";
import bookRouter from "./routes/bookRoutes.js";

dotenv.config();

const app = express();

// Middleware to parse JSON body data
app.use(express.json());
app.use("/api/admin", adminRoutes);

// Using CORS
app.use(
  cors({
    origin: [process.env.API_URL, "http://localhost:3000"],
  })
);

// Security middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// Connect to the MongoDB database
mongoose
  .connect("process.env.MONGODB_URI", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("[DB] Connection Success");
  })
  .catch((err) => {
    console.error("[DB] Connection Error:", err.message);
  });

// Routes
app.use("/api/auth", authRouter);
app.use("/api", trainRouter);
app.use("/api", bookRouter);

// Handle 404 or other routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Schedule task to run seed.js file every day at 9:30 AM IST
cron.schedule("30 4 * * *", () => {
  console.log("Running seed.js file");
  const seed = spawn("node", ["seed.js"]);

  seed.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  seed.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  seed.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
