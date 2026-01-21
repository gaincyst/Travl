import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaMoon,
  FaSun,
  FaThLarge,
  FaUserCircle, FaChevronLeft, FaChevronRight
} from "react-icons/fa";

import FiltersPanel from "./FiltersPanel";
import DatePriceStrip from "./DatePriceStrip";
import SearchBox from "./SearchBox";
import "../styles/FlightResults.css";

function FlightResults() {
  const location = useLocation();
  const searchData = location.state || {};

  // ✅ FIX 1: dark mode state added
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-theme");
  };
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Width of one card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, []);

  const offers = [
    { id: 1, logo: "/banks/b1.png", title: "Up to 10,000 Off", sub: "with ICICI Bank Credit Card EMI", bgColor: "#fff3e6" },
    { id: 2, logo: "/banks/b2.png", title: "Up to 12% Off", sub: "with RBL Bank Credit Card EMI", bgColor: "#f0f2ff" },
    { id: 3, logo: "/banks/b3.png", title: "Get Flat 10% Off", sub: "with AU Bank Credit Card", bgColor: "#ffefd5" },
    { id: 4, logo: "/banks/b4.png", title: "Flat 10% Off", sub: "with Kotak Retail Credit Card EMI", bgColor: "#fff9e6" }
  ];

  const [selectedFare, setSelectedFare] = useState(null);

  const fareOptions = ["Student", "Senior Citizen", "Armed Forces"];

  return (
    <div className="flight-results-page">
      {/* NAVBAR */}
      <nav className="minimal-navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="logo-container">
            <img
              src="/logos.png"   /* ✅ public folder image */
              alt="Travl Logo"
              className="nav-logo"
            />
          </div>

          {/* Menu */}
          <ul className="nav-menu">
            <li className="active">
              <FaPlane className="menu-icon" /> Flights
            </li>
            <li>
              <FaHotel className="menu-icon" /> Hotels
            </li>
            <li>
              <FaBus className="menu-icon" /> Buses
            </li>
            <li>
              <FaThLarge className="menu-icon" /> More
            </li>
          </ul>

          {/* Right section */}
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
            </button>

            <div className="login-signup">
              <FaUserCircle className="user-login-icon" />
              <span>Login / Signup</span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="results-hero">
        <div className="hero-content">
          <h1>Flight</h1>
          <nav className="breadcrumb">
            <span>Home</span> &gt; <span>Flight</span> &gt;{" "}
            <span className="current">Flight Grid</span>
          </nav>
        </div>
      </header>

      {/* SEARCH BOX */}
      <section className="search-section-container">
        <SearchBox preFilledData={searchData} 
        hideServiceTabs={true}
        />
      </section>

     {/* 4. OFFERS SECTION */}
      <section className="offers-carousel-container">
        {showLeftArrow && (
          <button className="carousel-arrow left" onClick={() => scroll("left")}>
            <FaChevronLeft />
          </button>
        )}
        
        <div className="offers-scroll-wrapper" ref={scrollRef} onScroll={checkArrows}>
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card" style={{ backgroundColor: offer.bgColor }}>
              <div className="offer-logo-circle">
                <img src={offer.logo} alt="Bank Logo" />
              </div>
              <div className="offer-details">
                <span className="offer-title">{offer.title}</span>
                <span className="offer-subtitle">{offer.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button className="carousel-arrow right" onClick={() => scroll("right")}>
            <FaChevronRight />
          </button>
        )}
      </section>
      {/* 5. SPECIAL FARES SECTION */}
      <section className="special-fares-container">
  <div className="special-fares-content">
    <span className="special-fares-label">Special Fares (Optional) :</span>
    <div className="fare-pills-wrapper">
      {fareOptions.map((fare) => (
        <div 
          key={fare}
          className={`fare-pill ${selectedFare === fare ? 'active' : ''}`}
          onClick={() => setSelectedFare(fare)}
        >
          {fare}
          {selectedFare === fare && (
            <span 
              className="fare-close-icon" 
              onClick={(e) => {
                e.stopPropagation(); // Prevents re-selecting on click
                setSelectedFare(null);
              }}
            >
              ×
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
</section>

     {/* Add this after the Special Fares Section */}
<main className="results-main-content">
  <div className="container">
    <div className="results-layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar-filters">
        <FiltersPanel />
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <section className="flights-list-section">
        {/* DATE-PRICE STRIP SECTION */}
        <DatePriceStrip />
        
        {/* SORT BY BAR */}
        <div className="sort-by-bar">
          <span className="results-count">186 Flights Available</span>
          <div className="sort-options">
            <button className="sort-btn">
              Price <span className="sort-label">Low to High</span>
            </button>
            <button className="sort-btn">
              Fastest <span className="sort-label">Shortest First</span>
            </button>
            <button className="sort-btn">
              Departure <span className="sort-label">Earliest First</span>
            </button>
            <button className="sort-btn active">
              Smart <span className="sort-label">Recommended</span>
            </button>
          </div>
        </div>

        {/* FLIGHT CARDS */}
        <div className="flight-cards-container">
          {/* Sample Flight Card 1 */}
          <div className="flight-card">
            <div className="flight-card-header">
              <span className="cheapest-badge">Cheapest</span>
            </div>
            <div className="flight-card-content">
              <div className="airline-info">
                <img src="/airlines/a4.png" alt="IndiGo" className="airline-logo-flight" />
                <div className="flight-numbers">
                  <span>IndiGo</span>
                  <span className="flight-code">6E6696, 6E2739</span>
                </div>
              </div>
              
              <div className="flight-timing">
                <div className="time-section">
                  <span className="time">16:05</span>
                  <span className="location">DEL</span>
                </div>
                <div className="duration-section">
                  <span className="duration">10h 45m</span>
                  <div className="flight-line">
                    <div className="line"></div>
                    <span className="stops-dot">○</span>
                  </div>
                  <span className="stops">1 Stop</span>
                </div>
                <div className="time-section">
                  <span className="time">02:50<sup>+1</sup></span>
                  <span className="location">BOM</span>
                </div>
              </div>

              <div className="flight-price-section">
                <div className="price-main">₹5,796</div>
                <div className="price-offers">
                  <span className="offer-badge">350 Off</span>
                  <span className="offer-badge">+ 150 💳</span>
                </div>
                <button className="book-btn">Book</button>
                <button className="lock-price-btn">🔒 Lock Price @₹929</button>
              </div>
            </div>
            <div className="flight-card-footer">
              <button className="flight-details-btn">Flight Details →</button>
            </div>
          </div>

          {/* Sample Flight Card 2 */}
          <div className="flight-card">
            <div className="flight-card-content">
              <div className="airline-info">
                <img src="/airlines/a3.png" alt="Akasa Air" className="airline-logo-flight" />
                <div className="flight-numbers">
                  <span>Akasa Air</span>
                  <span className="flight-code">QP1401</span>
                </div>
              </div>
              
              <div className="flight-timing">
                <div className="time-section">
                  <span className="time">18:30</span>
                  <span className="location">DEL</span>
                </div>
                <div className="duration-section">
                  <span className="duration">2h 45m</span>
                  <div className="flight-line">
                    <div className="line"></div>
                  </div>
                  <span className="stops">Non Stop</span>
                </div>
                <div className="time-section">
                  <span className="time">21:15</span>
                  <span className="location">BOM</span>
                </div>
              </div>

              <div className="flight-price-section">
                <div className="price-main">₹6,150</div>
                <div className="price-offers">
                  <span className="offer-badge">400 Off</span>
                </div>
                <button className="book-btn">Book</button>
                <button className="lock-price-btn">🔒 Lock Price @₹999</button>
              </div>
            </div>
            <div className="flight-card-footer">
              <button className="flight-details-btn">Flight Details →</button>
            </div>
          </div>

          {/* Sample Flight Card 3 */}
          <div className="flight-card">
            <div className="flight-card-content">
              <div className="airline-info">
                <img src="/airlines/a1.png" alt="Air India" className="airline-logo-flight" />
                <div className="flight-numbers">
                  <span>Air India</span>
                  <span className="flight-code">AI803</span>
                </div>
              </div>
              
              <div className="flight-timing">
                <div className="time-section">
                  <span className="time">09:00</span>
                  <span className="location">DEL</span>
                </div>
                <div className="duration-section">
                  <span className="duration">2h 30m</span>
                  <div className="flight-line">
                    <div className="line"></div>
                  </div>
                  <span className="stops">Non Stop</span>
                </div>
                <div className="time-section">
                  <span className="time">11:30</span>
                  <span className="location">BOM</span>
                </div>
              </div>

              <div className="flight-price-section">
                <div className="price-main">₹7,250</div>
                <div className="price-offers">
                  <span className="offer-badge">500 Off</span>
                </div>
                <button className="book-btn">Book</button>
                <button className="lock-price-btn">🔒 Lock Price @₹1,050</button>
              </div>
            </div>
            <div className="flight-card-footer">
              <button className="flight-details-btn">Flight Details →</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</main> 
    </div>
  );
}

export default FlightResults;
