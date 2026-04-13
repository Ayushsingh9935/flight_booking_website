import React from "react";
import "../App.css";
import logo from "../assets/images/IndiGo-Logo.png";
import signup from "../assets/images/signup.png";
import { Link } from "react-router-dom";

const Navbar = () => {

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  console.log(name);
  console.log(token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.reload();
  };

  return (
    <div className="nav">
      <div className="nav-left">
        <img className="logo" src={logo} alt="" />
      </div>

      <div className="nav-right">

        {token ? (
          // ✅ If Logged In
          <>
            <span className="user-name">{name}</span>
            <button onClick={handleLogout} className="login-btn">
              Logout
            </button>
          </>
        ) : (
          // ❌ If Not Logged In
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/signup" className="sign-btn">
              <img className="logo-sign" src={signup} alt="" />
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default Navbar;