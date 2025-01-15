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

async function msj(message, image) {
  let phoneNumber = "94771461925";
  // let image = null;

  try {
    if (isConnected) {
      const formattedNumber = `${phoneNumber}@c.us`; // Ensure correct phone number format
      // const formattedNumber = `${phoneNumber}@c.us`; // Ensure correct phone number format

      // If an image is provided, send it along with the message
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

      // res.json({ success: true, message: "Message sent successfully!" });
    } else {
      // res.status(503).json({ error: "WhatsApp client is not connected" });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    // res.status(500).json({ error: "Failed to send message or image" });
  }
}

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
app.post("/api/bulkMessage2", express.json(), async (req, res) => {
  const { message } = req.body;
  console.log(message);
  msj();
  // console.log("object");
});

const upload = multer({
  dest: "uploads/", // Directory to save uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

app.post(
  "/api/bulkMessage",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    // const { message } = req.body;
    const { message, image } = req.body;
    // const image = req.files.image ? req.files.image[0] : null;

    msj(message, image);
    // Parse the CSV file to extract phone numbers
  }
);

// Multer setup for handling file uploads

// Bulk message endpoint
app.post(
  "/api/bulk",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    const { message } = req.body;

    // Ensure both file and message are provided
    if (!req.files || !req.files.file || !message) {
      return res
        .status(400)
        .json({ error: "CSV file and message are required" });
    }

    const phoneNumbers = [];
    const image = req.files.image ? req.files.image[0] : null;

    // Log received files for debugging
    console.log("CSV File:", req.files.file[0]);
    console.log("Image File:", image);

    // Parse the CSV file to extract phone numbers
    fs.createReadStream(req.files.file[0].path)
      .pipe(csvParser())
      .on("data", (row) => {
        row = Object.keys(row).reduce((acc, key) => {
          acc[key.trim()] = row[key];
          return acc;
        }, {});
        if (row.phoneNumber) {
          phoneNumbers.push(row.phoneNumber);
        }
      })
      .on("end", async () => {
        if (phoneNumbers.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid phone numbers found in the CSV" });
        }

        let media = null;
        if (image) {
          try {
            // Process the uploaded image if it exists
            const imagePath = path.join(
              __dirname,
              "uploads",
              image.originalname
            );
            const buffer = fs.readFileSync(image.path);
            const mimeType = image.mimetype; // e.g., image/png
            media = new MessageMedia(
              mimeType,
              buffer.toString("base64"),
              image.originalname
            );

            console.log("Media object created successfully:", media);
          } catch (error) {
            console.error("Error processing image:", error);
            return res
              .status(500)
              .json({ error: "Failed to process the image file" });
          }
        }

        try {
          // Send messages to each phone number
          for (const phoneNumber of phoneNumbers) {
            const formattedNumber = `${phoneNumber}@c.us`;
            if (media) {
              // Send image with caption
              await client.sendMessage(formattedNumber, media, {
                caption: message,
              });
            } else {
              // Send plain message
              await client.sendMessage(formattedNumber, message);
            }
          }

          // Cleanup files AFTER sending all messages
          fs.unlinkSync(req.files.file[0].path);
          if (image) fs.unlinkSync(image.path);

          res.json({
            success: true,
            message: "Bulk messages sent successfully!",
            totalNumbers: phoneNumbers.length,
          });
        } catch (error) {
          console.error("Error sending bulk messages:", error);
          res.status(500).json({ error: "Failed to send bulk messages" });
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV:", error);
        res.status(500).json({ error: "Failed to parse CSV file" });
      });
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
