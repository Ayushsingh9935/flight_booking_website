// // config/db.js
// require("dotenv").config();
const mongoose = require("mongoose");


const connectDB = async () => {
  console.log("ENV CHECK:", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;