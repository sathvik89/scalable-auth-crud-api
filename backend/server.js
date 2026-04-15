require("dotenv").config();
const express = require("express");
const { connect_mongo_db } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

function isDevOrigin(origin) {
  if (!origin || typeof origin !== "string") return false;
  const o = origin.trim();
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/.test(o);
}

app.use((req, res, next) => {
  const origin = typeof req.headers.origin === "string" ? req.headers.origin.trim() : "";

  if (origin && isDevOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  const reqHdrs = req.headers["access-control-request-headers"];
  res.setHeader(
    "Access-Control-Allow-Headers",
    reqHdrs || "Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.headers["access-control-request-private-network"] === "true") {
    res.setHeader("Access-Control-Allow-Private-Network", "true");
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

connect_mongo_db().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
