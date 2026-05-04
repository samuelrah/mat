
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import Home from "../JSX/Home";
import About from "../JSX/About";
import Account from "../JSX/Account";
import Gallery from "../JSX/Gallery";
import Menu from "../JSX/Menu";
import Cart from "../JSX/Cart";
import Payment from "../JSX/Payment";
import Login from "../JSX/Login";
import Admin from "../JSX/Admin";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/App.css";

function Sidebar({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  return (
    <div className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="close-btn" onClick={() => setMenuOpen(false)}>
        ✕
      </div>
      <ul>
        <li><button onClick={() => {navigate("/"); setMenuOpen(false);}}>Startsida</button></li>
        <li><button onClick={() => {navigate("/gallery"); setMenuOpen(false);}}>Galleri</button></li>
        <li><button onClick={() => {navigate("/about"); setMenuOpen(false);}}>Om oss</button></li>
        <li><button onClick={() => {navigate("/menu"); setMenuOpen(false);}}>Meny</button></li>
        <li><button onClick={() => {navigate("/cart"); setMenuOpen(false);}}>Kundvagn</button></li>
        <li><button onClick={() => {navigate("/payment"); setMenuOpen(false);}}>Betalning</button></li>
        <li><button onClick={() => {navigate("/admin"); setMenuOpen(false);}}>Admin</button></li>
      </ul>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <Router>
      <div className="app">
        {/* Burger ikon */}
        <div className="burger" onClick={() => setMenuOpen(true)}>
          ☰
        </div>
        {/* Sök + profil */}
        <div className="top-right">
          <input type="text" placeholder="sök" className="search" />
          <Link className="profile" to="/account" />
        </div>
          {/* Sidebar */}
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        {/* Overlay */}
        {menuOpen && (
          <div className="overlay" onClick={() => setMenuOpen(false)}></div>
        )}
        {/* Main content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="/gallery" element={<Gallery />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 