import { useEffect, useState } from "react";
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
} from "react-icons/fa";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Theme Toggle Logic
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      {/* LOGO REPLACED WITH IMAGE */}
      <div className="logo">
        <a href="/">
          <img src="/logos.png" alt="Travel2 Logo" className="navbar-logo-img" />
        </a>
      </div>

      {/* CENTER */}
      {!scrolled ? (
        <nav className="nav-center">
          <span className="nav-link">About Us</span>

          {/* SOLUTIONS */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenMenu("solutions")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span className="nav-link">
              Solutions <FaChevronDown />
            </span>

            {openMenu === "solutions" && (
              <div className="dropdown-panel">
                <DropdownItem title="Flight Booking" desc="Domestic & International" />
                <DropdownItem title="Hotel Solutions" desc="Smart stays & pricing" />
                <DropdownItem title="Bus Services" desc="Pan-India connectivity" />
                <DropdownItem title="Corporate Travel" desc="Business travel tools" />
                <DropdownItem title="API Integration" desc="Travel APIs for partners" />
                <DropdownItem title="Analytics" desc="Travel insights & reports" />
              </div>
            )}
          </div>

          {/* INDUSTRIES */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenMenu("industries")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span className="nav-link">
              Industries <FaChevronDown />
            </span>

            {openMenu === "industries" && (
              <div className="dropdown-panel">
                <DropdownItem title="Travel & Tourism" desc="End-to-end solutions" />
                <DropdownItem title="Hospitality" desc="Hotels & resorts" />
                <DropdownItem title="Corporate" desc="Enterprise travel" />
                <DropdownItem title="Startups" desc="Scalable platforms" />
                <DropdownItem title="Education" desc="Student travel programs" />
                <DropdownItem title="Government" desc="Official travel systems" />
              </div>
            )}
          </div>

          <span className="nav-link">
            <FaQuestionCircle /> FAQ
          </span>
        </nav>
      ) : (
        /* SCROLLED NAV */
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

        <div className="login-group">
          <FaUserCircle className="login-icon" />
          <span>Login / Signup</span>
        </div>
      </div>
    </header>
  );
}

/* DROPDOWN ITEM */
function DropdownItem({ title, desc }) {
  return (
    <div className="dropdown-item">
      <FaBuilding className="dropdown-icon" />
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

export default Navbar;