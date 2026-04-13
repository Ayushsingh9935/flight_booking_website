import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

const Confirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data, "confr page");
      setBooking(data);
    };

    fetchBooking();
  }, [id]);

  if (!booking) return <h2 className="loading">Loading...</h2>;
  console.log(booking, "conform page wala");

  return (
    <div className="confirm-container">
      <div className="confirm-card">
        <div className="success-icon">✅</div>

        <h2 className="confirm-title">Booking Confirmed!</h2>

        <p className="booking-id">
          Booking ID: <strong>{booking._id}</strong>
        </p>

        <div className="confirm-details">
          <p>
            <span>Flight:</span> {booking.flight?.airline}
          </p>
          <p>
            <span>From:</span> {booking.flight?.departureCity}
          </p>
          <p>
            <span>To:</span> {booking.flight?.arrivalCity}
          </p>
          <p>
            <span>Passengers:</span> {booking.passengers}
          </p>
          <p>
            <span>Total Paid:</span> ₹{booking.totalPrice}
          </p>
        </div>

        <div className="status-badge">{booking.status}</div>

        <button className="home-btn" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Confirm;
