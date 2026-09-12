import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import creatorRoutes from "./routes/creator.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import collaborationRoutes from "./routes/collaboration.routes.js";
import dealRoutes from "./routes/deal.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
// import chatRoutes from "./routes/chat.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/creators", creatorRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/collaborations", collaborationRoutes);
app.use("/api/v1/deals", dealRoutes);
app.use( "/api/v1/timeline", timelineRoutes);
// app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/dashboard",dashboardRoutes);



// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Oryano API is running...",
  });
});

// Global JSON error handler (must be last).
// Without this, thrown ApiErrors fall through to Express's default HTML
// error page instead of a JSON body, which breaks every client-side
// error message in the app.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal server error",
  });
});

export default app;