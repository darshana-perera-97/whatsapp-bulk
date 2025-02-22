import React, { useState, useEffect } from "react";
import QRCodeView from "./QRCodeView";

const State = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/status");
        if (response.ok) {
          const data = await response.json();
          setConnected(data.connected);
        } else {
          console.error("Error fetching status:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    // Fetch connection status every 5 seconds
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>WhatsApp Connection Status</h2>
      {connected ? (
        <p style={{ color: "green", fontWeight: "bold" }}>Connected ✅</p>
      ) : (
        <div>
          <p style={{ color: "red", fontWeight: "bold" }}>Not Connected ❌</p>
          <QRCodeView />
        </div>
      )}
    </div>
  );
};

export default State;
