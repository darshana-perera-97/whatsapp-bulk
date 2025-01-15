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

// Multer setup for handling file uploads
const upload = multer({
  dest: "uploads/", // Directory to save uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

app.post("/api/bulkMessage", upload.single("file"), async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file; // CSV file

    let image = null;
    if (req.body.image) {
      image = JSON.parse(req.body.image);
    }

    if (!file || (!message && !image)) {
      return res
        .status(400)
        .json({ error: "CSV file and either message or image are required" });
    }

    // Process the uploaded CSV file
    const filePath = path.join(__dirname, file.path);
    console.log("CSV File saved at:", filePath);
    console.log("img:", image);

    // Array to hold all numbers from the CSV
    const numbersArray = ["971461925@c.us"];

    // Read and parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        console.log(row); // Log each row to check its structure
        if (row.phoneNumber) {
          const phoneNumber = parseInt(row.phoneNumber); // Parse as integer
          console.log("Parsed phone number:", phoneNumber.phoneNumber);
          numbersArray.push(phoneNumber.phoneNumber); // Add to array
        }
      })
      .on("end", () => {
        console.log("CSV file successfully processed.");
        console.log("Extracted numbers:", numbersArray);
      });

    // Save the uploaded image (if provided)
    let imagePath = null;
    if (image && image.data && image.mimetype) {
      const buffer = Buffer.from(image.data, "base64"); // Decode Base64 image

      // Extract the file extension from the mimetype
      const mimeType = image.mimetype; // e.g., "image/png"
      const extension = mimeType.split("/")[1]; // Extract "png"
      const imageName = `image_${Date.now()}.${extension}`;
      imagePath = path.join(__dirname, "uploads", imageName);

      // Write image to the uploads folder
      fs.writeFileSync(imagePath, buffer);
      console.log("Image saved at:", imagePath);
    }

    res.json({
      message: "Bulk messages sent successfully!",
      imagePath: imagePath ? `/uploads/${path.basename(imagePath)}` : null,
    });
  } catch (err) {
    console.error("Error processing bulk message:", err);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
