require("dotenv").config();
const express = require("express");
const { connect_mongo_db } = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const app = express();

connect_mongo_db();
app.use(express.json());

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/tasks/", taskRoutes);


app.get("/", (req, res) => {
  res.send("API Running health check route");
});

app.listen(5000, () => console.log("Server running on port 5000"));