const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-order/:id", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);

module.exports = router;