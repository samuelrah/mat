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
import TopNavBar from "../JSX/TopNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/App.css";

/* Sidebar-komponenten visar navigationsmenyn och styr om admin-länken ska visas.
   Den lyssnar också på lokal lagring och användarinloggnings-händelser för att uppdatera rollen. */
function Sidebar({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = React.useState(false);

  const updateAdminStatus = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setIsAdmin(user.isAdmin || false);
    }
  };

  React.useEffect(() => {
    updateAdminStatus();

    const handleStorageChange = () => {
      updateAdminStatus();
    };

    const handleUserLogin = () => {
      updateAdminStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

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
        {isAdmin && <li><button onClick={() => {navigate("/admin"); setMenuOpen(false);}}>Admin</button></li>}
      </ul>
    </div>
  );
}

/* App är huvudkomponenten som hanterar global status för menyer, autentisering och routing i appen. */
function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  /* Uppdatera inloggningsstatusen genom att läsa användardata från localStorage. */
  const updateAuthStatus = () => {
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!userData);
    if (userData) {
      const user = JSON.parse(userData);
      setIsAdmin(user.isAdmin || false);
    }
  };

  React.useEffect(() => {
    updateAuthStatus();

    const handleStorageChange = () => {
      updateAuthStatus();
    };

    const handleUserLogin = () => {
      updateAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <>
          {/* Top Navigation Bar */}
          <TopNavBar 
            menuOpen={menuOpen} 
            setMenuOpen={setMenuOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {/* Sidebar */}
          <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          {/* Overlay */}
          {menuOpen && (
            <div className="overlay" onClick={() => setMenuOpen(false)}></div>
          )}
        </>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={isAuthenticated ? <Account /> : <Login />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={isAuthenticated && isAdmin ? <Admin /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
