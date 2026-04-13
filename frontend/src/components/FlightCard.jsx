import React from "react";
import { useNavigate } from "react-router";
import "../APP.css";

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();
  return (
    <div className="flight-card">
      <div className="flight-left">
        <img src={flight.logo} alt="logo" className="airline-logo" />
        <p className="airline-name">{flight.airline}</p>
        <p>{flight.cabin}</p>
      </div>

      <div className="flight-middle">
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

      <div className="flight-right">
        <h2>₹{flight.price}</h2>
        <p>{flight.refundable ? "Refundable" : "Non-Refundable"}</p>
        <button onClick={() => navigate(`/flights/${flight._id}`)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
