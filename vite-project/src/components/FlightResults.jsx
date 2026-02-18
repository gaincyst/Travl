import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import DualDatePriceStrip from "./DualDatePriceStrip";
import SearchBox from "./SearchBox";
import AuthModal from "./AuthModal";
import FlightBookingPanel from "./FlightBookingPanel";
import RoundTripSummaryBar from "./RoundTripSummaryBar";
import "../styles/FlightResults.css";

function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};
  
  // Check if trip is round trip
  const isRoundTrip = searchData.tripType === "roundTrip";

  // ✅ FIX 1: dark mode state added
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // State for selected flights in round trip
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  // Fare Modal State
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [selectedFlightData, setSelectedFlightData] = useState(null);

  // Flight Booking Panel State
  const [isBookingPanelOpen, setIsBookingPanelOpen] = useState(false);
  const [bookingFlightData, setBookingFlightData] = useState(null);

  // Sorting state management - 3 states: null (no sort), 'asc', 'desc'
  const [sortStates, setSortStates] = useState({
    price: null,
    fastest: null,
    departure: null,
    smart: 'active'
  });

  // Separate sorting states for Round Trip
  const [outboundSortStates, setOutboundSortStates] = useState({
    price: null,
    fastest: null,
    departure: null,
    smart: 'active'
  });

  const [returnSortStates, setReturnSortStates] = useState({
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

  const toggleOutboundSort = (sortKey) => {
    setOutboundSortStates(prev => {
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

  const toggleReturnSort = (sortKey) => {
    setReturnSortStates(prev => {
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

  // Open Fare Modal
  const openFareModal = (flight) => {
    setSelectedFlightData(flight);
    setIsFareModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close Fare Modal
  const closeFareModal = () => {
    setIsFareModalOpen(false);
    setSelectedFlightData(null);
    document.body.style.overflow = 'auto';
  };

  // Open Booking Panel
  const openBookingPanel = (flight) => {
    // Add passenger counts from searchData to flight data
    const flightWithTravellers = {
      ...flight,
      adults: searchData.adults || 1, // Default to 1 if not specified
      children: searchData.children || 0,
      infants: searchData.infants || 0
    };
    setBookingFlightData(flightWithTravellers);
    setIsBookingPanelOpen(true);
    setIsFareModalOpen(false); // Close fare modal if open
    document.body.style.overflow = 'hidden';
  };

  // Close Booking Panel
  const closeBookingPanel = () => {
    setIsBookingPanelOpen(false);
    setBookingFlightData(null);
    document.body.style.overflow = 'auto';
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

  // Handlers for round trip selection
  const handleOutboundSelect = (flight) => {
    setSelectedOutbound(flight);
  };

  const handleReturnSelect = (flight) => {
    setSelectedReturn(flight);
  };

  const handleSummaryBookNow = () => {
    if (selectedOutbound && selectedReturn) {
      // Create combined flight data for booking
      const combinedFlightData = {
        ...selectedOutbound,
        returnFlight: selectedReturn.returnFlight,
        adults: searchData.adults || 1,
        children: searchData.children || 0,
        infants: searchData.infants || 0,
        isRoundTrip: true
      };
      openBookingPanel(combinedFlightData);
    }
  };

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
      departureCity: "DELHI",
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
      beverage: "Beverage Available",
      baseFare: 4950,
      taxes: 846,
      // Return flight data (for round trip)
      returnFlight: {
        airline: "IndiGo",
        airlineLogo: "/airlines/a4.png",
        flightCode: "6E - 678",
        departureTime: "06:55",
        departureLocation: "LKO",
        arrivalTime: "13:00",
        arrivalLocation: "DEL",
        duration: "06h 05m",
        stops: "1 Stop",
        price: "₹3,251"
      }
    },
    {
      id: 2,
      airline: "Akasa Air",
      airlineLogo: "/airlines/a3.png",
      flightCode: "QP1401",
      departureTime: "18:30",
      departureLocation: "DEL",
      departureCity: "DELHI",
      departureTerminal: "Terminal: 2",
      arrivalTime: "21:15",
      arrivalLocation: "LKO",
      arrivalCity: "LUCKNOW",
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
      beverage: "Beverage Available",
      baseFare: 5250,
      taxes: 900,
      // Return flight data (for round trip)
      returnFlight: {
        airline: "IndiGo",
        airlineLogo: "/airlines/a4.png",
        flightCode: "6E - 680",
        departureTime: "04:45",
        departureLocation: "LKO",
        arrivalTime: "13:00",
        arrivalLocation: "DEL",
        duration: "08h 15m",
        stops: "1 Stop",
        price: "₹4,599"
      }
    },
    {
      id: 3,
      airline: "Air India",
      airlineLogo: "/airlines/a1.png",
      flightCode: "AI803",
      departureTime: "09:00",
      departureLocation: "DEL",
      departureCity: "DELHI",
      departureTerminal: "Terminal: 3",
      arrivalTime: "11:30",
      arrivalLocation: "LKO",
      arrivalCity: "LUCKNOW",
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
      beverage: "Beverage Available",
      baseFare: 6200,
      taxes: 1050,
      // Return flight data (for round trip)
      returnFlight: {
        airline: "Air India",
        airlineLogo: "/airlines/a1.png",
        flightCode: "AI804",
        departureTime: "14:00",
        departureLocation: "LKO",
        arrivalTime: "16:30",
        arrivalLocation: "DEL",
        duration: "2h 30m",
        stops: "Non Stop",
        price: "₹7,250"
      }
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
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Menu */}
          <ul className="nav-menu">
            <li className="active">
              <FaPlane className="menu-icon" /> Flights
            </li>
            <li onClick={() => navigate("/", { state: { searchBoxType: "hotel" } })}>
              <FaHotel className="menu-icon" /> Hotels
            </li>
            <li onClick={() => navigate("/", { state: { searchBoxType: "bus" } })}>
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

            <div className="login-signup" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>
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
        {isRoundTrip ? (
          <DualDatePriceStrip 
            departureCity={searchData.fromCity || "DEL"} 
            arrivalCity={searchData.toCity || "BOM"}
            selectedDepartureDate={searchData.startDate}
            selectedReturnDate={searchData.returnDate}
          />
        ) : (
          <DatePriceStrip />
        )}
        
        {/* SORT BY BAR - Conditional for Round Trip */}
        {isRoundTrip ? (
          <div className="round-trip-sort-container">
            {/* Outbound Sort Bar */}
            <div className="sort-by-bar">
              <div className="sort-options">
                <button 
                  className={`sort-btn ${outboundSortStates.price !== null ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('price')}
                >
                  Price
                  <span className="sort-label">
                    {getSortLabel('price', outboundSortStates.price)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${outboundSortStates.fastest !== null ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('fastest')}
                >
                  Fastest
                  <span className="sort-label">
                    {getSortLabel('fastest', outboundSortStates.fastest)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${outboundSortStates.departure !== null ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('departure')}
                >
                  Departure
                  <span className="sort-label">
                    {getSortLabel('departure', outboundSortStates.departure)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${outboundSortStates.smart === 'active' ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('smart')}
                >
                  Smart ↓
                  <span className="sort-label">Recommended</span>
                </button>
              </div>
            </div>
            
            {/* Return Sort Bar */}
            <div className="sort-by-bar">
              <div className="sort-options">
                <button 
                  className={`sort-btn ${returnSortStates.price !== null ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('price')}
                >
                  Price
                  <span className="sort-label">
                    {getSortLabel('price', returnSortStates.price)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${returnSortStates.fastest !== null ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('fastest')}
                >
                  Fastest
                  <span className="sort-label">
                    {getSortLabel('fastest', returnSortStates.fastest)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${returnSortStates.departure !== null ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('departure')}
                >
                  Departure
                  <span className="sort-label">
                    {getSortLabel('departure', returnSortStates.departure)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${returnSortStates.smart === 'active' ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('smart')}
                >
                  Smart ↓
                  <span className="sort-label">Recommended</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        {/* FLIGHT CARDS */}
        <div className="flight-cards-container">
          {flightData.map((flight) => (
            <div key={flight.id} className="flight-card-wrapper">
              <div className={`flight-card ${isRoundTrip ? 'round-trip-card' : ''}`}>
                {flight.badge && (
                  <div className="flight-card-header">
                    <span className="cheapest-badge">{flight.badge}</span>
                  </div>
                )}
                
                {/* Conditional rendering based on trip type */}
                {isRoundTrip ? (
                  // ROUND TRIP LAYOUT - Two side-by-side mini cards
                  <div className="flight-card-content round-trip-content">
                    {/* Outbound Flight Card */}
                    <div className="round-trip-mini-card">
                      <div className="mini-card-header">
                        <img src={flight.airlineLogo} alt={flight.airline} className="mini-airline-logo" />
                        <span className="mini-airline-name">{flight.airline}</span>
                      </div>
                      <div className="mini-card-body">
                        <div className="mini-time-section">
                          <div className="mini-time">{flight.departureTime}</div>
                          <div className="mini-city">{flight.departureLocation}</div>
                        </div>
                        <div className="mini-duration-section">
                          <div className="mini-duration">{flight.duration}</div>
                          <div className="mini-flight-line">
                            <div className="mini-line"></div>
                          </div>
                          <div className="mini-stops">{flight.stops}</div>
                        </div>
                        <div className="mini-time-section">
                          <div className="mini-time">{flight.arrivalTime}{flight.stops !== "Non Stop" && <sup>+1</sup>}</div>
                          <div className="mini-city">{flight.arrivalLocation}</div>
                        </div>
                      </div>
                      <div className="mini-card-footer">
                        <div className="mini-price">{flight.price}</div>
                        <div className="mini-per-adult">/adult</div>
                        <input 
                          type="radio" 
                          name="outbound-flight" 
                          value={flight.id} 
                          className="mini-radio" 
                          checked={selectedOutbound?.id === flight.id}
                          onChange={() => handleOutboundSelect(flight)}
                        />
                      </div>
                    </div>
                    
                    {/* Return Flight Card */}
                    <div className="round-trip-mini-card">
                      <div className="mini-card-header">
                        <img src={flight.returnFlight.airlineLogo} alt={flight.returnFlight.airline} className="mini-airline-logo" />
                        <span className="mini-airline-name">{flight.returnFlight.airline}</span>
                      </div>
                      <div className="mini-card-body">
                        <div className="mini-time-section">
                          <div className="mini-time">{flight.returnFlight.departureTime}</div>
                          <div className="mini-city">{flight.returnFlight.departureLocation}</div>
                        </div>
                        <div className="mini-duration-section">
                          <div className="mini-duration">{flight.returnFlight.duration}</div>
                          <div className="mini-flight-line">
                            <div className="mini-line"></div>
                          </div>
                          <div className="mini-stops">{flight.returnFlight.stops}</div>
                        </div>
                        <div className="mini-time-section">
                          <div className="mini-time">{flight.returnFlight.arrivalTime}</div>
                          <div className="mini-city">{flight.returnFlight.arrivalLocation}</div>
                        </div>
                      </div>
                      <div className="mini-card-footer">
                        <div className="mini-price">{flight.returnFlight.price}</div>
                        <div className="mini-per-adult">/adult</div>
                        <input 
                          type="radio" 
                          name="return-flight" 
                          value={`${flight.id}-return`} 
                          className="mini-radio" 
                          checked={selectedReturn?.id === flight.id}
                          onChange={() => handleReturnSelect(flight)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // ONE WAY LAYOUT (existing)
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
                      <button className="book-btn" onClick={() => openFareModal(flight)}>Book</button>
                      <div className="price-main">{flight.price}</div>
                      <button className="lock-price-btn">🔒 Lock Price @{flight.lockPrice}</button>
                    </div>
                  </div>
                )}
                
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
                        <div className="fare-breakdown-card">
                          <h3 className="fare-breakdown-heading">Fare breakdown</h3>
                          
                          <div className="fare-breakdown-row">
                            <span className="fare-label">Base Fare</span>
                            <span className="fare-value">₹{flight.baseFare}</span>
                          </div>
                          
                          <div className="fare-breakdown-row">
                            <span className="fare-label">Taxes & Fees</span>
                            <span className="fare-value">₹{flight.taxes}</span>
                          </div>
                          
                          <div className="fare-divider"></div>
                          
                          <div className="fare-breakdown-row fare-total-row">
                            <span className="fare-total-label">TOTAL</span>
                            <span className="fare-total-value">₹{flight.baseFare + flight.taxes}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab[flight.id] === 'baggage-rules' && (
                      <div className="baggage-rules-tab">
                        {/* CHECK-IN Section */}
                        <div className="baggage-section">
                          <h3 className="baggage-heading">CHECK-IN</h3>
                          <div className="baggage-divider"></div>
                          <div className="baggage-columns">
                            <div className="baggage-column">
                              <div className="baggage-column-header">ADULT</div>
                              <div className="baggage-column-value">15 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">CHILD</div>
                              <div className="baggage-column-value">15 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">INFANT</div>
                              <div className="baggage-column-value">0 kgs</div>
                            </div>
                          </div>
                        </div>

                        {/* CABIN Section */}
                        <div className="baggage-section">
                          <h3 className="baggage-heading">CABIN</h3>
                          <div className="baggage-divider"></div>
                          <div className="baggage-columns">
                            <div className="baggage-column">
                              <div className="baggage-column-header">ADULT</div>
                              <div className="baggage-column-value">7 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">CHILD</div>
                              <div className="baggage-column-value">7 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">INFANT</div>
                              <div className="baggage-column-value">7 kgs (1-piece only)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab[flight.id] === 'cancellation' && (
                      <div className="cancellation-tab">
                        <div className="cancellation-empty-state">
                          <div className="cancellation-icon">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="40" cy="12" r="3" fill="#999" />
                              <circle cx="68" cy="52" r="2" fill="#999" />
                              <circle cx="55" cy="18" r="2.5" fill="#999" />
                              <circle cx="16" cy="45" r="2" fill="#999" />
                              <rect x="28" y="28" width="24" height="32" rx="2" stroke="#666" strokeWidth="1.5" fill="none" />
                              <path d="M32 34 L36 34 M32 38 L38 38 M32 42 L36 42" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
                              <text x="34" y="36" fontSize="8" fill="#666" fontWeight="600">₹</text>
                              <circle cx="40" cy="54" r="8" fill="white" stroke="#666" strokeWidth="1.5" />
                              <path d="M40 50 L40 54 M40 58 L40 58" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
                              <circle cx="40" cy="58" r="1" fill="#e74c3c" />
                            </svg>
                          </div>
                          <p className="cancellation-message">Sorry! Fare rules could not be<br />fetched at the moment.</p>
                        </div>
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

      {/* Fare Options Modal */}
      {isFareModalOpen && selectedFlightData && (
        <>
          <div className="fare-modal-overlay" onClick={closeFareModal}></div>
          <div className="fare-modal">
            <button className="fare-modal-close" onClick={closeFareModal}>✕</button>
            
            <div className="fare-modal-header">
              <h2 className="fare-modal-title">Flight Details and Fare Options available for you!</h2>
              <div className="fare-modal-flight-info">
                <img src={selectedFlightData.airlineLogo} alt={selectedFlightData.airline} className="fare-modal-airline-logo" />
                <span className="fare-modal-route">
                  {selectedFlightData.departureLocation} → {selectedFlightData.arrivalLocation}
                </span>
                <span className="fare-modal-separator">|</span>
                <span>{selectedFlightData.airline}</span>
                <span className="fare-modal-separator">|</span>
                <span>Tue, 3 Feb 26</span>
                <span className="fare-modal-separator">|</span>
                <span>Departure at {selectedFlightData.departureTime} - Arrival at {selectedFlightData.arrivalTime}</span>
              </div>
            </div>

            <div className="fare-modal-content">
              <div className="fare-cards-wrapper">
                {/* Saver Fare */}
                <div className="fare-card">
                  <div className="fare-card-price">
                    <span className="fare-price-amount">₹ 5,315</span>
                    <span className="fare-price-label">per adult</span>
                    <span className="fare-type">SAVER</span>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Baggage</div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span>7 Kgs Cabin Baggage</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span>15 Kgs Check-in Baggage</span>
                    </div>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Flexibility</div>
                    <div className="fare-item">
                      <span className="fare-cross">✖</span>
                      <span>Cancellation fee starts at ₹ 3,999 (up to 24 hours before departure)</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-cross">✖</span>
                      <span>Date Change fee starts at ₹ 2,999 up to 3 hrs before departure</span>
                    </div>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Seats, Meals & More</div>
                    <div className="fare-item">
                      <span className="fare-cross">✖</span>
                      <span>Chargeable Seats</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-cross">✖</span>
                      <span>Chargeable Meals</span>
                    </div>
                  </div>

                  <div className="fare-offer-box">
                    <span className="fare-offer-icon">🎯</span>
                    <span>FLAT ₹ 292 OFF using MMTSUPER | FLAT 10% OFF on KOTAK Credit cards using KOTAKEMI.</span>
                  </div>

                  <button className="fare-btn-book-single" onClick={() => openBookingPanel(selectedFlightData)}>BOOK NOW</button>
                </div>

                {/* Indigo Upfront */}
                <div className="fare-card">
                  <div className="fare-card-price">
                    <span className="fare-price-amount">₹ 8,465</span>
                    <span className="fare-price-label">per adult</span>
                    <span className="fare-type">INDIGO UPFRONT</span>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Baggage</div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span>7 Kgs Cabin Baggage</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span>20 Kgs Check-in Baggage</span>
                    </div>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Flexibility</div>
                    <div className="fare-item">
                      <span className="fare-minus">➖</span>
                      <span>Lower Cancellation fee of ₹ 1,199 (up to 24 hours before departure)</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-minus">➖</span>
                      <span>Lower Date Change fee ₹ 299 up to 4 hrs before departure</span>
                    </div>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Seats, Meals & More</div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span><span className="fare-highlight-text">Free</span> Seats</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span><span className="fare-highlight-text">Complimentary</span> Meals</span>
                    </div>
                  </div>

                  <div className="fare-offer-box">
                    <span className="fare-offer-icon">🪙</span>
                    <span>₹ 423 OFF using RUNWAYDEAL | 600 OFF on ICICI Credit Cards using MMTICIFEST</span>
                  </div>

                  <button className="fare-btn-book-single" onClick={() => openBookingPanel(selectedFlightData)}>BOOK NOW</button>
                </div>

                {/* Indigo Upfront - Third Card */}
                <div className="fare-card">
                  <div className="fare-card-price">
                    <span className="fare-price-amount">₹ 8,465</span>
                    <span className="fare-price-label">per adult</span>
                    <span className="fare-type">INDIGO UPFRONT</span>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Baggage</div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span>7 Kgs Cabin Baggage</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span>20 Kgs Check-in Baggage</span>
                    </div>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Flexibility</div>
                    <div className="fare-item">
                      <span className="fare-minus">➖</span>
                      <span>Lower Cancellation fee of ₹ 1,199 (up to 24 hours before departure)</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-minus">➖</span>
                      <span>Lower Date Change fee ₹ 299 up to 4 hrs before departure</span>
                    </div>
                  </div>

                  <div className="fare-card-section">
                    <div className="fare-section-title">Seats, Meals & More</div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span><span className="fare-highlight-text">Free</span> Seats</span>
                    </div>
                    <div className="fare-item">
                      <span className="fare-check">✔</span>
                      <span><span className="fare-highlight-text">Complimentary</span> Meals</span>
                    </div>
                  </div>

                  <div className="fare-offer-box">
                    <span className="fare-offer-icon">🪙</span>
                    <span>₹ 423 OFF using RUNWAYDEAL | 600 OFF on ICICI Credit Cards using MMTICIFEST</span>
                  </div>

                  <button className="fare-btn-book-single" onClick={() => openBookingPanel(selectedFlightData)}>BOOK NOW</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}

      {/* Flight Booking Panel */}
      <FlightBookingPanel 
        isOpen={isBookingPanelOpen}
        onClose={closeBookingPanel}
        flightData={bookingFlightData}
      />

      {/* Round Trip Summary Bar */}
      {isRoundTrip && selectedOutbound && selectedReturn && (
        <RoundTripSummaryBar 
          outboundFlight={selectedOutbound}
          returnFlight={selectedReturn}
          onBookNow={handleSummaryBookNow}
        />
      )}
    </div>
  );
}

export default FlightResults;
