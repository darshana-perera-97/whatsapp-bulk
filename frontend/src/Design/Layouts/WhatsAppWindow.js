import React from "react";

const WhatsAppWindow = ({ phoneNumber, message, image }) => {
  const messages = [
    { sender: "me", text: message, timestamp: "10:30 AM" },
    // {
    //   sender: "other",
    //   text: "I'm good, thanks! How about you?",
    //   timestamp: "10:31 AM",
    // },
    // {
    //   sender: "me",
    //   text: "I'm great, just working on some stuff.",
    //   timestamp: "10:32 AM",
    // },
    // {
    //   sender: "other",
    //   text: "Sounds good. What are you working on?",
    //   timestamp: "10:33 AM",
    // },
    // { sender: "me", text: "Just building a React app.", timestamp: "10:34 AM" },
    // {
    //   sender: "me",
    //   image: "path/to/image.jpg", // Adding an image message
    //   timestamp: "10:35 AM",
    // },
  ];

  return (
    <div className="whatsapp-window">
      <div className="header">
        <img
          src="path/to/profile-picture.jpg"
          alt="Profile"
          className="profile-pic"
        />
        <div className="contact-info">
          <h4>Contact Name</h4>
          <p>Last seen at 10:30 AM</p>
        </div>
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "me" ? "my-message" : "other-message"
            }`}
          >
            <div className="message-content">
              {message.text && <p>{message.text}</p>}
              {image && (
                <img
                  src={`data:${image.mimetype};base64,${image.data}`}
                  alt="Image Message"
                  className="message-image"
                  style={{ maxWidth: "200px" }}
                />
              )}
              <span className="timestamp">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsAppWindow;
