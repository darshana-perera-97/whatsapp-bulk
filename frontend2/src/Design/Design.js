import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import QRCode from "./Pages/QRCode";
import Setup from "./Pages/Setup";
import Payment from "./Pages/Payment";
import SaaSLandingPage from "./Pages/SaaSLandingPage";

export default function Design() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SaaSLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/qr" element={<QRCode />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}
