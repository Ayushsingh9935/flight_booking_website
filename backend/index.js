// Import dependencies
require("dotenv").config();
const Razorpay = require("razorpay");
const express = require("express");
const mongoose = require("mongoose");
const Flight = require("./models/flights.js");
const Booking = require("./models/booking.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authMiddleware = require("./middleware/authmiddleware.js");

const bcrypt = require("bcryptjs");
const User = require("./models/user.js");

const app = express();
// const PORT = 5000;
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI =
  "mongodb+srv://ayushsingh993522_db_user:lvlG12GmwoJfcgcC@cluster0.9wi6dwi.mongodb.net/flight_websiteDB";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to backend");
});

// Create flight (POST)
app.post("/flights", async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json({ message: "Flight added", flight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // 4️⃣ Generate token (AFTER user created)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(token);
    // 5️⃣ Send response (Never send password)
    res.status(201).json({
      message: "Signup successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ User find karo
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2️⃣ Password compare karo
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 3️⃣ Login success
    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all flights (GET)
app.get("/flights", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/booking", authMiddleware, async (req, res) => {
  try {
    const { flightId, passengers, date, totalPrice } = req.body;

    if (!flightId || !passengers || !date || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const booking = new Booking({
      user: req.user.id,
      flight: flight._id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      from: flight.departureCity,
      to: flight.arrivalCity,
      passengers,
      date,
      totalPrice,
      status: "Pending",
      paymentStatus: "Pending",
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created (Pending Payment)",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

app.get("/booking/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Booking ID required" });
    }
    const booking = await Booking.findById(id).populate("flight"); // ✅ correct field name  // 👈 YE ADD KARO

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// app.post("/booking", authMiddleware, async (req, res) => {
//   try {
//     const { flightId, passengers, date, totalPrice } = req.body;

//     if (!flightId || !passengers || !date || !totalPrice) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const booking = new Booking({
//       user: req.user.id,
//       flight: flightId,
//       passengers,
//       date,
//       totalPrice,
//       status: "Pending",
//     });

//     await booking.save();

//     res.status(201).json({
//       message: "Booking created (Pending Payment)",
//       bookingId: booking._id,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Booking failed",
//     });
//   }
// });

// app.get("/booking/:id", authMiddleware, async (req, res) => {
//   const booking = await Booking.findById(req.params.id).populate("flight");
//   res.json(booking);
// });

app.put("/booking/confirm/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Booking ID required" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Confirmed";
    booking.paymentStatus = "Success";

    await booking.save();

    res.json({ message: "Booking confirmed successfully ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Confirmation failed" });
  }
});
// app.put("/booking/confirm/:id", authMiddleware, async (req, res) => {
//   const booking = await Booking.findById(req.params.id);

//   booking.status = "Confirmed";
//   booking.paymentStatus = "Success";

//   await booking.save();

//   res.json({ message: "Booking confirmed" });
// });

// app.post("/booking/:id", authMiddleware, async (req, res) => {
//   try {
//     console.log("USER FROM TOKEN:", req.user); // debug

//     const booking = new Booking({
//       user: req.user.id,   // schema me 'user' hai
//       ...req.body,
//     });

//     await booking.save();
// console.log(booking);
//     res.status(201).json({
//       message: "Booking successful ✅",
//       booking,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// });

app.get("/flights/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("backend se id", id);

    console.log("ID FROM FRONTEND:", id);
    const flight = await Flight.findById(id); // Mongoose method
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    console.log(flight);
    res.json(flight);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


app.post('/searchform', async (req, res) => {
  try {
    const { from, to, passengers } = req.body;

    console.log("FROM:", from);
    console.log("TO:", to);
    console.log("PASSENGERS:", passengers);

    const flights = await Flight.find({
      departureCity: { $regex: from, $options: "i" },
      arrivalCity: { $regex: to, $options: "i" },
      seatsAvailable: { $gte: passengers }
    });

    if (flights.length === 0) {
      return res.status(404).json({ message: "No Flights Found" });
    }

    res.json(flights); // ✅ VERY IMPORTANT

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Search error" });
  }
});
// app.post('/searchform', async (req, res) => {

//   const { from, to, passengers } = req.body;
//     console.log("FROM:", from);
//   console.log("TO:", to);
//   console.log("PASSENGERS:", passengers);
//   console.log(from, to, passengers," search from backend se");

//   // try {

//   //   const flights = await Flight.find({
//   //     from: { $regex: from, $options: "i" },
//   //     to: { $regex: to, $options: "i" },
//   //     seatsAvailable: { $gte: passengers }
//   //   });

//   //   if (flights.length === 0) {
//   //     return res.status(404).json({ message: "No Flights Found" });
//   //   }

//   //   res.json(flights);

//   // } catch (err) {
//   //   console.log(err);
//   //   res.status(500).json({ message: "searchform error" });
//   // }

// });

// app.post('/searchform',async(req,res)=>{

//     const { from, to, date, passengers } = req.body;
//   console.log('searchform');
//   try{
//       const flights = await Flight.find({
//       from: from,
//       to: to,
//       seatsAvailable: { $gte: passengers }
//     });

//     if (flights.length === 0) {
//       return res.status(404).json({ message: "No Flights Found" });
//     }

//     res.json(flights);

//   }catch(err){
//     console.log(err);
//     res.status(500).json({ message: " searchform data" });
//   }
//   res.send('searchfrom data is formed');



// });


// razorpay




const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/create-order/:id", authMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const options = {
      amount: booking.totalPrice * 100,
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// app.post("/create-order/:id", authMiddleware, async (req, res) => {
//    console.log("AUTH HEADER:", req.headers.authorization);
//   const bookingId = req.params.id;

//   // fetch booking price from DB
//   const booking = await Booking.findById(bookingId);

//   const options = {
//     amount: booking.totalPrice * 100, // paise
//     currency: "INR",
//   };

//   const order = await razorpay.orders.create(options);

//   res.json(order);
// });


app.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: "Confirmed",
        paymentStatus: "Success",
      });

      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Verification failed" });
  }
});
// app.post("/verify-payment",  authMiddleware,async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     bookingId,
//   } = req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   if (expectedSignature === razorpay_signature) {
//     // Payment is valid ✅

//     await Booking.findByIdAndUpdate(bookingId, {
//       status: "confirmed",
//     });

//     res.json({ success: true });
//   } else {
//     res.status(400).json({ success: false });
//   }
// });
// Start server
app.listen(5000)
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });
