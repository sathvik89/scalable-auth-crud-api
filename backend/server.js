require("dotenv").config();
const express = require("express");
const connect_mongo_db = require("./config/db");
const cors = require("cors");

const app = express();

connect_mongo_db();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => console.log("Server running on port 5000"));