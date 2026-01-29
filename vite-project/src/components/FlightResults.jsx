import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaMoon,
  FaSun,
  FaThLarge,
  FaUserCircle, FaChevronLeft, FaChevronRight, FaArrowUp, FaArrowDown,
  FaLock, FaSuitcase, FaUtensils
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

  // Sorting state management - 3 states: null (no sort), 'asc', 'desc'
  const [sortStates, setSortStates] = useState({
    price: null,
    fastest: null,
    departure: null,
    smart: 'active'
  });

  const toggleSort = (sortKey) => {
    setSortStates(prev => {
      // If Smart is clicked, just toggle it to active
      if (sortKey === 'smart') {
        return {
          price: null,
          fastest: null,
          departure: null,
          smart: 'active'
        };
      }
      
      const currentState = prev[sortKey];
      let newState;
      
      if (currentState === null) {
        newState = 'asc'; // First click: ascending/primary
      } else if (currentState === 'asc') {
        newState = 'desc'; // Second click: descending/reverse
      } else {
        newState = null; // Third click: reset
      }
      
      return {
        price: null,
        fastest: null,
        departure: null,
        smart: null, // Deselect smart when any other sort is clicked
        [sortKey]: newState
      };
    });
  };

  const getSortLabel = (sortKey, state) => {
    if (state === null) {
      return {
        price: 'Low to High',
        fastest: 'Shortest First',
        departure: 'Earliest First'
      }[sortKey];
    } else if (state === 'asc') {
      return {
        price: 'High to Low',
        fastest: 'Shortest First',
        departure: 'Earliest First'
      }[sortKey];
    } else {
      return {
        price: 'Low to High',
        fastest: 'Longest First',
        departure: 'Latest First'
      }[sortKey];
    }
  };

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
  const [openFlightDetails, setOpenFlightDetails] = useState({});
  const [activeTab, setActiveTab] = useState({});

  const toggleFlightDetails = (cardId) => {
    setOpenFlightDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
    if (!activeTab[cardId]) {
      setActiveTab(prev => ({
        ...prev,
        [cardId]: 'flight-info'
      }));
    }
  };

  const handleTabChange = (cardId, tab) => {
    setActiveTab(prev => ({
      ...prev,
      [cardId]: tab
    }));
  };

  const fareOptions = ["Student", "Senior Citizen", "Armed Forces"];

  // Flight data
  const flightData = [
    {
      id: 1,
      badge: "Cheapest",
      airline: "IndiGo",
      airlineLogo: "/airlines/a4.png",
      flightCode: "6E - 677",
      departureTime: "16:05",
      departureLocation: "DEL",
      departureCity: "MUMBAI",
      departureTerminal: "Terminal: 2",
      arrivalTime: "02:50",
      arrivalLocation: "LKO",
      arrivalCity: "LUCKNOW",
      arrivalTerminal: "Terminal: 3",
      arrivalDate: "15 Oct 2025 at 01:25",
      departureDate: "14 Oct 2025 at 23:15",
      duration: "2h 10m",
      stops: "1 Stop",
      price: "₹5,796",
      lockPrice: "₹929",
      offers: "+ 150 💳",
      refundable: false,
      layout: "3-3 Layout",
      beverage: "Beverage Available"
    },
    {
      id: 2,
      airline: "Akasa Air",
      airlineLogo: "/airlines/a3.png",
      flightCode: "QP1401",
      departureTime: "18:30",
      departureLocation: "DEL",
      departureCity: "MUMBAI",
      departureTerminal: "Terminal: 2",
      arrivalTime: "21:15",
      arrivalLocation: "BOM",
      arrivalCity: "BANGALORE",
      arrivalTerminal: "Terminal: 1",
      arrivalDate: "15 Oct 2025 at 21:15",
      departureDate: "14 Oct 2025 at 18:30",
      duration: "2h 45m",
      stops: "Non Stop",
      price: "₹6,150",
      lockPrice: "₹999",
      offers: "400 Off",
      refundable: true,
      layout: "3-3 Layout",
      beverage: "Beverage Available"
    },
    {
      id: 3,
      airline: "Air India",
      airlineLogo: "/airlines/a1.png",
      flightCode: "AI803",
      departureTime: "09:00",
      departureLocation: "DEL",
      departureCity: "MUMBAI",
      departureTerminal: "Terminal: 3",
      arrivalTime: "11:30",
      arrivalLocation: "BOM",
      arrivalCity: "BANGALORE",
      arrivalTerminal: "Terminal: 2",
      arrivalDate: "15 Oct 2025 at 11:30",
      departureDate: "14 Oct 2025 at 09:00",
      duration: "2h 30m",
      stops: "Non Stop",
      price: "₹7,250",
      lockPrice: "₹1,050",
      offers: "500 Off",
      refundable: true,
      layout: "3-3 Layout",
      beverage: "Beverage Available"
    }
  ];

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
            <button 
              className={`sort-btn ${sortStates.price !== null ? 'active' : ''}`}
              onClick={() => toggleSort('price')}
            >
              Price
              <span className="sort-label">
                {getSortLabel('price', sortStates.price)}
                {sortStates.price === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                {sortStates.price === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
              </span>
            </button>
            <button 
              className={`sort-btn ${sortStates.fastest !== null ? 'active' : ''}`}
              onClick={() => toggleSort('fastest')}
            >
              Fastest
              <span className="sort-label">
                {getSortLabel('fastest', sortStates.fastest)}
                {sortStates.fastest === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                {sortStates.fastest === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
              </span>
            </button>
            <button 
              className={`sort-btn ${sortStates.departure !== null ? 'active' : ''}`}
              onClick={() => toggleSort('departure')}
            >
              Departure
              <span className="sort-label">
                {getSortLabel('departure', sortStates.departure)}
                {sortStates.departure === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                {sortStates.departure === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
              </span>
            </button>
            <button 
              className={`sort-btn ${sortStates.smart === 'active' ? 'active' : ''}`}
              onClick={() => toggleSort('smart')}
            >
              Smart
              <span className="sort-label">Recommended</span>
            </button>
          </div>
        </div>

        {/* FLIGHT CARDS */}
        <div className="flight-cards-container">
          {flightData.map((flight) => (
            <div key={flight.id} className="flight-card-wrapper">
              <div className="flight-card">
                {flight.badge && (
                  <div className="flight-card-header">
                    <span className="cheapest-badge">{flight.badge}</span>
                  </div>
                )}
                <div className="flight-card-content">
                  <div className="airline-info">
                    <img src={flight.airlineLogo} alt={flight.airline} className="airline-logo-flight" />
                    <div className="flight-numbers">
                      <span>{flight.airline}</span>
                      <span className="flight-code">{flight.flightCode}</span>
                    </div>
                  </div>
                  
                  <div className="flight-timing">
                    <div className="time-section">
                      <span className="time">{flight.departureTime}</span>
                      <span className="location">{flight.departureLocation}</span>
                    </div>
                    <div className="duration-section">
                      <span className="duration">{flight.duration}</span>
                      <div className="flight-line">
                        <div className="line"></div>
                        {flight.stops !== "Non Stop" && <span className="stops-dot">○</span>}
                      </div>
                      <span className="stops">{flight.stops}</span>
                    </div>
                    <div className="time-section">
                      <span className="time">{flight.arrivalTime}{flight.stops !== "Non Stop" && <sup>+1</sup>}</span>
                      <span className="location">{flight.arrivalLocation}</span>
                    </div>
                  </div>

                  <div className="flight-price-section">
                    <button className="book-btn">Book</button>
                    <div className="price-main">{flight.price}</div>
                    <button className="lock-price-btn">🔒 Lock Price @{flight.lockPrice}</button>
                  </div>
                </div>
                <div className="flight-card-footer">
                  <div className="price-offers">
                    <span className="offer-badge">{flight.offers}</span>
                  </div>
                  <button 
                    className="flight-details-btn"
                    onClick={() => toggleFlightDetails(flight.id)}
                  >
                    {openFlightDetails[flight.id] ? 'Hide Details' : 'Flight Details'} →
                  </button>
                </div>
              </div>

              {/* FLIGHT DETAILS DROPDOWN */}
              {openFlightDetails[flight.id] && (
                <div className="flight-details-dropdown">
                  {/* Tabs */}
                  <div className="flight-details-tabs">
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'flight-info' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'flight-info')}
                    >
                      <FaPlane style={{marginRight: '6px', fontSize: '14px'}} />
                      FLIGHT INFORMATION
                    </button>
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'fare-details' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'fare-details')}
                    >
                      <FaLock style={{marginRight: '6px', fontSize: '14px'}} />
                      FARE DETAILS
                    </button>
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'baggage-rules' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'baggage-rules')}
                    >
                      <FaSuitcase style={{marginRight: '6px', fontSize: '14px'}} />
                      BAGGAGE RULES
                    </button>
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'cancellation' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'cancellation')}
                    >
                      <FaLock style={{marginRight: '6px', fontSize: '14px'}} />
                      CANCELLATION
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flight-details-content">
                    {activeTab[flight.id] === 'flight-info' && (
                      <div className="flight-info-tab">
                        <div className="flight-info-header">
                          <div className="airline-header">
                            <img src={flight.airlineLogo} alt={flight.airline} className="dropdown-airline-logo" />
                            <div className="airline-details">
                              <span className="airline-name">{flight.airline}</span>
                              <span className="flight-number">{flight.flightCode}</span>
                            </div>
                          </div>
                          <div className="flight-route">
                            <div className="route-segment">
                              <div className="route-location">
                                <span className="route-code">{flight.departureLocation}</span>
                                <span className="route-time">{flight.departureDate}</span>
                              </div>
                              <div className="route-city">
                                <span>{flight.departureCity}</span>
                                <span className="terminal-info">{flight.departureTerminal}</span>
                              </div>
                            </div>
                            <div className="route-duration">
                              <span className="duration-text">{flight.duration}</span>
                              <div className="duration-timeline-line"></div>
                              <div className={`refundable-badge ${flight.refundable ? '' : 'non-refundable'}`}>
                                {flight.refundable ? 'Refundable' : 'Non-Refundable'}
                              </div>
                            </div>
                            <div className="route-segment">
                              <div className="route-location">
                                <span className="route-code">{flight.arrivalLocation}</span>
                                <span className="route-time">{flight.arrivalDate}</span>
                              </div>
                              <div className="route-city">
                                <span>{flight.arrivalCity}</span>
                                <span className="terminal-info">{flight.arrivalTerminal}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bottom Icons Section */}
                        <div className="flight-amenities">
                          <div className="amenity-item">
                            <FaThLarge style={{fontSize: '16px', color: '#666'}} />
                            <span>{flight.layout}</span>
                          </div>
                          <div className="amenity-item">
                            <FaUtensils style={{fontSize: '16px', color: '#666'}} />
                            <span>{flight.beverage}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab[flight.id] === 'fare-details' && (
                      <div className="fare-details-tab">
                        <p>Fare details content goes here</p>
                      </div>
                    )}

                    {activeTab[flight.id] === 'baggage-rules' && (
                      <div className="baggage-rules-tab">
                        <p>Baggage rules content goes here</p>
                      </div>
                    )}

                    {activeTab[flight.id] === 'cancellation' && (
                      <div className="cancellation-tab">
                        <p>Cancellation policy content goes here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
</main> 
    </div>
  );
}

export default FlightResults;
