import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/flights/${id}`);
        if (!res.ok) throw new Error("Failed to fetch flight");

        const data = await res.json();
        console.log(data,"flightdetaisl page se");
        setFlight(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFlight();
  }, [id]);

  const handleBooking = () => {
    if (!flight) {
      console.log(flight);
      return;
    }
    navigate(`/booking/${flight._id}`);
  };

  if (!id) return <h2>No Flight Selected ❌</h2>;
  if (loading) return <h2>Loading Flight Details...</h2>;
  if (!flight) return <h2>No Flight Found ❌</h2>;

  return (
    <div className="flight-details-card">
      <div className="flight-header">
        <div>
          <img src={flight.logo} alt="logo" width="60" />
          <h3>{flight.airline}</h3>
        </div>
        <h2>₹{flight.price}</h2>
      </div>

      <div className="flight-route">
        <div>
          <h3>{flight.departureTime}</h3>
          <p>{flight.from}</p>
        </div>

        <div>
          <p>{flight.duration}</p>
          <p>{flight.stops}</p>
        </div>

        <div>
          <h3>{flight.arrivalTime}</h3>
          <p>{flight.to}</p>
        </div>
      </div>

      <p>Cabin: {flight.cabin}</p>
      <p>Baggage: {flight.baggage}</p>
      <p>{flight.refundable ? "Refundable" : "Non-Refundable"}</p>

      <button className="book-btn" onClick={handleBooking}>
        Book Now
      </button>
    </div>
  );
};

export default FlightDetails;
