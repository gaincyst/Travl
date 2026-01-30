import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaMoon,
  FaSun,
  FaThLarge,
  FaUserCircle, FaChevronLeft, FaChevronRight, FaArrowUp, FaArrowDown, FaStar
} from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";
import { PiDeviceMobileSpeaker } from "react-icons/pi";

import SearchBox from "./SearchBox";
import BusFiltersPanel from "./BusFiltersPanel";
import DatePriceStrip from "./DatePriceStrip";
import "../styles/BusResults.css";

function BusResults() {
  const location = useLocation();
  const searchData = location.state || {};

  const [darkMode, setDarkMode] = useState(false);

  // Dropdown state for each bus card
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [selectedSeats, setSelectedSeats] = useState({});
  const [showSeatLegend, setShowSeatLegend] = useState({});
  const [activePointsTab, setActivePointsTab] = useState({});
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState({});
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState({});

  // Sorting state management - 3 states: null (no sort), 'asc', 'desc'
  // Smart is 'active' by default
  const [sortStates, setSortStates] = useState({
    ratings: null,
    price: null,
    fastest: null,
    departure: null,
    arrival: null,
    smart: 'active'
  });

  const toggleSort = (sortKey) => {
    setSortStates(prev => {
      // If Smart is clicked, just toggle it to active
      if (sortKey === 'smart') {
        return {
          ratings: null,
          price: null,
          fastest: null,
          departure: null,
          arrival: null,
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
        ratings: null,
        price: null,
        fastest: null,
        departure: null,
        arrival: null,
        smart: null, // Deselect smart when any other sort is clicked
        [sortKey]: newState
      };
    });
  };

  const getSortLabel = (sortKey, state) => {
    if (state === null) {
      return {
        ratings: 'Top Most',
        price: 'High to Low',
        fastest: 'Shortest First',
        departure: 'Earliest First',
        arrival: 'Earliest First'
      }[sortKey];
    } else if (state === 'asc') {
      return {
        ratings: 'Top Most',
        price: 'High to Low',
        fastest: 'Shortest First',
        departure: 'Earliest First',
        arrival: 'Earliest First'
      }[sortKey];
    } else {
      return {
        ratings: 'Lowest First',
        price: 'Low to High',
        fastest: 'Longest First',
        departure: 'Latest First',
        arrival: 'Latest First'
      }[sortKey];
    }
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-theme");
  };

  const toggleDropdown = (busId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [busId]: !prev[busId]
    }));
    if (!activePointsTab[busId]) {
      setActivePointsTab(prev => ({ ...prev, [busId]: 'boarding' }));
    }
  };

  const toggleSeatSelection = (busId, seatId, isBooked) => {
    if (isBooked) return;
    setSelectedSeats(prev => {
      const busSeats = prev[busId] || [];
      const isSelected = busSeats.includes(seatId);
      return {
        ...prev,
        [busId]: isSelected 
          ? busSeats.filter(s => s !== seatId)
          : [...busSeats, seatId]
      };
    });
  };

  const toggleSeatLegend = (busId) => {
    setShowSeatLegend(prev => ({
      ...prev,
      [busId]: !prev[busId]
    }));
  };

  const isSeatSelected = (busId, seatId) => {
    return (selectedSeats[busId] || []).includes(seatId);
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
      const scrollAmount = 350;
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

  // Bus-specific offers (separate from flight offers)
  const busOffers = [
    { id: 1, logo: "/banks/b1.png", title: "Up to 8,000 Off", sub: "with ICICI Bank Credit Card EMI", bgColor: "#fff3e6" },
    { id: 2, logo: "/banks/b2.png", title: "Up to 10% Off", sub: "with RBL Bank Credit Card EMI", bgColor: "#f0f2ff" },
    { id: 3, logo: "/banks/b3.png", title: "Get Flat 8% Off", sub: "with AU Bank Credit Card", bgColor: "#ffefd5" },
    { id: 4, logo: "/banks/b4.png", title: "Flat 12% Off", sub: "with Kotak Retail Credit Card EMI", bgColor: "#fff9e6" }
  ];

  return (
    <div className="bus-results-page">
      {/* NAVBAR */}
      <nav className="minimal-navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="logo-container">
            <img
              src="/logos.png"
              alt="Travl Logo"
              className="nav-logo"
            />
          </div>

          {/* Menu */}
          <ul className="nav-menu">
            <li>
              <FaPlane className="menu-icon" /> Flights
            </li>
            <li>
              <FaHotel className="menu-icon" /> Hotels
            </li>
            <li className="active">
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
          <h1>Bus</h1>
          <nav className="breadcrumb">
            <span>Home</span> &gt; <span>Bus</span> &gt;{" "}
            <span className="current">Bus Grid</span>
          </nav>
        </div>
      </header>

      {/* SEARCH BOX */}
      <section className="search-section-container">
        <SearchBox 
          preFilledData={searchData} 
          hideServiceTabs={true}
          activeService="bus"
        />
      </section>

     {/* OFFERS SECTION */}
      <section className="offers-carousel-container">
        {showLeftArrow && (
          <button className="carousel-arrow left" onClick={() => scroll("left")}>
            <FaChevronLeft />
          </button>
        )}
        
        <div className="offers-scroll-wrapper" ref={scrollRef} onScroll={checkArrows}>
          {busOffers.map((offer) => (
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

      {/* Main Content with Filters */}
      <main className="results-main-content">
        <div className="container">
          <div className="results-layout">
            {/* LEFT SIDEBAR */}
            <aside className="sidebar-filters">
              <BusFiltersPanel />
            </aside>

            {/* RIGHT SIDE CONTENT */}
            <section className="buses-list-section">
              {/* DATE STRIP (NO PRICES) */}
              <DatePriceStrip showPrice={false} />
              
              {/* SORT BY BAR */}
              <div className="sort-by-bar">
                <span className="results-count">120 Buses Available</span>
                <div className="sort-options">
                  <button 
                    className={`sort-btn ${sortStates.ratings !== null ? 'active' : ''}`}
                    onClick={() => toggleSort('ratings')}
                  >
                    Ratings
                    <span className="sort-label">
                      {getSortLabel('ratings', sortStates.ratings)}
                      {sortStates.ratings === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                      {sortStates.ratings === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                    </span>
                  </button>
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
                    className={`sort-btn ${sortStates.arrival !== null ? 'active' : ''}`}
                    onClick={() => toggleSort('arrival')}
                  >
                    Arrival
                    <span className="sort-label">
                      {getSortLabel('arrival', sortStates.arrival)}
                      {sortStates.arrival === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                      {sortStates.arrival === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
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
              
              {/* BUS TICKET CARDS */}
              <div className="bus-cards-container">
                
                {/* Bus Card 1 */}
                <div className="bus-ticket-card">
                  <div className="bus-ticket-content">
                    <div className="bus-operator-info">
                      <div className="bus-name-section">
                        <span className="bus-name">Yolo Bus</span>
                        <span className="bus-type">Bharat Benz A/C Seater / Sleeper...</span>
                      </div>
                    </div>
                    
                    <div className="bus-timing">
                      <div className="bus-time-section">
                        <span className="bus-time">19:30</span>
                        <span className="bus-date">26 JAN</span>
                      </div>
                      <div className="bus-duration-section">
                        <span className="bus-duration">08h 49m</span>
                        <div className="bus-line">
                          <div className="line"></div>
                        </div>
                      </div>
                      <div className="bus-time-section">
                        <span className="bus-time">04:19</span>
                        <span className="bus-date">27 JAN<sup>+1 day</sup></span>
                      </div>
                    </div>

                    <div className="bus-price-section">
                      <div className="bus-seat-info">
                        <span>20 Seats Left | 7 Single Seats</span>
                      </div>
                      <div className="bus-price-main">₹279</div>
                      
                      <button className="bus-details-link">Bus Details →</button>
                    </div>
                  </div>
                  <div className="bus-ticket-footer">
                    
                    <div className="bus-rating-badge">
                      
                      <FaStar className="star-icon" /> 4.4
                      
                    </div>
                    <span className="review-count">13 Reviews</span>
                    <button className="bus-select-seat-btn" onClick={() => toggleDropdown('bus1')}>SELECT SEATS</button>
                  </div>

                  {/* Bus Details Dropdown */}
                  {openDropdowns['bus1'] && (
                    <div className="bus-details-dropdown">
                      <div className="bus-details-tabs">
                        <button className="bus-tab active">Select Seats</button>
                        <button className="bus-tab seat-legend-container">
                          Know your seats
                          <div className="seat-legend-hover-dropdown">
                            <div className="legend-section">
                              <span className="legend-title">Seater / Sleeper info</span>
                              <div className="legend-row">
                                <div className="legend-item">
                                  <span className="legend-box unisex"></span>
                                  <span>Unisex</span>
                                </div>
                                <div className="legend-item">
                                  <span className="legend-box male"></span>
                                  <span>Male</span>
                                </div>
                                <div className="legend-item">
                                  <span className="legend-box female"></span>
                                  <span>Female</span>
                                </div>
                              </div>
                            </div>
                            <div className="legend-section">
                              <div className="legend-row">
                                <div className="legend-item">
                                  <span className="legend-box available"></span>
                                  <span>Available</span>
                                </div>
                                <div className="legend-item">
                                  <span className="legend-box selected-legend"></span>
                                  <span>Selected</span>
                                </div>
                                <div className="legend-item">
                                  <span className="legend-box booked"></span>
                                  <span>Booked</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                        <button className="bus-tab" onClick={() => setActivePointsTab(prev => ({ ...prev, 'bus1': 'boarding' }))}>Select Pickup & Drop Points</button>
                      </div>

                      <div className="bus-details-content">
                        {/* Seat Selection Section */}
                        <div className="seat-selection-wrapper">

                          <div className="seats-layout">
                            {/* Lower Berth Section */}
                            <div className="berth-section">
                              <div className="berth-header">LOWER BERTH(22)</div>
                              <div className="seats-grid">
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L1') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L1', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹651</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L2') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L2', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L3') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L3', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L4') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L4', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L5') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L5', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L6') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L6', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L7') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L7', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L8') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L8', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L9') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L9', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹581</span></div>
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹490</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹571</span></div>
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹582</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L10') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L10', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹581</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L11') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L11', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹581</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L12') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L12', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹560</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L13') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L13', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹560</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L14') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L14', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹560</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'L15') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'L15', false)}><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹560</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹348</span></div>
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹604</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹1136</span></div>
                                  <div className="seat-item booked"><img src="/seat1.png" alt="seat" className="seat-icon" /><span>₹490</span></div>
                                </div>
                              </div>
                            </div>

                            {/* Upper Berth Section */}
                            <div className="berth-section">
                              <div className="berth-header">UPPER BERTH(7)</div>
                              <div className="seats-grid">
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1155</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'U1') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'U1', false)}><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1136</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'U2') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'U2', false)}><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1136</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹857</span></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹989</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1256</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1052</span></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1052</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1036</span></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹513</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1190</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1036</span></div>
                                  <div className="seat-item-spacer"></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'U3') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'U3', false)}><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹976</span></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹813</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹620</span></div>
                                </div>
                                <div className="seat-row">
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹1136</span></div>
                                  <div className="seat-item-spacer"></div>
                                  <div className="seat-item booked"><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹490</span></div>
                                  <div className={`seat-item ${isSeatSelected('bus1', 'U4') ? 'selected' : 'available'}`} onClick={() => toggleSeatSelection('bus1', 'U4', false)}><img src="/seat2.png" alt="sleeper" className="sleeper-icon" /><span>₹976</span></div>
                                </div>
                              </div>
                            </div>

                            {/* Boarding and Dropping Points */}
                            <div className="points-section">
                              <div className="points-tabs">
                                <button 
                                  className={`points-tab ${(!activePointsTab['bus1'] || activePointsTab['bus1'] === 'boarding') ? 'active' : ''}`}
                                  onClick={() => setActivePointsTab(prev => ({ ...prev, 'bus1': 'boarding' }))}
                                >
                                  ✓ Boarding Points
                                </button>
                                <button 
                                  className={`points-tab ${activePointsTab['bus1'] === 'dropping' ? 'active' : ''}`}
                                  onClick={() => setActivePointsTab(prev => ({ ...prev, 'bus1': 'dropping' }))}
                                >
                                  ✓ Dropping Points
                                </button>
                              </div>

                              <div className="points-content">
                                {(!activePointsTab['bus1'] || activePointsTab['bus1'] === 'boarding') ? (
                                  <div className="points-list">
                                    <div className="point-header">BOARDING POINTS</div>
                                    <div 
                                      className={`point-item ${selectedBoardingPoint['bus1'] === 'bp1' ? 'selected' : ''}`}
                                      onClick={() => setSelectedBoardingPoint(prev => ({ ...prev, 'bus1': prev['bus1'] === 'bp1' ? null : 'bp1' }))}
                                    >
                                      <input type="radio" checked={selectedBoardingPoint['bus1'] === 'bp1'} readOnly />
                                      <div className="point-details">
                                        <div className="point-name">22:10, 31 JAN</div>
                                        <div className="point-location">Dhaula Kuan</div>
                                        <div className="point-address">Dhaula Kaun Bus Stop (Infront of DSOI office) 8287009889</div>
                                      </div>
                                      <div className="point-time"></div>
                                    </div>
                                    <div 
                                      className={`point-item ${selectedBoardingPoint['bus1'] === 'bp2' ? 'selected' : ''}`}
                                      onClick={() => setSelectedBoardingPoint(prev => ({ ...prev, 'bus1': prev['bus1'] === 'bp2' ? null : 'bp2' }))}
                                    >
                                      <input type="radio" checked={selectedBoardingPoint['bus1'] === 'bp2'} readOnly />
                                      <div className="point-details">
                                        <div className="point-name">22:30, 31 JAN</div>
                                        <div className="point-location">Jhandewalan</div>
                                        <div className="point-address">Jhandewalan Metro Station 8287009889</div>
                                      </div>
                                      <div className="point-time"></div>
                                    </div>
                                    <div 
                                      className={`point-item ${selectedBoardingPoint['bus1'] === 'bp3' ? 'selected' : ''}`}
                                      onClick={() => setSelectedBoardingPoint(prev => ({ ...prev, 'bus1': prev['bus1'] === 'bp3' ? null : 'bp3' }))}
                                    >
                                      <input type="radio" checked={selectedBoardingPoint['bus1'] === 'bp3'} readOnly />
                                      <div className="point-details">
                                        <div className="point-name">22:50, 31 JAN</div>
                                        <div className="point-location">ISBT Kashmiri Gate</div>
                                        <div className="point-address">Inside ISBT Kashmere Gate, Zingbus Booking Counter No. 28, Exit from Gate 7 & 8 Metro ( Not on Government Platform) 8287009889</div>
                                      </div>
                                      <div className="point-time"></div>
                                    </div>
                                    <div 
                                      className={`point-item ${selectedBoardingPoint['bus1'] === 'bp4' ? 'selected' : ''}`}
                                      onClick={() => setSelectedBoardingPoint(prev => ({ ...prev, 'bus1': prev['bus1'] === 'bp4' ? null : 'bp4' }))}
                                    >
                                      <input type="radio" checked={selectedBoardingPoint['bus1'] === 'bp4'} readOnly />
                                      <div className="point-details">
                                        <div className="point-name">23:30, 31 JAN</div>
                                        <div className="point-location">Anand Vihar</div>
                                        <div className="point-address">Counter number 54, Anand Vihar ISBT 8287009889</div>
                                      </div>
                                      <div className="point-time"></div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="points-list">
                                    <div className="point-header">DROP POINTS</div>
                                    <div 
                                      className={`point-item ${selectedDroppingPoint['bus1'] === 'dp1' ? 'selected' : ''}`}
                                      onClick={() => setSelectedDroppingPoint(prev => ({ ...prev, 'bus1': prev['bus1'] === 'dp1' ? null : 'dp1' }))}
                                    >
                                      <input type="radio" checked={selectedDroppingPoint['bus1'] === 'dp1'} readOnly />
                                      <div className="point-details">
                                        <div className="point-name">08:15, 01 FEB</div>
                                        <div className="point-location">Faizalganj</div>
                                        <div className="point-address">Opposite President Hotel, Fazalganj Chauraha, Kanpur 8287009889</div>
                                      </div>
                                      <div className="point-time"></div>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="selected-seats-summary">
                                  <div className="summary-label">Selected Seats</div>
                                  <div className="summary-value">
                                    {(selectedSeats['bus1'] || []).length > 0 
                                      ? (selectedSeats['bus1'] || []).join(', ')
                                      : 'No Seats selected yet'}
                                  </div>
                                </div>

                                <button className="continue-btn">CONTINUE</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bus Card 2 */}
               <div className="bus-ticket-card">
                  <div className="bus-ticket-content">
                    <div className="bus-operator-info">
                      <div className="bus-name-section">
                        <span className="bus-name">Sharma Travels</span>
                        <span className="bus-type">Volvo Multi-Axle A/C Sleeper(2+1)</span>
                      </div>
                    </div>
                    
                    <div className="bus-timing">
                      <div className="bus-time-section">
                        <span className="bus-time">22:00</span>
                        <span className="bus-date">26 JAN</span>
                      </div>
                      <div className="bus-duration-section">
                        <span className="bus-duration">09h 30m</span>
                        <div className="bus-line">
                          <div className="line"></div>
                        </div>
                      </div>
                      <div className="bus-time-section">
                        <span className="bus-time">07:30</span>
                        <span className="bus-date">27 JAN<sup>+1 day</sup></span>
                      </div>
                    </div>

                    <div className="bus-price-section">
                      <div className="bus-seat-info">
                        <span>15 Seats Left | 3 Single Seats</span>
                      </div>
                      <div className="bus-price-main">₹450</div>
                      
                      <button className="bus-details-link">Bus Details →</button>
                    </div>
                  </div>
                  <div className="bus-ticket-footer">
                    
                    <div className="bus-rating-badge">
                      
                      <FaStar className="star-icon" /> 4.2
                      
                    </div>
                    <span className="review-count">18 Reviews</span>
                    <button className="bus-select-seat-btn" onClick={() => toggleDropdown('bus2')}>SELECT SEATS</button>
                  </div>
                </div>

                {/* Bus Card 3 */}
                <div className="bus-ticket-card">
                  <div className="bus-ticket-content">
                    <div className="bus-operator-info">
                      <div className="bus-name-section">
                        <span className="bus-name">Red Bus Express</span>
                        <span className="bus-type">Scania Multi-Axle A/C Sleeper(2+1)</span>
                      </div>
                    </div>
                    
                    <div className="bus-timing">
                      <div className="bus-time-section">
                        <span className="bus-time">18:45</span>
                        <span className="bus-date">26 JAN</span>
                      </div>
                      <div className="bus-duration-section">
                        <span className="bus-duration">07h 15</span>
                        <div className="bus-line">
                          <div className="line"></div>
                        </div>
                      </div>
                      <div className="bus-time-section">
                        <span className="bus-time">02:00</span>
                        <span className="bus-date">27 JAN<sup>+1 day</sup></span>
                      </div>
                    </div>

                    <div className="bus-price-section">
                      <div className="bus-seat-info">
                        <span>12 Seats Left | 2 Single Seats</span>
                      </div>
                      <div className="bus-price-main">₹550</div>
                      
                      <button className="bus-details-link">Bus Details →</button>
                    </div>
                  </div>
                  <div className="bus-ticket-footer">
                    
                    <div className="bus-rating-badge">
                      
                      <FaStar className="star-icon" /> 4.1
                      
                    </div>
                    <span className="review-count">24 Reviews</span>
                    <button className="bus-select-seat-btn" onClick={() => toggleDropdown('bus3')}>SELECT SEATS</button>
                  </div>
                </div>

                {/* Bus Card 4 */}
                <div className="bus-ticket-card">
                  <div className="bus-ticket-content">
                    <div className="bus-operator-info">
                      <div className="bus-name-section">
                        <span className="bus-name">Orange Travels</span>
                        <span className="bus-type">Mercedes Benz A/C Seater(2+1)</span>
                      </div>
                    </div>
                    
                    <div className="bus-timing">
                      <div className="bus-time-section">
                        <span className="bus-time">20:15</span>
                        <span className="bus-date">26 JAN</span>
                      </div>
                      <div className="bus-duration-section">
                        <span className="bus-duration">08h 00m</span>
                        <div className="bus-line">
                          <div className="line"></div>
                        </div>
                      </div>
                      <div className="bus-time-section">
                        <span className="bus-time">04:15</span>
                        <span className="bus-date">27 JAN<sup>+1 day</sup></span>
                      </div>
                    </div>

                    <div className="bus-price-section">
                      <div className="bus-seat-info">
                        <span>25 Seats Left | 10 Single Seats</span>
                      </div>
                      <div className="bus-price-main">₹380</div>
                      
                      <button className="bus-details-link">Bus Details →</button>
                    </div>
                  </div>
                  <div className="bus-ticket-footer">
                    
                    <div className="bus-rating-badge">
                      
                      <FaStar className="star-icon" /> 4.0
                      
                    </div>
                    <span className="review-count">10 Reviews</span>
                    <button className="bus-select-seat-btn" onClick={() => toggleDropdown('bus4')}>SELECT SEATS</button>
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

export default BusResults;
