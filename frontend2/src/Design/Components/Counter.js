import React, { useState, useEffect } from "react";
import config from "../config"; // Import the config file

const Counter = () => {
  const [connected, setConnected] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await fetch(`${config.BACKEND_URL}/api/counter`);
        if (response.ok) {
          const data = await response.json();
          setConnected(data.connected);
          setElapsedTime(data.elapsedTime);
        } else {
          console.error("Error fetching counter:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching counter:", error);
      }
    };

    // Fetch the counter every second
    fetchCounter();
    const interval = setInterval(fetchCounter, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format elapsed time into HH:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Device Connection Time</h2>
      {connected ? (
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "green" }}>
          Connected for: {formatTime(elapsedTime)}
        </p>
      ) : (
        <p style={{ fontSize: "24px", fontWeight: "bold", color: "red" }}>
          Device Disconnected
        </p>
      )}
    </div>
  );
};

export default Counter;
