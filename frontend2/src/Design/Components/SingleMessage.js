import React, { useState } from "react";
import BulkMessageUploader from "../Pages/BulkMessageUploader";
import config from "../config"; // Import the config file

const SingleMessage = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("Sample Message");
  const [image, setImage] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
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

  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBulkFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "single") {
      if (!phoneNumber || (!message && !image)) {
        setResponse({
          error: "Phone number and either message or image are required",
        });
        return;
      }
      try {
        const res = await fetch(`${config.BACKEND_URL}/api/sendSingleMsg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, message, image }),
        });

        const data = await res.json();
        if (res.ok) {
          setResponse(data);
        } else {
          setResponse({ error: data.error || "An error occurred" });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setResponse({ error: "An error occurred while sending the message" });
      }
    }
    if (activeTab === "bulk") {
      if (!bulkFile || (!message && !image)) {
        setResponse({
          error: "CSV file and either message or image are required",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", bulkFile);
      formData.append("message", message);
      if (image) {
        formData.append("image", JSON.stringify(image));
      }

      try {
        const res = await fetch(`${config.BACKEND_URL}/api/bulk`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          setResponse(data);
        } else {
          setResponse({ error: data.error || "An error occurred" });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setResponse({ error: "An error occurred while sending the messages" });
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Send WhatsApp Messages</h3>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "single" ? "active" : ""}`}
            onClick={() => setActiveTab("single")}
          >
            Single
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "bulk" ? "active" : ""}`}
            onClick={() => setActiveTab("bulk")}
          >
            Bulk
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {activeTab === "single" && (
          <div className="tab-pane active">
            <div className="card">
              <div className="row">
                <div className="col-md-7">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label
                          htmlFor="phoneNumber"
                          className="form-label fw-bold"
                        >
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
                        <label htmlFor="message" className="form-label fw-bold">
                          Message:
                        </label>
                        <textarea
                          className="form-control"
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Enter your message"
                          rows="4"
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="image" className="form-label fw-bold">
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
                      <button type="submit" className="btn btn-primary w-100">
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
                <div className="col-md-1"></div>

                {/* Preview Section */}
                <div className="col-md-4">
                  <div className="card ">
                    <div className="card-body ">
                      <h5 className="card-title text-center">
                        Message Preview
                      </h5>
                      {phoneNumber || message || image ? (
                        <div>
                          <div className="message-header">
                            <div className="contact-info">
                              <span className="contact-name">
                                To - {phoneNumber || "Unknown Contact"}
                              </span>
                            </div>
                          </div>
                          <div className="whatsapp-message-preview">
                            <div className="message-body">
                              {image && (
                                <img
                                  src={`data:${image.mimetype};base64,${image.data}`}
                                  alt="Image Message"
                                  className="message-image"
                                  style={{ maxWidth: "200px" }}
                                />
                              )}
                              {message && (
                                <p className="message-text">{message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted text-center">
                          Enter details to see a preview.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bulk" && (
          // <div className="tab-pane active">
          //   <div className="card">
          //     <div className="row">
          //       <div className="col-md-7">
          //         <div className="card-body">
          //           <form onSubmit={handleSubmit}>
          //             <div className="mb-3">
          //               <label
          //                 htmlFor="bulkFile"
          //                 className="form-label fw-bold"
          //               >
          //                 Upload CSV File:
          //               </label>
          //               <input
          //                 type="file"
          //                 className="form-control"
          //                 id="bulkFile"
          //                 accept=".csv"
          //                 onChange={handleBulkFileChange}
          //               />
          //             </div>
          //             <div className="mb-3">
          //               <label htmlFor="message" className="form-label fw-bold">
          //                 Message:
          //               </label>
          //               <textarea
          //                 className="form-control"
          //                 id="message"
          //                 value={message}
          //                 onChange={(e) => setMessage(e.target.value)}
          //                 placeholder="Enter your message"
          //                 rows="4"
          //               ></textarea>
          //               <div className="mb-3">
          //                 <label htmlFor="image" className="form-label fw-bold">
          //                   Image (optional):
          //                 </label>
          //                 <input
          //                   type="file"
          //                   className="form-control"
          //                   id="image"
          //                   accept="image/*"
          //                   onChange={handleImageChange}
          //                 />
          //               </div>
          //             </div>
          //             <button type="submit" className="btn btn-primary w-100">
          //               Send Bulk Messages
          //             </button>
          //           </form>
          //         </div>
          //       </div>
          //       <div className="col-md-1"></div>

          //       {/* Preview Section */}
          //       <div className="col-md-4">
          //         <div className="card shadow">
          //           <div className="card-body ">
          //             <h5 className="card-title text-center">
          //               Message Preview
          //             </h5>
          //             {message || image ? (
          //               <div>
          //                 <div className="whatsapp-message-preview">
          //                   <div className="message-body">
          //                     {image && (
          //                       <img
          //                         src={`data:${image.mimetype};base64,${image.data}`}
          //                         alt="Image Message"
          //                         className="message-image"
          //                         style={{ maxWidth: "200px" }}
          //                       />
          //                     )}
          //                     {message && (
          //                       <p className="message-text">{message}</p>
          //                     )}
          //                   </div>
          //                 </div>
          //               </div>
          //             ) : (
          //               <p className="text-muted text-center">
          //                 Enter details to see a preview.
          //               </p>
          //             )}
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <div className="tab-pane active">
            <BulkMessageUploader />
          </div>
        )}
      </div>

      {response && (
        <div className="mt-3">
          {response.error ? (
            <div className="alert alert-danger text-center">
              {response.error}
            </div>
          ) : (
            <div className="alert alert-success text-center">
              {response.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleMessage;
