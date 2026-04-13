const Flight = require("../models/flights");
const Booking = require("../models/booking");
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlightById = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await Flight.findById(id); // ✅ correct model

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.json(flight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// exports.getFlightById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const booking = await Booking.findById(id).populate("flight");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // 🔥 Security improvement (user can only see own booking)
//     if (booking.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Unauthorized access" });
//     }

//     res.json(booking);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
// controllers/flightController.js

exports.searchFlights = async (req, res) => {
  try {
    // const { from, to, passengers } = req.body;
    const { from, to, passengers } = req.query;

    // 1️⃣ Validation
    if (!from || !to || !passengers) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Query
    const flights = await Flight.find({
      departureCity: { $regex: `^${from}`, $options: "i" }, // 🔥 better match
      arrivalCity: { $regex: `^${to}`, $options: "i" },
      seatsAvailable: { $gte: passengers },
    });

    // 3️⃣ Response
    if (flights.length === 0) {
      return res.status(200).json({ message: "No Flights Found", flights: [] }); // 🔥 404 avoid
    }

    res.json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
};
