import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import the named export

const QRCode = () => {
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    // Fetch the QR code from the backend
    const fetchQrCode = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/qrcode");
        const data = await response.json();
        if (data.qrCode) {
          setQrCode(data.qrCode);
        } else {
          console.log("QR code not available yet");
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
      }
    };

    fetchQrCode();
    const interval = setInterval(fetchQrCode, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Cleanup the interval
  }, []);

  return (
    <div>
      <h1>Scan QR Code</h1>
      {qrCode ? (
        <QRCodeCanvas value={qrCode} size={256} />
      ) : (
        <p>Loading QR code...</p>
      )}

      <a href="/setup">setup</a>
    </div>
  );
};

export default QRCode;
