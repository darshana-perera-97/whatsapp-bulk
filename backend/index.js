const express = require("express");
const bodyParser = require("body-parser");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const cors = require("cors");
const multer = require("multer"); // For file uploads
const csvParser = require("csv-parser"); // For parsing CSV files

const app = express();
const PORT = 3001;
app.use(cors());

let qrCodeData = null;
let isConnected = false; // Track connection status
let connectedTime = null; // Track the time the device connected

app.use(bodyParser.json({ limit: "50mb" })); // Adjust '50mb' as needed
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

let client = createClient(); // Initialize the WhatsApp client

// Function to create a new WhatsApp client
function createClient() {
  const authPath = path.join(__dirname, ".wwebjs_auth");

  // Clean up auth directory
  if (fs.existsSync(authPath)) {
    fs.rmSync(authPath, { recursive: true, force: true }); // Delete the directory
    console.log("Auth directory cleaned up.");
  }

  const newClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox"],
      timeout: 60000,
    },
  });

  newClient.on("qr", (qr) => {
    qrCodeData = qr;
    isConnected = false;
    connectedTime = null;
    console.log("QR code updated:", qr);
  });

  newClient.on("ready", () => {
    isConnected = true;
    connectedTime = new Date();
    console.log("WhatsApp client is ready!");
    startDisconnectTimer();
  });

  newClient.on("disconnected", () => {
    console.log("WhatsApp client disconnected.");
  });

  newClient.initialize();
  return newClient;
}

// Function to check elapsed time and disconnect if > 30 seconds
const startDisconnectTimer = () => {
  const interval = setInterval(async () => {
    if (connectedTime && isConnected) {
      const currentTime = new Date();
      const elapsedTime = Math.floor((currentTime - connectedTime) / 1000); // Elapsed time in seconds
      if (elapsedTime >= 300) {
        console.log("Disconnecting WhatsApp client...");
        try {
          await client.destroy(); // Destroy the client to release resources
          console.log("Client destroyed. Reinitializing for a new QR code...");
          client = createClient(); // Reinitialize the client
        } catch (error) {
          console.error("Error during disconnect:", error.message);
        } finally {
          isConnected = false;
          connectedTime = null;
          qrCodeData = null;
          clearInterval(interval); // Stop the timer
        }
      }
    }
  }, 1000); // Check every second
};

// API endpoint to retrieve the QR code
app.get("/api/qrcode", (req, res) => {
  if (qrCodeData) {
    res.json({ qrCode: qrCodeData });
  } else {
    res.status(404).json({ message: "QR code not available yet" });
  }
});

// API endpoint to check connection status
app.get("/api/status", (req, res) => {
  res.json({ connected: isConnected });
});

// API endpoint to check connected time
app.get("/api/counter", (req, res) => {
  if (isConnected && connectedTime) {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - connectedTime) / 1000); // Elapsed time in seconds
    res.json({ connected: true, elapsedTime });
  } else {
    res.json({ connected: false, elapsedTime: 0 });
  }
});

// **🚀 Multer Setup for File Uploads**
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post("/api/bulk", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ error: "CSV file is required" });
    }

    const message = req.body.message;
    const image = req.body.image ? JSON.parse(req.body.image) : null;
    const filePath = req.file.path;
    const phoneNumbers = [];

    console.log("📂 Processing CSV File:", req.file.originalname);

    // **📌 Fix: Explicitly Define Headers**
    fs.createReadStream(filePath)
      .pipe(csv({ headers: true, skipLines: 0, trim: true }))
      .on("data", (row) => {
        console.log("📊 Row Data:", row);

        // **Fix column issue by checking possible variations**
        const phone =
          row.phoneNumber || row["phoneNumber"] || row["_0"]?.trim();

        if (phone && /^\d+$/.test(phone)) {
          phoneNumbers.push(phone);
        }
      })
      .on("end", async () => {
        fs.unlinkSync(filePath); // Cleanup temp file

        if (phoneNumbers.length === 0) {
          console.log("❌ No valid phone numbers found!");
          return res
            .status(400)
            .json({ error: "No valid phone numbers found in CSV" });
        }

        console.log("✅ Extracted Phone Numbers:", phoneNumbers);

        // **📲 Send Messages**
        for (const phone of phoneNumbers) {
          const formattedPhone = `${phone}@c.us`;
          if (image) {
            const media = new MessageMedia(
              image.mimetype,
              image.data,
              image.filename
            );
            await client.sendMessage(formattedPhone, media, {
              caption: message,
            });
          } else {
            await client.sendMessage(formattedPhone, message);
          }
        }

        res.json({
          message: `Messages sent to ${phoneNumbers.length} contacts`,
        });
      });
  } catch (error) {
    console.error("🚨 Error processing bulk messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for single message
app.post("/api/sendSingleMsg", express.json(), async (req, res) => {
  const { phoneNumber, message, image } = req.body;

  if (!phoneNumber || (!message && !image)) {
    return res
      .status(400)
      .json({ error: "Phone number and either message or image are required" });
  }

  try {
    if (isConnected) {
      const formattedNumber = `${phoneNumber}@c.us`; // Ensure correct phone number format

      // If an image is provided, send it along with the message
      if (image) {
        const media = new MessageMedia(
          image.mimetype,
          image.data,
          image.filename
        );
        await client.sendMessage(formattedNumber, media, { caption: message });
      } else {
        await client.sendMessage(formattedNumber, message);
      }

      res.json({ success: true, message: "Message sent successfully!" });
    } else {
      res.status(503).json({ error: "WhatsApp client is not connected" });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message or image" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
