const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/booking");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
exports.createOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔥 Prevent duplicate payment
    if (booking.paymentStatus === "Success") {
      return res.status(400).json({ message: "Already paid" });
    }

    const options = {
      amount: booking.totalPrice * 100, // paise
      currency: "INR",
      receipt: `receipt_${id}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
};
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // 1️⃣ Signature verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // 2️⃣ Update booking
    // const booking = await Booking.findByIdAndUpdate(
    //   bookingId,
    //   {
    //     status: "Confirmed",
    //     paymentStatus: "Success",
    //   },
    //   { new: true }
    // );

    const booking = await Booking.findByIdAndUpdate(
  bookingId,
  {
    status: "Confirmed",
    paymentStatus: "Success",
  },
  { returnDocument: "after" }   // ✅ fix
);
    res.json({
      success: true,
      message: "Payment verified ✅",
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
};