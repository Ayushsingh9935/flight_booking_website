import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import FlightCard from "../components/FlightCard.jsx";

const Flights = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ⭐ important

  const [flights, setFlights] = useState([]);

  const getFlight = async () => {
    try {
      let res = await fetch("http://localhost:5000/api/flights");
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // ⭐ Here check it search data aya hai ya nahi
    if (location.state && location.state.length > 0) {
      setFlights(location.state);
    } else {
      getFlight(); // default
    }
  }, [location.state]);

  return (
    <div className="card-details">
      {flights.length > 0 ? (
        flights.map((flight) => (
          <FlightCard
            key={flight._id}
            flight={flight}
            onClick={() => navigate(`/flights/${flight._id}`)}
          />
        ))
      ) : (
        <h2>No flights available ❌</h2>
      )}
    </div>
  );
};

export default Flights;
