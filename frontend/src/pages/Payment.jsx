import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Payment = () => {
  const { id } = useParams(); // booking id
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  // 🔵 Fetch booking
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load booking ");
      }
    };

    fetchBooking();
  }, [id]);

  // 🔵 Payment handler
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Create order
      const res = await fetch(`http://localhost:5000/api/payment/create-order/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const order = await res.json();
      console.log(import.meta.env.VITE_RAZORPAY_KEY_ID);

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 🔥 env se key
        amount: order.amount,
        currency: "INR",
        name: "Flight Booking",
        description: "Ticket Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 3️⃣ Verify payment
            const verifyRes = await fetch(
              "http://localhost:5000/api/payment/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...response,
                  bookingId: id,
                }),
              }
            );

            const result = await verifyRes.json();

            if (result.success) {
              navigate(`/confirm/${id}`);
            } else {
              alert("Payment verification failed ❌");
            }
          } catch (err) {
            console.error(err);
            alert("Verification error ❌");
          }
        },

        prefill: {
          name: "Test User",
          email: "test@test.com",
          contact: "9999999999",
        },

        theme: {
          color: "#3399cc",
        },
      };

      // 4️⃣ Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

      // ❌ Handle fail
      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        alert("Payment failed ❌");
      });

    } catch (err) {
      console.error(err);
      setError("Payment failed ❌");
    }
  };

  if (!booking) return <h2>Loading...</h2>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Page 💳</h2>
      <h3>Total Amount: ₹{booking.totalPrice}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3399cc",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;