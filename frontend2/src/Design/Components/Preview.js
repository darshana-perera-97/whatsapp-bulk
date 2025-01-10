import React from "react";

const Preview = ({ phoneNumber, message, image }) => {
  return (
    <div className="preview-container mt-5">
      <h4>Message Preview</h4>
      <div className="mb-3">
        <strong>Phone Number:</strong> {phoneNumber}
      </div>
      <div className="mb-3">
        <strong>Message:</strong>
        <p>{message}</p>
      </div>
      {image && (
        <div className="mb-3">
          <strong>Image Preview:</strong>
          <img
            src={`data:${image.mimetype};base64,${image.data}`}
            alt={image.filename}
            className="img-fluid"
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Preview;
