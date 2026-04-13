import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SearchForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const searchBar = async (e) => {
  e.preventDefault();

  try {
    const { from, to, passengers } = formData;

    const res = await fetch(
      `http://localhost:5000/api/flights/searchFlights?from=${from}&to=${to}&passengers=${passengers}`
    );

    const data = await res.json();

    console.log(data);

    // ✅ check if array
    if (Array.isArray(data) && data.length > 0) {
      navigate("/flights", { state: data });
    } else {
      alert(data.message || "No Flights Found ");
    }

  } catch (error) {
    console.error(error);
    alert("Server error ");
  }
};
 
  return (
    <div className="search-container">
      <h2>Search Flight</h2>

      <div className="search-form">
        <input
          type="text"
          name="from"
          placeholder="From"
          className="inpt"
          onChange={handleChange}
        />

        <input
          type="text"
          name="to"
          placeholder="To"
          className="inpt"
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          className="inpt"
          onChange={handleChange}
        />

        <input
          type="number"
          name="passengers"
          placeholder="Passengers"
          className="inpt"
          onChange={handleChange}
        />

        <button className="search-btn" onClick={searchBar}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
