import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaThLarge,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaUser,
  FaHeart,
  FaTachometerAlt
} from "react-icons/fa";
import AuthModal from "../components/AuthModal";
import { isAuthenticated, getCurrentUser, logout } from "../utils/auth";

function DashboardNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Check authentication status
    setIsLoggedIn(isAuthenticated());
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    // Close profile dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowProfileDropdown(false);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(isAuthenticated());
    setCurrentUser(getCurrentUser());
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const getGradientStyle = (name) => {
    // Generate a gradient based on the name's first character
    const charCode = name ? name.charCodeAt(0) : 85;
    const hue = (charCode * 137.508) % 360; // Golden angle approximation for good color distribution
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 60%))`
    };
  };

  return (
    <header className={`navbar mytrips-navbar ${scrolled ? "navbar-scrolled" : ""}`}>
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

        {isLoggedIn && currentUser ? (
          <div 
            className="profile-avatar-container"
            ref={profileDropdownRef}
          >
            <div 
              className="profile-avatar"
              style={getGradientStyle(currentUser.name)}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {getInitial(currentUser.name)}
            </div>
            
            {showProfileDropdown && (
              <div className="profile-dropdown-menu">
                <div className="profile-menu-item" onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}>
                  <FaUser className="profile-menu-icon" />
                  <span>My Profile</span>
                </div>
                <div className="profile-menu-item" onClick={() => { setShowProfileDropdown(false); }}>
                  <FaHeart className="profile-menu-icon" />
                  <span>Wishlist</span>
                </div>
                <div className="profile-menu-item" onClick={() => { setShowProfileDropdown(false); navigate('/dashboard'); }}>
                  <FaTachometerAlt className="profile-menu-icon" />
                  <span>Dashboard</span>
                </div>
                <div className="profile-menu-item logout-item" onClick={handleLogout}>
                  <FaSignOutAlt className="profile-menu-icon" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="login-signup"
            onClick={() => setShowAuthModal(true)}
          >
            <FaUserCircle className="login-icon" />
            <span>Login / Signup</span>
          </div>
        )}

        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

      </div>
    </header>
  );
}

export default DashboardNavbar;
