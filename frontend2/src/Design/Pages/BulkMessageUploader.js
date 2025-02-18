import React, { useState } from "react";
import config from "../config"; // Import the config file
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const BulkMessageUploader = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        setImage({
          data: reader.result.split(",")[1], // Extract base64 data
          mimetype: selectedFile.type,
          filename: selectedFile.name,
        });
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);
    if (image) {
      formData.append("image", JSON.stringify(image));
    }

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/bulkMessage`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("Response:", data);
      alert("Bulk message request sent successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error processing bulk message.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Bulk Message Uploader</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* File Input */}
            <div className="mb-3">
              <label className="form-label">Upload CSV File</label>
              <input
                type="file"
                accept=".csv"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            {/* Message Textarea */}
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label">Upload Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-success">
                <i className="fas fa-paper-plane"></i> Send Bulk Messages
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkMessageUploader;
