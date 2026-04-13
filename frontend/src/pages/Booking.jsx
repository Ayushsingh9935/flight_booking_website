import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../App.css';

const Booking = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/flights/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Flight not found");
          return;
        }

        setFlight(data);
      } catch (err) {
        console.log(err);
        alert("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFlight();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!flight) return <h2>Flight not found</h2>;

  const handleProceedToPayment = async () => {
    if (!date) {
      alert("Please select date");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flightId: flight._id,
          passengers: Number(passengers),
          date,
          totalPrice: flight.price * Number(passengers),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      // ✅ Navigate using bookingId
      navigate(`/payment/${data.bookingId}`);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="booking-container">
      <h2>Booking for {flight.airline}</h2>

      <p>
        {flight.departureCity} → {flight.arrivalCity}
      </p>

      <p>Price per person: ₹{flight.price}</p>

      <label>Passengers:</label>
      <input
        type="number"
        value={passengers}
        onChange={(e) => setPassengers(Number(e.target.value))}
        min="1"
      />

      <br />

      <label>Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br />

      <h3>Total: ₹{flight.price * passengers}</h3>

      <button onClick={handleProceedToPayment}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default Booking;