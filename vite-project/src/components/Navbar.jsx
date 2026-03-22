import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaPlane,
  FaHotel,
  FaBus,
  FaThLarge,
  FaBuilding,
  FaQuestionCircle,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaUmbrellaBeach,
  FaGlobe,
  FaSignOutAlt,
  FaUser,
  FaTachometerAlt
} from "react-icons/fa";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";


import { GiWorld } from "react-icons/gi";
import { MdOutlineLoyalty } from "react-icons/md";
import { MdOutlineCardTravel } from "react-icons/md";
import { TbGraphFilled } from "react-icons/tb";
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const { isLoggedIn, currentUser, refreshAuth, logoutUser } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
    logoutUser();
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleAuthSuccess = () => {
    refreshAuth();
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
          <span className="nav-link">About Us</span>

          {/* SOLUTIONS MEGA MENU */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenMenu("solutions")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span className="nav-link">
              Solutions <FaChevronDown />
            </span>

            {openMenu === "solutions" && (
              <div className="mega-menu animate-slide">
                <div className="mega-menu-content">
                  {/* Left Side: Services Grid */}
                  <div className="mega-menu-main">
                    <h3>Solutions</h3>
                    <p className="menu-subtitle">An end-to-end suite of travel APIs and white-label solutions—built to scale with your business.</p>
                    
                    <div className="mega-grid">
                      <DropdownItem icon={<FaPlane />} title="Flight API" desc="Lorem ipsum dolor sit amet consectetur." />
                      <DropdownItem icon={<FaHotel />} title="Hotel API" desc="Lorem ipsum dolor sit amet consectetur." />
                      <DropdownItem icon={<FaBus />} title="Bus API" desc="Lorem ipsum dolor sit amet consectetur." />
                      <DropdownItem icon={<FaUmbrellaBeach />} title="Holiday API" desc="Lorem ipsum dolor sit amet consectetur." />
                      <DropdownItem icon={<FaGlobe />} title="Whitelabel" desc="Lorem ipsum dolor sit amet consectetur." />
                    </div>
                  </div>

                  {/* Right Side: Promo Card */}
                  <div className="mega-menu-promo">
                    <div className="promo-card">
                      <div className="promo-image-placeholder">
                         <img src="/offers/soffer.jpeg" alt="App Preview" />
                      </div>
                      <h4>Save 20% on travel APIs</h4>
                      <p>Get a 1-month free membership on us. Scalable APIs and white-label solutions tailored to your business.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INDUSTRIES MEGA MENU */}
<div
  className="nav-dropdown"
  onMouseEnter={() => setOpenMenu("industries")}
  onMouseLeave={() => setOpenMenu(null)}
>
  <span className="nav-link">
    Industries <FaChevronDown className={`arrow ${openMenu === "industries" ? "up" : ""}`} />
  </span>

  {openMenu === "industries" && (
    <div className="mega-menu animate-slide">
      <div className="mega-menu-content">
        {/* Left Side: Industry Grid */}
        <div className="mega-menu-main">
          <h3>Industries</h3>
          <p className="menu-subtitle">Whether you're a travel agent or a fintech disruptor, Travel2 adapts to your business model.</p>
          
          <div className="mega-grid">
            <DropdownItem 
              icon={<GiWorld />} 
              title="Travel Agencies" 
              desc="Lorem ipsum dolor sit amet consectetur." 
            />
            <DropdownItem 
              icon={<MdOutlineLoyalty />} 
              title="Fintech & Loyalty Platforms" 
              desc="Lorem ipsum dolor sit amet consectetur." 
            />
            <DropdownItem 
              icon={<MdOutlineCardTravel />} 
              title="Content Creators & Influencers" 
              desc="Lorem ipsum dolor sit amet consectetur." 
            />
            <DropdownItem 
              icon={<TbGraphFilled/>} 
              title="Enterprises" 
              desc="Lorem ipsum dolor sit amet consectetur." 
            />
          </div>
        </div>

        {/* Right Side: Industry Promo Card */}
        <div className="mega-menu-promo">
          <div className="promo-card industry-promo">
            <div className="promo-image-box">
               {/* Use the specific illustration from your reference image */}
               <img src="/offers/soffer2.jpg" alt="Industry Solutions" />
            </div>
            <h4>Save 20% on travel APIs</h4>
            <p>Get a 1-month free membership on us. Scalable APIs and white-label solutions tailored to your business.</p>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
          <span className="nav-link">
            <FaQuestionCircle /> FAQ
          </span>
        </nav>
      ) : (
        <nav className="nav-center">
          <span className="nav-link"><FaPlane /> Flights</span>
          <span className="nav-link"><FaHotel /> Hotels</span>
          <span className="nav-link"><FaBus /> Buses</span>
          <span className="nav-link"><FaThLarge /> More</span>
        </nav>
      )}

      {/* RIGHT */}
      <div className="nav-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
        </button>

        {isLoggedIn && (
          <div className="my-trips" onClick={() => navigate('/my-trips')}>
            <img src="/logo/luggage.png" alt="My Trips" className="luggage-icon" />
            <div className="my-trips-text">
              <span className="my-trips-title">My Trips</span>
              <span className="my-trips-subtitle">Manage your bookings</span>
            </div>
          </div>
        )}

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

/* UPDATED DROPDOWN ITEM TO ACCEPT DYNAMIC ICONS */
function DropdownItem({ icon, title, desc }) {
  return (
    <div className="dropdown-item">
      <div className="dropdown-icon-box">
        {icon}
      </div>
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

export default Navbar;