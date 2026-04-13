const Booking = require("../models/booking");
const Flight = require("../models/flights");

// ✅ Get all flights
// exports.getAllFlights = async (req, res) => {
//   try {
//     const flights = await Flight.find();
//     res.json(flights);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch flights" });
//   }
// };

// ✅ Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { flightId, passengers, date, totalPrice } = req.body;

    // 1️⃣ Validation
    if (!flightId || !passengers || !date || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Flight check
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    // 3️⃣ Seats check (🔥 important improvement)
    if (flight.seatsAvailable < passengers) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // 4️⃣ Create booking
    const booking = await Booking.create({
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

    // 5️⃣ Reduce seats (🔥 real-world logic)
    flight.seatsAvailable -= passengers;
    await flight.save();

    res.status(201).json({
      message: "Booking created (Pending Payment)",
      bookingId: booking._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
};

// ✅ Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("flight");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔥 Security improvement (user can only see own booking)
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Confirm Booking
exports.confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔥 Already confirmed check
    if (booking.paymentStatus === "Success") {
      return res.status(400).json({ message: "Already confirmed" });
    }

    booking.status = "Confirmed";
    booking.paymentStatus = "Success";

    await booking.save();

    res.json({ message: "Booking confirmed successfully ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Confirmation failed" });
  }
};