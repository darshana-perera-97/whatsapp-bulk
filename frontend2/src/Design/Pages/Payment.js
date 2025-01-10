import React, { useState } from "react";

function Payment() {
  const [amount, setAmount] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handlePayment = () => {
    if (amount && parseFloat(amount) > 0) {
      // Simulate a successful payment
      setIsPaymentSuccessful(true);
      console.log("Payment Successful! Amount:", amount); // Debugging log
    } else {
      alert("Please enter a valid amount!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f2f5fc",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Payment Page</h2>
      {!isPaymentSuccessful ? (
        <>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              marginBottom: "20px",
              padding: "10px",
              fontSize: "16px",
              width: "200px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={handlePayment}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#2A70F0",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Make Payment
          </button>
        </>
      ) : (
        <p style={{ fontSize: "18px", color: "green" }}>
          Payment Successful! Thank you.
        </p>
      )}
    </div>
  );
}

export default Payment;
