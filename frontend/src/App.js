import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Design/Pages/Login";
import QRCode from "./Design/Pages/QRCode";
import Setup from "./Design/Pages/Setup";
import Payment from "./Design/Pages/Payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/qr" element={<QRCode />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
