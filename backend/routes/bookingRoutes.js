const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");

const {
  createBooking,
  getBookingById,
  confirmBooking,
} = require("../controllers/bookingController");

router.post("/", authMiddleware, createBooking);
router.get("/:id", authMiddleware, getBookingById);
router.put("/confirm/:id", authMiddleware, confirmBooking);

module.exports = router;