import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeView = () => {
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/qrcode");
        if (response.ok) {
          const data = await response.json();
          setQrCode(data.qrCode);
        } else {
          console.error("Error fetching QR code:", response.statusText);
          setQrCode(null); // Clear QR code if not available
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
        setQrCode(null); // Clear QR code if an error occurs
      }
    };

    // Fetch QR code every 30 seconds
    fetchQrCode();
    const interval = setInterval(fetchQrCode, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {qrCode ? (
        <div>
          <p>Scan the QR Code to Connect:</p>
          <QRCodeCanvas value={qrCode} size={200} />
        </div>
      ) : (
        <p>QR code not available yet.</p>
      )}
    </div>
  );
};

export default QRCodeView;
