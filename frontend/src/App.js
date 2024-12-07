import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Design/Pages/Login";
import QRCode from "./Design/Pages/QRCode";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Setup from "./Design/Pages/Setup";

function App() {
  const clientId =
    "217224559773-kqu6heilvpmqq2qodtcja1cfbr6isjb9.apps.googleusercontent.com"; // Replace with your Google Client ID

  // Function to check login status
  const isLoggedIn = () => {
    const authToken = localStorage.getItem("authToken");
    const googleLoginStatus = localStorage.getItem("googleLogin"); // Example key for Google login
    return authToken && googleLoginStatus === "true"; // Adjust logic based on your storage
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/qr"
            element={
              isLoggedIn() ? <QRCode /> : <Navigate to="/login" /> 
            }
          />
          <Route
            path="/setup"
            element={
              isLoggedIn() ? <Setup /> : <Navigate to="/login" /> 
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
