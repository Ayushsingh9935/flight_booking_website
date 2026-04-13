import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Login Failed !");
        return;
      }

      // ✅ Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);

      console.log("Login Successful ✅");
      setMessage("Login Successful ✅");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error, "Server backend error from login");
    
    }
  };

  return (
    <div className="login">
      <div className="login-div">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {message && <p className="success-msg">{message}</p>}

        <button onClick={handleLogin}>Login</button>
        {error && <p className="success-er">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
