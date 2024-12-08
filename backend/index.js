const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const PORT = 3001;

let qrCodeData = null;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
    timeout: 60000,
  },
});

client.on("qr", (qr) => {
  qrCodeData = qr; // Save the QR code data
  console.log("QR code updated:", qr);
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

client.initialize();

// API endpoint to retrieve the QR code
app.get("/api/qrcode", (req, res) => {
  if (qrCodeData) {
    res.json({ qrCode: qrCodeData });
  } else {
    res.status(404).json({ message: "QR code not available yet" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
