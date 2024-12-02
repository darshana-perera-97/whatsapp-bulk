import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin
import { useNavigate } from "react-router-dom"; // For navigation after login

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated (use localStorage or other methods)
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      navigate("/qr"); // Redirect to QR page if already authenticated
    }
  }, [navigate]);

  const handleLoginSuccess = (response) => {
    // Here you should verify the Google token and get user details
    // For now, we store the auth token in localStorage
    localStorage.setItem("authToken", response.credential);
    setIsAuthenticated(true);
    navigate("/qr"); // Redirect to QR page after successful login
  };

  const handleLoginFailure = (error) => {
    console.error("Login failed:", error);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      ) : (
        <p>Welcome back!</p>
      )}
    </div>
  );
};

export default Login;
