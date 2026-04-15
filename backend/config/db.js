const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connect_mongo_db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.error(error);
    process.exit(1); //immediately stops your Node.js app
  }
};

module.exports = connect_mongo_db;