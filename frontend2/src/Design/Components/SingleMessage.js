import React, { useState } from "react";
import Preview from "./Preview";
import WhatsAppWindow from "../Layouts/WhatsAppWindow";

const SingleMessage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("Sample Message");
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage({
          data: reader.result.split(",")[1], // Base64 data
          mimetype: file.type,
          filename: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || (!message && !image)) {
      setResponse({
        error: "Phone number and either message or image are required",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/sendSingleMsg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, message, image }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data); // Success response
      } else {
        setResponse({ error: data.error || "An error occurred" });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setResponse({ error: "An error occurred while sending the message" });
    }
  };

  return (
    <div className="container mt-5">
      <h3>Send a Single Message with Image</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number:
          </label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number with country code"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message:
          </label>
          <textarea
            className="form-control"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image (optional):
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>

      {/* Preview Section */}
      {/* {(phoneNumber || message || image) && (
        <Preview phoneNumber={phoneNumber} message={message} image={image} />
      )} */}
      {(phoneNumber || message || image) && (
        <WhatsAppWindow
          phoneNumber={phoneNumber}
          message={message}
          image={image}
        />
      )}

      {response && (
        <div className="mt-3">
          {response.error ? (
            <div className="alert alert-danger">{response.error}</div>
          ) : (
            <div className="alert alert-success">{response.message}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleMessage;
