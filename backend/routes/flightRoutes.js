const express = require("express");
const router = express.Router();

// const { getBookingById } = require("../controllers/bookingController");

const {
  getAllFlights,
  searchFlights,
  getFlightById,
} = require("../controllers/flightController");
router.get("/", getAllFlights);
router.get("/searchFlights", searchFlights);
// router.get("/flight/:id", getFlightById);
router.get("/:id", getFlightById);
// router.get("/:id", getBookingById);

module.exports = router;
