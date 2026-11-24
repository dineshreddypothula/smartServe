import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import session from "express-session";

import authRouter from "./routers/authRouter.js";
import restaurantRouter from "./routers/restaurantRouter.js";
import orderRouter from "./routers/orderRouter.js";
import bookingRouter from "./routers/bookingRouter.js";
import connectDB from "./db.js";
import { app: socketApp, server } from "./socket/socket.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import passport from "./utils/passport.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_DB_URL', 'FRONTEND_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Connect to MongoDB
connectDB();

const app = socketApp;

// Security Middleware
app.use(helmet());
app.use(compression());

// Core Middleware
const corsOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://smart-serve-app.netlify.app"
].filter(Boolean);

app.use(cors({
  origin: corsOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later."
});
app.use("/api", apiLimiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts, please try again later."
});
app.use("/api/auth", authLimiter);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "UP", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root Route
app.get("/", (req, res) => {
  res.send("Smart Restro API is running...");
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/orders", orderRouter);
app.use("/api/bookings", bookingRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
