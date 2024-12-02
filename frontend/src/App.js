import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Design/Pages/Login";
import QRCode from "./Design/Pages/QRCode";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import Setup from "./Design/Pages/Setup";

function App() {
  const clientId =
    "217224559773-kqu6heilvpmqq2qodtcja1cfbr6isjb9.apps.googleusercontent.com"; // Replace with your Google Client ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/qr"
            element={
              // Check if user is logged in
              localStorage.getItem("authToken") ? (
                <QRCode />
              ) : (
                <Navigate to="/login" /> // Redirect to / if not logged in
              )
            }
          />
          <Route
            path="/setup"
            element={
              // Check if user is logged in
              localStorage.getItem("authToken") ? (
                <Setup />
              ) : (
                <Navigate to="/login" /> // Redirect to / if not logged in
              )
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
