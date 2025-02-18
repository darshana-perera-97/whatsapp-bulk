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
const PORT = 5007;
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

const upload = multer({
  dest: "uploads/", // Directory to save uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

app.post("/api/bulkMessage", upload.single("file"), async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file; // Uploaded CSV file

    let image = null;
    if (req.body.image) {
      image = JSON.parse(req.body.image);
    }

    if (!file || (!message && !image)) {
      return res
        .status(400)
        .json({ error: "CSV file and either message or image are required" });
    }

    // Read and parse the uploaded CSV file
    const filePath = path.join(__dirname, file.path);
    console.log("CSV File saved at:", filePath);

    const numbersArray = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // Dynamically find the column containing phone numbers
        const phoneKey = Object.keys(row).find((key) =>
          key.toLowerCase().includes("phone")
        );

        if (!phoneKey || !row[phoneKey]) {
          console.error("Invalid CSV row, missing phone number:", row);
          return;
        }

        const phoneNumber = row[phoneKey].toString().trim();
        if (phoneNumber) numbersArray.push(phoneNumber);
      })
      .on("end", async () => {
        if (numbersArray.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid phone numbers found in CSV file" });
        }

        console.log("Extracted phone numbers:", numbersArray);

        // Send messages via WhatsApp
        for (const phone of numbersArray) {
          const formattedNumber = `${phone}@c.us`;

          try {
            if (image) {
              const media = new MessageMedia(
                image.mimetype,
                image.data,
                image.filename
              );
              await client.sendMessage(formattedNumber, media, {
                caption: message,
              });
            } else {
              await client.sendMessage(formattedNumber, message);
            }
          } catch (err) {
            console.error(`Failed to send message to ${phone}:`, err);
          }
        }

        res.json({
          message: "Bulk messages sent successfully!",
          phoneNumbers: numbersArray,
        });
      });
  } catch (err) {
    console.error("Error processing bulk message:", err);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
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
