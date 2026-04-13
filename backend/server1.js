require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/flights", require("./routes/flightRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use('/api/payment',require('./routes/paymentRoutes'));

app.listen(5000, () => console.log("Server running"));