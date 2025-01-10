import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Function to generate a 6-digit random number
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    const otp = generateOTP();
    localStorage.setItem("authToken", JSON.stringify({ otp }));
    console.log("Generated OTP:", otp); // For debugging (remove in production)
  }, []);

  const handleProceed = () => {
    navigate("/payment"); // Navigate to Payment page
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f2f5fc",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Welcome!</h2>
      <p style={{ marginBottom: "30px" }}>
        A secure OTP has been generated and stored.
      </p>
      <button
        onClick={handleProceed}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#2A70F0",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <Link to="/qr">Save</Link>
      </button>
      <a href="/qr">asd</a>
    </div>
  );
}

export default Login;
