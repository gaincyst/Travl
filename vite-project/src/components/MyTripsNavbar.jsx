import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaThLarge,
  FaUserCircle,
  FaSun,
  FaMoon
} from "react-icons/fa";
import AuthModal from "../components/AuthModal";

function MyTripsNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      {/* LOGO */}
      <div className="logo">
        <a href="/">
          <img src="/logos.png" alt="Travel2 Logo" className="navbar-logo-img" />
        </a>
      </div>

      {/* CENTER */}
      {!scrolled ? (
        <nav className="nav-center">
          <span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <FaPlane /> Flights
          </span>
          <span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <FaBus /> Buses
          </span>
          <span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <FaHotel /> Hotels
          </span>
        </nav>
      ) : (
        <nav className="nav-center">
          <span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <FaPlane /> Flights
          </span>
          <span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <FaBus /> Buses
          </span>
          <span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <FaHotel /> Hotels
          </span>
          <span className="nav-link"><FaThLarge /> More</span>
        </nav>
      )}

      {/* RIGHT */}
      <div className="nav-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </button>

        <div className="my-trips" onClick={() => navigate('/my-trips')}>
          <img src="/logo/luggage.png" alt="My Trips" className="luggage-icon" />
          <div className="my-trips-text">
            <span className="my-trips-title">My Trips</span>
            <span className="my-trips-subtitle">Manage your bookings</span>
          </div>
        </div>

        <div
  className="login-signup"
  onClick={() => setShowAuthModal(true)}
>
  <FaUserCircle className="login-icon" />
  <span>Login / Signup</span>
</div>

{showAuthModal && (
  <AuthModal onClose={() => setShowAuthModal(false)} />
)}

      </div>
    </header>
  );
}

export default MyTripsNavbar;
