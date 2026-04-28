import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaMoon,
  FaSun,
  FaThLarge,
  FaUserCircle, FaChevronLeft, FaChevronRight, FaArrowUp, FaArrowDown, FaStar,
  FaTint, FaBolt, FaLightbulb, FaVideo, FaBed
} from "react-icons/fa";
import { FaSignOutAlt, FaUser, FaTachometerAlt } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";
import { PiDeviceMobileSpeaker } from "react-icons/pi";

import SearchBox from "./SearchBox";
import BusFiltersPanel from "./BusFiltersPanel";
import DatePriceStrip from "./DatePriceStrip";
import AuthModal from "./AuthModal";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import "../styles/BusResults.css";

function BusResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};

  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const { isLoggedIn, currentUser, refreshAuth, logoutUser } = useAuth();

  // Dropdown state for each bus card
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [selectedSeats, setSelectedSeats] = useState({});
  const [showSeatLegend, setShowSeatLegend] = useState({});
  const [activePointsTab, setActivePointsTab] = useState({});
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState({});
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState({});
  
  // Bus Details dropdown state (separate from seat selection)
  const [openBusDetails, setOpenBusDetails] = useState({});
  const [activeBusTab, setActiveBusTab] = useState({});

  // Passenger Details Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentBookingBus, setCurrentBookingBus] = useState(null);
  const [travellerGenders, setTravellerGenders] = useState({});
  const [panelView, setPanelView] = useState('passenger-details'); // 'passenger-details' or 'review-booking'
  
  // Passenger Form Data State
  const [passengerFormData, setPassengerFormData] = useState({});
  const [contactDetails, setContactDetails] = useState({
    email: '',
    mobile: '',
    state: 'Uttar Pradesh'
  });
  
  // Offers and Pricing State
  const [appliedOffer, setAppliedOffer] = useState(null);
  const baseFare = 899;
  const discountAmount = appliedOffer ? appliedOffer.discount : 0;
  const finalAmount = baseFare - discountAmount;
  
  // Confirmation and success modal states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const toggleBusDetails = (busId) => {
    setOpenBusDetails(prev => ({
      ...prev,
      [busId]: !prev[busId]
    }));
    if (!activeBusTab[busId]) {
      setActiveBusTab(prev => ({
        ...prev,
        [busId]: 'photos'
      }));
    }
  };

  const handleBusTabChange = (busId, tab) => {
    setActiveBusTab(prev => ({
      ...prev,
      [busId]: tab
    }));
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

  // Validation logic for Continue button
  const isContinueEnabled = (busId) => {
    const hasSeats = (selectedSeats[busId] || []).length > 0;
    const hasBoardingPoint = !!selectedBoardingPoint[busId];
    const hasDroppingPoint = !!selectedDroppingPoint[busId];
    return hasSeats && hasBoardingPoint && hasDroppingPoint;
  };

  // Handle Continue button click to open panel
  const handleContinue = (busId, busData) => {
    setCurrentBookingBus({ id: busId, ...busData });
    setIsPanelOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  // Close panel
  const closePanel = () => {
    setIsPanelOpen(false);
    setCurrentBookingBus(null);
    setTravellerGenders({});
    setPanelView('passenger-details');
    setPassengerFormData({});
    setContactDetails({ email: '', mobile: '', state: 'Uttar Pradesh' });
    document.body.style.overflow = 'auto'; // Restore scroll
  };

  // Handle gender selection
  const handleGenderSelect = (seatId, gender) => {
    setTravellerGenders(prev => ({
      ...prev,
      [seatId]: gender
    }));
  };

  // Handle offer apply
  const handleApplyOffer = (offer) => {
    setAppliedOffer(offer);
  };

  // Handle offer remove
  const handleRemoveOffer = () => {
    setAppliedOffer(null);
  };
  
  // Handle Continue button in passenger details panel
  const handlePanelContinue = () => {
    if (panelView === 'passenger-details') {
      // Capture form data from uncontrolled inputs before moving to review
      const seats = selectedSeats[currentBookingBus?.id] || [];
      const passengerData = {};
      
      // Read passenger details from DOM
      seats.forEach((seat, index) => {
        const formCard = document.querySelectorAll('.traveller-form')[index];
        if (formCard) {
          const nameInput = formCard.querySelector('.name-field input');
          const ageInput = formCard.querySelector('.age-field input');
          passengerData[seat] = {
            name: nameInput?.value || '',
            age: ageInput?.value || ''
          };
        }
      });
      
      // Read contact details from DOM
      const emailInput = document.querySelector('.contact-details-section input[type="email"]');
      const mobileInput = document.querySelector('.contact-details-section input[type="tel"]');
      const stateSelect = document.querySelector('.state-dropdown');
      
      setPassengerFormData(passengerData);
      setContactDetails({
        email: emailInput?.value || '',
        mobile: mobileInput?.value || '',
        state: stateSelect?.value || 'Uttar Pradesh'
      });
      
      // Move to review booking view
      setPanelView('review-booking');
    } else if (panelView === 'review-booking') {
      // Show confirmation modal
      setShowConfirmationModal(true);
    }
  };
  
  // Handle booking confirmation
  const handleConfirmBusBooking = async () => {
    try {
      // TODO: API call to save bus booking
      console.log("Saving bus booking data:", {
        bus: currentBookingBus,
        seats: selectedSeats[currentBookingBus?.id],
        boardingPoint: selectedBoardingPoint[currentBookingBus?.id],
        droppingPoint: selectedDroppingPoint[currentBookingBus?.id],
        passengers: passengerFormData,
        contact: contactDetails,
        offer: appliedOffer,
        totalAmount: finalAmount
      });
      
      // Close confirmation modal and show success modal
      setShowConfirmationModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving bus booking:", error);
      alert("Failed to save booking. Please try again.");
    }
  };
  
  // Handle cancel booking
  const handleCancelBusBooking = (e) => {
    if (e) e.stopPropagation();
    window.alert('CANCEL BUTTON CLICKED!');
    console.log('Cancel bus booking clicked - navigating to /cancel');
    alert('Cancel button clicked! Navigating now...');
    navigate('/cancel', { replace: true });
  };

  // Available offers
  const availableOffers = [
    { code: 'MEGABUS', description: 'Get discount up to 10% on your bus bookings!', discount: 22, requiresLogin: false },
    { code: 'IDBICC', description: 'Exclusive Offer - Get Flat 10% off (upto INR 500) on IDBI CC Users', discount: 89, requiresLogin: false },
    { code: 'IDBIDC', description: 'Exclusive Offer - Get Flat 10% off (upto INR 500) on IDBI DC Users', discount: 89, requiresLogin: false },
    { code: 'MMTCANARA', description: 'Get FLAT 10% OFF up to Rs', discount: 89, requiresLogin: true },
    { code: 'MMTPNB', description: 'Get FLAT 8% OFF on your Bus booking using PNB credit cards', discount: 71, requiresLogin: true },
    { code: 'BUSTRAINPASS', description: 'Travel Pass - Buy for Rs. 99 and get instant Rs. 50 off and 4 vouchers each worth Rs. 50 off on bus/Rs. 25 off on train bookings of Min. ATV Rs. 500.', discount: 89, requiresLogin: false },
    { code: 'WELCOMEMMT', description: 'Get Flat 10% instant discount up to Rs 150 + Flat 10% cashback up to Rs 150 on first bus booking', discount: 89, requiresLogin: true }
  ];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    logoutUser();
    setShowProfileDropdown(false);
    navigate("/");
  };

  const handleAuthSuccess = () => {
    refreshAuth();
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const getGradientStyle = (name) => {
    const charCode = name ? name.charCodeAt(0) : 85;
    const hue = (charCode * 137.508) % 360;
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 60%))`
    };
  };

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
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Menu */}
          <ul className="nav-menu">
            <li onClick={() => navigate("/", { state: { searchBoxType: "flights" } })}>
              <FaPlane className="menu-icon" /> Flights
            </li>
            <li onClick={() => navigate("/", { state: { searchBoxType: "hotel" } })}>
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

            {isLoggedIn && currentUser ? (
              <div className="profile-avatar-container" ref={profileDropdownRef}>
                <Avatar
                  user={currentUser}
                  size="medium"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                />

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
              <div className="login-signup" onClick={() => setShowAuthModal(true)} style={{ cursor: "pointer" }}>
                <FaUserCircle className="user-login-icon" />
                <span>Login / Signup</span>
              </div>
            )}
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
                      
                      <button 
                        className="bus-details-link"
                        onClick={() => toggleBusDetails('bus1')}
                      >
                        {openBusDetails['bus1'] ? 'Hide Details' : 'Bus Details'} →
                      </button>
                    </div>
                  </div>
                  <div className="bus-ticket-footer">
                    
                    <div className="bus-rating-badge">
                      
                      <FaStar className="star-icon" /> 4.4
                      
                    </div>
                    <span className="review-count">13 Reviews</span>
                    <button className="bus-select-seat-btn" onClick={() => toggleDropdown('bus1')}>SELECT SEATS</button>
                  </div>
                </div>

                {/* Bus Details Dropdown (NEW - Clone of Flight Details) */}
                {openBusDetails['bus1'] && (
                  <div className="flight-details-dropdown">
                    <div className="flight-details-tabs">
                      <button 
                        className={`tab-btn ${activeBusTab['bus1'] === 'photos' || !activeBusTab['bus1'] ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus1', 'photos')}
                      >
                        Photos
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus1'] === 'amenities' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus1', 'amenities')}
                      >
                        Amenities
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus1'] === 'ratings' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus1', 'ratings')}
                      >
                        Ratings & Reviews
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus1'] === 'policies' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus1', 'policies')}
                      >
                        Policies
                      </button>
                    </div>

                    <div className="flight-details-content">
                      {(activeBusTab['bus1'] === 'photos' || !activeBusTab['bus1']) && (
                        <div className="bus-photos-grid">
                          <img src="/buses/bb1.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb2.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb3.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb4.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb5.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb6.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb7.jpeg" alt="Bus" className="bus-photo" />
                        </div>
                      )}

                      {activeBusTab['bus1'] === 'amenities' && (
                        <div className="bus-amenities-content">
                          <div className="amenity-item">
                            <FaTint className="amenity-icon" />
                            <span>Water Bottle</span>
                          </div>
                          <div className="amenity-item">
                            <FaBed className="amenity-icon" />
                            <span>Blankets</span>
                          </div>
                          <div className="amenity-item">
                            <FaBolt className="amenity-icon" />
                            <span>Charging Point</span>
                          </div>
                          <div className="amenity-item">
                            <FaLightbulb className="amenity-icon" />
                            <span>Reading Light</span>
                          </div>
                          <div className="amenity-item">
                            <FaVideo className="amenity-icon" />
                            <span>CCTV</span>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus1'] === 'ratings' && (
                        <div className="bus-ratings-content">
                          <div className="ratings-top-section">
                            <div className="overall-rating">
                              <div className="rating-number">4</div>
                              <div className="rating-stars">
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-empty" />
                              </div>
                              <div className="reviews-count">15 reviews</div>
                              <div className="rating-bars">
                                <div className="rating-bar-row">
                                  <span>5</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '60%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>4</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '20%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>3</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '10%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>2</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>1</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                              </div>
                            </div>
                            <div className="rating-categories">
                              <span className="category-chip">Seat / Sleep Comfort</span>
                              <span className="category-chip">AC</span>
                              <span className="category-chip">Rest stop hygiene</span>
                              <span className="category-chip">Punctuality</span>
                              <span className="category-chip">Live tracking</span>
                              <span className="category-chip">Staff behavior</span>
                              <span className="category-chip">Cleanliness</span>
                              <span className="category-chip">Driving</span>
                            </div>
                          </div>
                          <div className="reviews-grid">
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Always delay.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Sanket Katiyar</span>
                                <span className="review-date">23-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Not clean, AC not switched on, suffocation in bus</div>
                              <div className="review-meta">
                                <span className="reviewer-name">yash agarwal</span>
                                <span className="review-date">19-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Very good</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Janardan Singh</span>
                                <span className="review-date">12-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Bus was on time. Gave water bottle. Happy to travel again with Laksmi bus services. Thank you.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Shivam Uttam</span>
                                <span className="review-date">07-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">I give 5 star because this was the only way available but some cons were there. 1) They don't let me go to washroom and do not even stop for rest. 2) No rest stop. 3) In midnight chilling weather, bus was late by 1.5 hours, instead of 2 it came at 3.30. It was very chilly.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">saurabh Tripathi</span>
                                <span className="review-date">28-12-2025</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Thanks.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">rohit kumar</span>
                                <span className="review-date">27-12-2025</span>
                              </div>
                            </div>
                          </div>
                          <div className="view-all-reviews">
                            <a href="#">View all Reviews (9)</a>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus1'] === 'policies' && (
                        <div className="bus-policies-content">
                          <div className="policies-layout">
                            {/* Left Section - Cancellation Policy */}
                            <div className="cancellation-policy-section">
                              <h3 className="policy-section-title">Cancellation Policy</h3>
                              <div className="cancellation-table-wrapper">
                                <table className="cancellation-table">
                                  <thead>
                                    <tr>
                                      <th>CANCELLATION TIME</th>
                                      <th>PENALTY (%)</th>
                                      <th>PENALTY (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>more than 168 hrs before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>72 to 168 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>24 to 72 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>12 to 24 hr(s) before travel</td>
                                      <td>25.0%</td>
                                      <td>₹ 199</td>
                                    </tr>
                                    <tr>
                                      <td>4 to 12 hr(s) before travel</td>
                                      <td>50.0%</td>
                                      <td>₹ 397</td>
                                    </tr>
                                    <tr>
                                      <td>0 to 4 hr(s) before travel</td>
                                      <td>100.0%</td>
                                      <td>₹ 793</td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <div className="policy-notes">
                                  <p>* The penalty is calculated based on total seat worth 793</p>
                                  <p>* Penalty is calculated basis the bus service scheduled start time at: 30-01-2026 20:00 (subject to change).</p>
                                  <p>* Partial cancellation is allowed for this ticket.</p>
                                  <p>* Please note : the ticket cannot be cancelled after the bus departs from the first boarding point.</p>
                                  <p>* Above defined cancellation charges are illustrasted basis maximum fare applicable. Exact cancellation charges will depend on the final price charged along with discount and other adjustments.</p>
                                  <p>* Cancellation amount shown above may also vary basis the non-refundable components of the ticket defined by the bus operator</p>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Travel Policy */}
                            <div className="travel-policy-section">
                              <h3 className="policy-section-title">Travel Policy</h3>
                              <div className="travel-policy-items">
                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="8" r="3" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Child passenger</h4>
                                    <p>Children above the age of 5 will need a ticket</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <rect x="4" y="8" width="16" height="10" rx="1" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M8 8V6C8 4.895 8.895 4 10 4H14C15.105 4 16 4.895 16 6V8" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="12" cy="13" r="1" fill="#333"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Luggage</h4>
                                    <p>2 pieces of luggage will be accepted free of charge per passenger. Excess items will be chargeable Excess baggage over 10 kgs per passenger will be chargeable</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 3C10.343 3 9 4.343 9 6C9 7.657 10.343 9 12 9C13.657 9 15 7.657 15 6C15 4.343 13.657 3 12 3Z" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C8.686 9 6 11.686 6 15V18C6 18.552 6.448 19 7 19H9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C15.314 9 18 11.686 18 15V18C18 18.552 17.552 19 17 19H15" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 15C10 13.895 10.895 13 12 13C13.105 13 14 13.895 14 15V19C14 20.105 13.105 21 12 21C10.895 21 10 20.105 10 19V15Z" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pets</h4>
                                    <p>Pets are not allowed</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M8 2L6 6H4C3.448 6 3 6.448 3 7V17C3 17.552 3.448 18 4 18H5" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="8" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="16" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 18H14" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M18 18H20C20.552 18 21 17.552 21 17V12L18 6H6L8 2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M14 10L16 8L18 10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Liquor</h4>
                                    <p>Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers.</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="12" r="9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 7V12L15 15" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pickup time</h4>
                                    <p>Bus operator is not obligated to wait beyond the scheduled departure time of the bus. No refund request will be entertained for late arriving passengers.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Seat Selection Dropdown (Existing) */}
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

                                <button 
                                  className={`continue-btn ${!isContinueEnabled('bus1') ? 'disabled' : ''}`}
                                  disabled={!isContinueEnabled('bus1')}
                                  onClick={() => handleContinue('bus1', {
                                    name: 'Yolo Bus',
                                    type: 'Bharat Benz A/C Seater / Sleeper (2+1)',
                                    departureTime: '19:30',
                                    departureDate: '31 Jan \'26, Sat',
                                    departureCity: 'Delhi',
                                    arrivalTime: '04:19',
                                    arrivalDate: '1 Feb\' 26, Sun',
                                    arrivalCity: 'Kanpur (Uttar Pradesh)',
                                    duration: '08h 49m',
                                    boardingPoint: selectedBoardingPoint['bus1'],
                                    droppingPoint: selectedDroppingPoint['bus1']
                                  })}
                                >
                                  CONTINUE
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                      
                      <button 
                        className="bus-details-link"
                        onClick={() => toggleBusDetails('bus2')}
                      >
                        {openBusDetails['bus2'] ? 'Hide Details' : 'Bus Details'} →
                      </button>
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

                {/* Bus Details Dropdown for Bus 2 */}
                {openBusDetails['bus2'] && (
                  <div className="flight-details-dropdown">
                    <div className="flight-details-tabs">
                      <button 
                        className={`tab-btn ${activeBusTab['bus2'] === 'photos' || !activeBusTab['bus2'] ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus2', 'photos')}
                      >
                        Photos
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus2'] === 'amenities' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus2', 'amenities')}
                      >
                        Amenities
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus2'] === 'ratings' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus2', 'ratings')}
                      >
                        Ratings & Reviews
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus2'] === 'policies' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus2', 'policies')}
                      >
                        Policies
                      </button>
                    </div>

                    <div className="flight-details-content">
                      {(activeBusTab['bus2'] === 'photos' || !activeBusTab['bus2']) && (
                        <div className="bus-photos-grid">
                          <img src="/buses/bb1.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb2.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb3.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb4.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb5.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb6.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb7.jpeg" alt="Bus" className="bus-photo" />
                        </div>
                      )}

                      {activeBusTab['bus2'] === 'amenities' && (
                        <div className="bus-amenities-content">
                          <div className="amenity-item">
                            <FaTint className="amenity-icon" />
                            <span>Water Bottle</span>
                          </div>
                          <div className="amenity-item">
                            <FaBed className="amenity-icon" />
                            <span>Blankets</span>
                          </div>
                          <div className="amenity-item">
                            <FaBolt className="amenity-icon" />
                            <span>Charging Point</span>
                          </div>
                          <div className="amenity-item">
                            <FaLightbulb className="amenity-icon" />
                            <span>Reading Light</span>
                          </div>
                          <div className="amenity-item">
                            <FaVideo className="amenity-icon" />
                            <span>CCTV</span>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus2'] === 'ratings' && (
                        <div className="bus-ratings-content">
                          <div className="ratings-top-section">
                            <div className="overall-rating">
                              <div className="rating-number">4</div>
                              <div className="rating-stars">
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-empty" />
                              </div>
                              <div className="reviews-count">15 reviews</div>
                              <div className="rating-bars">
                                <div className="rating-bar-row">
                                  <span>5</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '60%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>4</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '20%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>3</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '10%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>2</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>1</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                              </div>
                            </div>
                            <div className="rating-categories">
                              <span className="category-chip">Seat / Sleep Comfort</span>
                              <span className="category-chip">AC</span>
                              <span className="category-chip">Rest stop hygiene</span>
                              <span className="category-chip">Punctuality</span>
                              <span className="category-chip">Live tracking</span>
                              <span className="category-chip">Staff behavior</span>
                              <span className="category-chip">Cleanliness</span>
                              <span className="category-chip">Driving</span>
                            </div>
                          </div>
                          <div className="reviews-grid">
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Always delay.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Sanket Katiyar</span>
                                <span className="review-date">23-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Not clean, AC not switched on, suffocation in bus</div>
                              <div className="review-meta">
                                <span className="reviewer-name">yash agarwal</span>
                                <span className="review-date">19-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Very good</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Janardan Singh</span>
                                <span className="review-date">12-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Bus was on time. Gave water bottle. Happy to travel again with Laksmi bus services. Thank you.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Shivam Uttam</span>
                                <span className="review-date">07-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">I give 5 star because this was the only way available but some cons were there. 1) They don't let me go to washroom and do not even stop for rest. 2) No rest stop. 3) In midnight chilling weather, bus was late by 1.5 hours, instead of 2 it came at 3.30. It was very chilly.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">saurabh Tripathi</span>
                                <span className="review-date">28-12-2025</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Thanks.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">rohit kumar</span>
                                <span className="review-date">27-12-2025</span>
                              </div>
                            </div>
                          </div>
                          <div className="view-all-reviews">
                            <a href="#">View all Reviews (9)</a>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus2'] === 'policies' && (
                        <div className="bus-policies-content">
                          <div className="policies-layout">
                            {/* Left Section - Cancellation Policy */}
                            <div className="cancellation-policy-section">
                              <h3 className="policy-section-title">Cancellation Policy</h3>
                              <div className="cancellation-table-wrapper">
                                <table className="cancellation-table">
                                  <thead>
                                    <tr>
                                      <th>CANCELLATION TIME</th>
                                      <th>PENALTY (%)</th>
                                      <th>PENALTY (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>more than 168 hrs before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>72 to 168 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>24 to 72 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>12 to 24 hr(s) before travel</td>
                                      <td>25.0%</td>
                                      <td>₹ 199</td>
                                    </tr>
                                    <tr>
                                      <td>4 to 12 hr(s) before travel</td>
                                      <td>50.0%</td>
                                      <td>₹ 397</td>
                                    </tr>
                                    <tr>
                                      <td>0 to 4 hr(s) before travel</td>
                                      <td>100.0%</td>
                                      <td>₹ 793</td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <div className="policy-notes">
                                  <p>* The penalty is calculated based on total seat worth 793</p>
                                  <p>* Penalty is calculated basis the bus service scheduled start time at: 30-01-2026 20:00 (subject to change).</p>
                                  <p>* Partial cancellation is allowed for this ticket.</p>
                                  <p>* Please note : the ticket cannot be cancelled after the bus departs from the first boarding point.</p>
                                  <p>* Above defined cancellation charges are illustrasted basis maximum fare applicable. Exact cancellation charges will depend on the final price charged along with discount and other adjustments.</p>
                                  <p>* Cancellation amount shown above may also vary basis the non-refundable components of the ticket defined by the bus operator</p>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Travel Policy */}
                            <div className="travel-policy-section">
                              <h3 className="policy-section-title">Travel Policy</h3>
                              <div className="travel-policy-items">
                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="8" r="3" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Child passenger</h4>
                                    <p>Children above the age of 5 will need a ticket</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <rect x="4" y="8" width="16" height="10" rx="1" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M8 8V6C8 4.895 8.895 4 10 4H14C15.105 4 16 4.895 16 6V8" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="12" cy="13" r="1" fill="#333"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Luggage</h4>
                                    <p>2 pieces of luggage will be accepted free of charge per passenger. Excess items will be chargeable Excess baggage over 10 kgs per passenger will be chargeable</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 3C10.343 3 9 4.343 9 6C9 7.657 10.343 9 12 9C13.657 9 15 7.657 15 6C15 4.343 13.657 3 12 3Z" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C8.686 9 6 11.686 6 15V18C6 18.552 6.448 19 7 19H9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C15.314 9 18 11.686 18 15V18C18 18.552 17.552 19 17 19H15" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 15C10 13.895 10.895 13 12 13C13.105 13 14 13.895 14 15V19C14 20.105 13.105 21 12 21C10.895 21 10 20.105 10 19V15Z" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pets</h4>
                                    <p>Pets are not allowed</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M8 2L6 6H4C3.448 6 3 6.448 3 7V17C3 17.552 3.448 18 4 18H5" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="8" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="16" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 18H14" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M18 18H20C20.552 18 21 17.552 21 17V12L18 6H6L8 2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M14 10L16 8L18 10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Liquor</h4>
                                    <p>Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers.</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="12" r="9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 7V12L15 15" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pickup time</h4>
                                    <p>Bus operator is not obligated to wait beyond the scheduled departure time of the bus. No refund request will be entertained for late arriving passengers.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      
                      <button 
                        className="bus-details-link"
                        onClick={() => toggleBusDetails('bus3')}
                      >
                        {openBusDetails['bus3'] ? 'Hide Details' : 'Bus Details'} →
                      </button>
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

                {/* Bus Details Dropdown for Bus 3 */}
                {openBusDetails['bus3'] && (
                  <div className="flight-details-dropdown">
                    <div className="flight-details-tabs">
                      <button 
                        className={`tab-btn ${activeBusTab['bus3'] === 'photos' || !activeBusTab['bus3'] ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus3', 'photos')}
                      >
                        Photos
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus3'] === 'amenities' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus3', 'amenities')}
                      >
                        Amenities
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus3'] === 'ratings' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus3', 'ratings')}
                      >
                        Ratings & Reviews
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus3'] === 'policies' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus3', 'policies')}
                      >
                        Policies
                      </button>
                    </div>

                    <div className="flight-details-content">
                      {(activeBusTab['bus3'] === 'photos' || !activeBusTab['bus3']) && (
                        <div className="bus-photos-grid">
                          <img src="/buses/bb1.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb2.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb3.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb4.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb5.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb6.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb7.jpeg" alt="Bus" className="bus-photo" />
                        </div>
                      )}

                      {activeBusTab['bus3'] === 'amenities' && (
                        <div className="bus-amenities-content">
                          <div className="amenity-item">
                            <FaTint className="amenity-icon" />
                            <span>Water Bottle</span>
                          </div>
                          <div className="amenity-item">
                            <FaBed className="amenity-icon" />
                            <span>Blankets</span>
                          </div>
                          <div className="amenity-item">
                            <FaBolt className="amenity-icon" />
                            <span>Charging Point</span>
                          </div>
                          <div className="amenity-item">
                            <FaLightbulb className="amenity-icon" />
                            <span>Reading Light</span>
                          </div>
                          <div className="amenity-item">
                            <FaVideo className="amenity-icon" />
                            <span>CCTV</span>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus3'] === 'ratings' && (
                        <div className="bus-ratings-content">
                          <div className="ratings-top-section">
                            <div className="overall-rating">
                              <div className="rating-number">4</div>
                              <div className="rating-stars">
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-empty" />
                              </div>
                              <div className="reviews-count">15 reviews</div>
                              <div className="rating-bars">
                                <div className="rating-bar-row">
                                  <span>5</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '60%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>4</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '20%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>3</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '10%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>2</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>1</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                              </div>
                            </div>
                            <div className="rating-categories">
                              <span className="category-chip">Seat / Sleep Comfort</span>
                              <span className="category-chip">AC</span>
                              <span className="category-chip">Rest stop hygiene</span>
                              <span className="category-chip">Punctuality</span>
                              <span className="category-chip">Live tracking</span>
                              <span className="category-chip">Staff behavior</span>
                              <span className="category-chip">Cleanliness</span>
                              <span className="category-chip">Driving</span>
                            </div>
                          </div>
                          <div className="reviews-grid">
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Always delay.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Sanket Katiyar</span>
                                <span className="review-date">23-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Not clean, AC not switched on, suffocation in bus</div>
                              <div className="review-meta">
                                <span className="reviewer-name">yash agarwal</span>
                                <span className="review-date">19-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Very good</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Janardan Singh</span>
                                <span className="review-date">12-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Bus was on time. Gave water bottle. Happy to travel again with Laksmi bus services. Thank you.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Shivam Uttam</span>
                                <span className="review-date">07-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">I give 5 star because this was the only way available but some cons were there. 1) They don't let me go to washroom and do not even stop for rest. 2) No rest stop. 3) In midnight chilling weather, bus was late by 1.5 hours, instead of 2 it came at 3.30. It was very chilly.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">saurabh Tripathi</span>
                                <span className="review-date">28-12-2025</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Thanks.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">rohit kumar</span>
                                <span className="review-date">27-12-2025</span>
                              </div>
                            </div>
                          </div>
                          <div className="view-all-reviews">
                            <a href="#">View all Reviews (9)</a>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus3'] === 'policies' && (
                        <div className="bus-policies-content">
                          <div className="policies-layout">
                            {/* Left Section - Cancellation Policy */}
                            <div className="cancellation-policy-section">
                              <h3 className="policy-section-title">Cancellation Policy</h3>
                              <div className="cancellation-table-wrapper">
                                <table className="cancellation-table">
                                  <thead>
                                    <tr>
                                      <th>CANCELLATION TIME</th>
                                      <th>PENALTY (%)</th>
                                      <th>PENALTY (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>more than 168 hrs before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>72 to 168 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>24 to 72 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>12 to 24 hr(s) before travel</td>
                                      <td>25.0%</td>
                                      <td>₹ 199</td>
                                    </tr>
                                    <tr>
                                      <td>4 to 12 hr(s) before travel</td>
                                      <td>50.0%</td>
                                      <td>₹ 397</td>
                                    </tr>
                                    <tr>
                                      <td>0 to 4 hr(s) before travel</td>
                                      <td>100.0%</td>
                                      <td>₹ 793</td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <div className="policy-notes">
                                  <p>* The penalty is calculated based on total seat worth 793</p>
                                  <p>* Penalty is calculated basis the bus service scheduled start time at: 30-01-2026 20:00 (subject to change).</p>
                                  <p>* Partial cancellation is allowed for this ticket.</p>
                                  <p>* Please note : the ticket cannot be cancelled after the bus departs from the first boarding point.</p>
                                  <p>* Above defined cancellation charges are illustrasted basis maximum fare applicable. Exact cancellation charges will depend on the final price charged along with discount and other adjustments.</p>
                                  <p>* Cancellation amount shown above may also vary basis the non-refundable components of the ticket defined by the bus operator</p>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Travel Policy */}
                            <div className="travel-policy-section">
                              <h3 className="policy-section-title">Travel Policy</h3>
                              <div className="travel-policy-items">
                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="8" r="3" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Child passenger</h4>
                                    <p>Children above the age of 5 will need a ticket</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <rect x="4" y="8" width="16" height="10" rx="1" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M8 8V6C8 4.895 8.895 4 10 4H14C15.105 4 16 4.895 16 6V8" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="12" cy="13" r="1" fill="#333"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Luggage</h4>
                                    <p>2 pieces of luggage will be accepted free of charge per passenger. Excess items will be chargeable Excess baggage over 10 kgs per passenger will be chargeable</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 3C10.343 3 9 4.343 9 6C9 7.657 10.343 9 12 9C13.657 9 15 7.657 15 6C15 4.343 13.657 3 12 3Z" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C8.686 9 6 11.686 6 15V18C6 18.552 6.448 19 7 19H9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C15.314 9 18 11.686 18 15V18C18 18.552 17.552 19 17 19H15" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 15C10 13.895 10.895 13 12 13C13.105 13 14 13.895 14 15V19C14 20.105 13.105 21 12 21C10.895 21 10 20.105 10 19V15Z" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pets</h4>
                                    <p>Pets are not allowed</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M8 2L6 6H4C3.448 6 3 6.448 3 7V17C3 17.552 3.448 18 4 18H5" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="8" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="16" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 18H14" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M18 18H20C20.552 18 21 17.552 21 17V12L18 6H6L8 2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M14 10L16 8L18 10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Liquor</h4>
                                    <p>Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers.</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="12" r="9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 7V12L15 15" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pickup time</h4>
                                    <p>Bus operator is not obligated to wait beyond the scheduled departure time of the bus. No refund request will be entertained for late arriving passengers.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      
                      <button 
                        className="bus-details-link"
                        onClick={() => toggleBusDetails('bus4')}
                      >
                        {openBusDetails['bus4'] ? 'Hide Details' : 'Bus Details'} →
                      </button>
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

                {/* Bus Details Dropdown for Bus 4 */}
                {openBusDetails['bus4'] && (
                  <div className="flight-details-dropdown">
                    <div className="flight-details-tabs">
                      <button 
                        className={`tab-btn ${activeBusTab['bus4'] === 'photos' || !activeBusTab['bus4'] ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus4', 'photos')}
                      >
                        Photos
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus4'] === 'amenities' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus4', 'amenities')}
                      >
                        Amenities
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus4'] === 'ratings' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus4', 'ratings')}
                      >
                        Ratings & Reviews
                      </button>
                      <button 
                        className={`tab-btn ${activeBusTab['bus4'] === 'policies' ? 'active' : ''}`}
                        onClick={() => handleBusTabChange('bus4', 'policies')}
                      >
                        Policies
                      </button>
                    </div>

                    <div className="flight-details-content">
                      {(activeBusTab['bus4'] === 'photos' || !activeBusTab['bus4']) && (
                        <div className="bus-photos-grid">
                          <img src="/buses/bb1.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb2.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb3.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb4.jpg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb5.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb6.jpeg" alt="Bus" className="bus-photo" />
                          <img src="/buses/bb7.jpeg" alt="Bus" className="bus-photo" />
                        </div>
                      )}

                      {activeBusTab['bus4'] === 'amenities' && (
                        <div className="bus-amenities-content">
                          <div className="amenity-item">
                            <FaTint className="amenity-icon" />
                            <span>Water Bottle</span>
                          </div>
                          <div className="amenity-item">
                            <FaBed className="amenity-icon" />
                            <span>Blankets</span>
                          </div>
                          <div className="amenity-item">
                            <FaBolt className="amenity-icon" />
                            <span>Charging Point</span>
                          </div>
                          <div className="amenity-item">
                            <FaLightbulb className="amenity-icon" />
                            <span>Reading Light</span>
                          </div>
                          <div className="amenity-item">
                            <FaVideo className="amenity-icon" />
                            <span>CCTV</span>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus4'] === 'ratings' && (
                        <div className="bus-ratings-content">
                          <div className="ratings-top-section">
                            <div className="overall-rating">
                              <div className="rating-number">4</div>
                              <div className="rating-stars">
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-filled" />
                                <FaStar className="star-empty" />
                              </div>
                              <div className="reviews-count">15 reviews</div>
                              <div className="rating-bars">
                                <div className="rating-bar-row">
                                  <span>5</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '60%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>4</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '20%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>3</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '10%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>2</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                                <div className="rating-bar-row">
                                  <span>1</span>
                                  <div className="bar-bg"><div className="bar-fill" style={{width: '5%'}}></div></div>
                                </div>
                              </div>
                            </div>
                            <div className="rating-categories">
                              <span className="category-chip">Seat / Sleep Comfort</span>
                              <span className="category-chip">AC</span>
                              <span className="category-chip">Rest stop hygiene</span>
                              <span className="category-chip">Punctuality</span>
                              <span className="category-chip">Live tracking</span>
                              <span className="category-chip">Staff behavior</span>
                              <span className="category-chip">Cleanliness</span>
                              <span className="category-chip">Driving</span>
                            </div>
                          </div>
                          <div className="reviews-grid">
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Always delay.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Sanket Katiyar</span>
                                <span className="review-date">23-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 1</div>
                              <div className="review-text">Not clean, AC not switched on, suffocation in bus</div>
                              <div className="review-meta">
                                <span className="reviewer-name">yash agarwal</span>
                                <span className="review-date">19-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Very good</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Janardan Singh</span>
                                <span className="review-date">12-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Bus was on time. Gave water bottle. Happy to travel again with Laksmi bus services. Thank you.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">Shivam Uttam</span>
                                <span className="review-date">07-01-2026</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">I give 5 star because this was the only way available but some cons were there. 1) They don't let me go to washroom and do not even stop for rest. 2) No rest stop. 3) In midnight chilling weather, bus was late by 1.5 hours, instead of 2 it came at 3.30. It was very chilly.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">saurabh Tripathi</span>
                                <span className="review-date">28-12-2025</span>
                              </div>
                            </div>
                            <div className="review-card">
                              <div className="review-rating"><FaStar /> 5</div>
                              <div className="review-text">Thanks.</div>
                              <div className="review-meta">
                                <span className="reviewer-name">rohit kumar</span>
                                <span className="review-date">27-12-2025</span>
                              </div>
                            </div>
                          </div>
                          <div className="view-all-reviews">
                            <a href="#">View all Reviews (9)</a>
                          </div>
                        </div>
                      )}

                      {activeBusTab['bus4'] === 'policies' && (
                        <div className="bus-policies-content">
                          <div className="policies-layout">
                            {/* Left Section - Cancellation Policy */}
                            <div className="cancellation-policy-section">
                              <h3 className="policy-section-title">Cancellation Policy</h3>
                              <div className="cancellation-table-wrapper">
                                <table className="cancellation-table">
                                  <thead>
                                    <tr>
                                      <th>CANCELLATION TIME</th>
                                      <th>PENALTY (%)</th>
                                      <th>PENALTY (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>more than 168 hrs before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>72 to 168 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>24 to 72 hr(s) before travel</td>
                                      <td>15.0%</td>
                                      <td>₹ 119</td>
                                    </tr>
                                    <tr>
                                      <td>12 to 24 hr(s) before travel</td>
                                      <td>25.0%</td>
                                      <td>₹ 199</td>
                                    </tr>
                                    <tr>
                                      <td>4 to 12 hr(s) before travel</td>
                                      <td>50.0%</td>
                                      <td>₹ 397</td>
                                    </tr>
                                    <tr>
                                      <td>0 to 4 hr(s) before travel</td>
                                      <td>100.0%</td>
                                      <td>₹ 793</td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <div className="policy-notes">
                                  <p>* The penalty is calculated based on total seat worth 793</p>
                                  <p>* Penalty is calculated basis the bus service scheduled start time at: 30-01-2026 20:00 (subject to change).</p>
                                  <p>* Partial cancellation is allowed for this ticket.</p>
                                  <p>* Please note : the ticket cannot be cancelled after the bus departs from the first boarding point.</p>
                                  <p>* Above defined cancellation charges are illustrasted basis maximum fare applicable. Exact cancellation charges will depend on the final price charged along with discount and other adjustments.</p>
                                  <p>* Cancellation amount shown above may also vary basis the non-refundable components of the ticket defined by the bus operator</p>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Travel Policy */}
                            <div className="travel-policy-section">
                              <h3 className="policy-section-title">Travel Policy</h3>
                              <div className="travel-policy-items">
                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="8" r="3" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Child passenger</h4>
                                    <p>Children above the age of 5 will need a ticket</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <rect x="4" y="8" width="16" height="10" rx="1" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M8 8V6C8 4.895 8.895 4 10 4H14C15.105 4 16 4.895 16 6V8" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="12" cy="13" r="1" fill="#333"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Luggage</h4>
                                    <p>2 pieces of luggage will be accepted free of charge per passenger. Excess items will be chargeable Excess baggage over 10 kgs per passenger will be chargeable</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M12 3C10.343 3 9 4.343 9 6C9 7.657 10.343 9 12 9C13.657 9 15 7.657 15 6C15 4.343 13.657 3 12 3Z" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C8.686 9 6 11.686 6 15V18C6 18.552 6.448 19 7 19H9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 9C15.314 9 18 11.686 18 15V18C18 18.552 17.552 19 17 19H15" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 15C10 13.895 10.895 13 12 13C13.105 13 14 13.895 14 15V19C14 20.105 13.105 21 12 21C10.895 21 10 20.105 10 19V15Z" stroke="#333" strokeWidth="1.5"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pets</h4>
                                    <p>Pets are not allowed</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path d="M8 2L6 6H4C3.448 6 3 6.448 3 7V17C3 17.552 3.448 18 4 18H5" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="8" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <circle cx="16" cy="18" r="2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M10 18H14" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M18 18H20C20.552 18 21 17.552 21 17V12L18 6H6L8 2" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M14 10L16 8L18 10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Liquor</h4>
                                    <p>Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers.</p>
                                  </div>
                                </div>

                                <div className="travel-policy-item">
                                  <div className="policy-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <circle cx="12" cy="12" r="9" stroke="#333" strokeWidth="1.5"/>
                                      <path d="M12 7V12L15 15" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </div>
                                  <div className="policy-text">
                                    <h4>Pickup time</h4>
                                    <p>Bus operator is not obligated to wait beyond the scheduled departure time of the bus. No refund request will be entertained for late arriving passengers.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div> {/* End of bus-cards-container */}
            </section>
          </div>
        </div>
      </main>

      {/* Passenger Details Panel */}
      {isPanelOpen && currentBookingBus && (
        <>
          {/* Backdrop */}
          <div className="panel-backdrop" onClick={closePanel}></div>
          
          {/* Side Panel */}
          <div className="passenger-details-panel">
            {/* Close Button */}
            <button className="panel-close-btn" onClick={closePanel}>✕</button>
            
            {/* Panel Header */}
            <div className="panel-header">
              <h2>{panelView === 'passenger-details' ? 'Passenger Details' : 'Review Your Booking'}</h2>
            </div>

            {/* Panel Content */}
            <div className="panel-content">
              {panelView === 'passenger-details' ? (
                <>
                  {/* Bus Journey Summary */}
                  <div className="journey-summary">
                <div className="summary-header">
                  <h3 className="operator-name">{currentBookingBus.name}</h3>
                  <div className="seat-number">Seat No: {(selectedSeats[currentBookingBus.id] || []).join(', ')}</div>
                </div>
                <div className="bus-type-line">{currentBookingBus.type}</div>
                
                <div className="journey-timeline">
                  <div className="journey-point">
                    <div className="time-large">{currentBookingBus.departureTime}</div>
                    <div className="date-small">{currentBookingBus.departureDate}</div>
                    <div className="city-name">{currentBookingBus.departureCity}</div>
                    <div className="location-detail">
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp1' && 'Dhaula Kuan'}
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp2' && 'Jhandewalan'}
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp3' && 'ISBT Kashmiri Gate'}
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp4' && 'Anand Vihar'}
                    </div>
                    <div className="location-detail">
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp1' && 'Akshardham Metro Station, Delhi'}
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp2' && 'Jhandewalan Metro Station'}
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp3' && 'Akshardham Metro Station, Delhi'}
                      {selectedBoardingPoint[currentBookingBus.id] === 'bp4' && 'Anand Vihar ISBT'}
                    </div>
                  </div>

                  <div className="journey-duration">{currentBookingBus.duration}</div>

                  <div className="journey-point">
                    <div className="time-large">{currentBookingBus.arrivalTime}</div>
                    <div className="date-small">{currentBookingBus.arrivalDate}</div>
                    <div className="city-name">{currentBookingBus.arrivalCity}</div>
                    <div className="location-detail">
                      {selectedDroppingPoint[currentBookingBus.id] === 'dp1' && 'Fazalganj'}
                    </div>
                    <div className="location-detail">
                      {selectedDroppingPoint[currentBookingBus.id] === 'dp1' && 'Fazalganj'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Traveller Details */}
              <div className="bus-traveller-details-section">
                <h3 className="section-title">Traveller Details</h3>
                {(selectedSeats[currentBookingBus.id] || []).map((seat, index) => (
                  <div key={seat} className="traveller-form">
                    <div className="seat-label">
                      Seat {seat}
                    </div>
                    <div className="bus-form-row">
                      <div className="bus-form-field name-field">
                        <label>Name</label>
                        <input type="text" placeholder="Type here" />
                      </div>
                      <div className="bus-form-field age-field">
                        <label>Age*</label>
                        <input type="text" placeholder="eg : 24" />
                      </div>
                      <div className="bus-form-field gender-field">
                        <label>Gender</label>
                        <div className="gender-toggle">
                          <button 
                            className={`gender-btn ${(!travellerGenders[seat] || travellerGenders[seat] === 'male') ? 'active' : ''}`}
                            onClick={() => handleGenderSelect(seat, 'male')}
                          >
                            <img src="./logo/male.png" alt="Male" className="gender-icon" /> Male
                          </button>
                          <button 
                            className={`gender-btn female ${travellerGenders[seat] === 'female' ? 'active' : ''}`}
                            onClick={() => handleGenderSelect(seat, 'female')}
                          >
                            <img src="./logo/female.png" alt="Female" className="gender-icon" /> Female
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Details */}
              <div className="contact-details-section">
                <h3 className="section-title">
                  Contact Details <span className="subtitle">We'll send your ticket here</span>
                </h3>
                <div className="bus-form-row">
                  <div className="bus-form-field">
                    <label>Email Id*</label>
                    <input type="email" placeholder="" />
                  </div>
                  <div className="bus-form-field">
                    <label>Mobile Number*</label>
                    <input type="tel" placeholder="Type here" />
                  </div>
                </div>

                {/* GST Toggle */}
                <div className="gst-toggle-row">
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Enter GST details (optional)</span>
                </div>
              </div>

              {/* State Selection */}
              <div className="state-section">
                <h3 className="section-title">
                  Your pincode and state{' '}
                  <span className="subtitle">(Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.)</span>
                </h3>
                <div className="bus-form-field">
                  <label>Select the State</label>
                  <select className="state-dropdown">
                    <option>Uttar Pradesh</option>
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                  </select>
                </div>
                <div className="checkbox-row">
                  <input type="checkbox" id="save-billing" />
                  <label htmlFor="save-billing">Confirm and save billing details to your profile</label>
                </div>
              </div>

              {/* Offers Section */}
              <div className="offers-section">
                <h3 className="section-title">Offers</h3>
                <div className="offers-scroll-container">
                  {availableOffers.map((offer) => (
                    <div 
                      key={offer.code} 
                      className={`offer-card-panel ${appliedOffer?.code === offer.code ? 'applied' : ''}`}
                    >
                      <div className="offer-content">
                        <div className="offer-code">{offer.code}</div>
                        <div className="offer-description">
                          <span className="save-text">Save ₹{offer.discount}.</span> {offer.description}
                        </div>
                      </div>
                      <div className="offer-action">
                        {appliedOffer?.code === offer.code ? (
                          <>
                            <span className="discount-value">-₹{offer.discount}</span>
                            <button className="remove-btn" onClick={handleRemoveOffer}>Remove</button>
                          </>
                        ) : (
                          offer.requiresLogin ? (
                            <button className="login-btn">Login to avail offer</button>
                          ) : (
                            <button className="appply-btn" onClick={() => handleApplyOffer(offer)}>Apply</button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Details Section */}
              <div className="price-details-section">
                <h3 className="section-title">Price details</h3>
                <div className="price-row">
                  <span className="price-label">Base Fare</span>
                  <span className="price-value">₹{baseFare.toFixed(1)}</span>
                </div>
                {appliedOffer && (
                  <div className="price-row">
                    <span className="price-label">Discounts</span>
                    <span className="price-value discount">-₹{discountAmount.toFixed(1)}</span>
                  </div>
                )}
                <div className="price-row total">
                  <span className="price-label">Amount</span>
                  <span className="price-value">₹{finalAmount}</span>
                </div>
                <p className="price-note">Final payable amount will be updated on the next page</p>
              </div>

              {/* Continue Button */}
              <button className="continue-button-panel" onClick={handlePanelContinue}>CONTINUE</button>
              <p className="terms-text">By proceeding, I agree to Voyago's <a href="#">User Agreement</a>, <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                </>
              ) : (
                <>
                  {/* REVIEW BOOKING SECTION */}
                  <div className="bus-review-booking-section">
                    {/* Bus Journey Card */}
                    <div className="bus-review-card">
                      <div className="bus-review-header">
                        <div className="bus-review-operator-info">
                          <span className="bus-review-operator-name">{currentBookingBus.name}</span>
                        </div>
                        <span className="bus-review-bus-type">{currentBookingBus.type}</span>
                      </div>
                      
                      <div className="bus-review-timing">
                        <div className="bus-review-time-section">
                          <div className="bus-review-main-time">{currentBookingBus.departureTime}</div>
                          <div className="bus-review-date">{currentBookingBus.departureDate}</div>
                          <div className="bus-review-location">{currentBookingBus.departureCity}</div>
                        </div>
                        
                        <div className="bus-review-duration-section">
                          <div className="bus-review-duration">{currentBookingBus.duration}</div>
                        </div>
                        
                        <div className="bus-review-time-section">
                          <div className="bus-review-main-time">{currentBookingBus.arrivalTime}</div>
                          <div className="bus-review-date">{currentBookingBus.arrivalDate}</div>
                          <div className="bus-review-location">{currentBookingBus.arrivalCity}</div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Seats */}
                    <div className="bus-review-section">
                      <h3 className="bus-review-section-title">Selected Seats</h3>
                      <div className="bus-review-selection-card">
                        <div className="bus-review-detail-row">
                          <span className="bus-review-detail-label">Seat Numbers:</span>
                          <span className="bus-review-detail-value">{(selectedSeats[currentBookingBus.id] || []).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Boarding & Dropping Points */}
                    <div className="bus-review-section">
                      <h3 className="bus-review-section-title">Pickup & Drop Points</h3>
                      <div className="bus-review-selection-card">
                        <div className="bus-review-detail-row">
                          <span className="bus-review-detail-label">Boarding Point:</span>
                          <span className="bus-review-detail-value">
                            {selectedBoardingPoint[currentBookingBus.id] === 'bp1' && 'Dhaula Kuan - Akshardham Metro Station, Delhi'}
                            {selectedBoardingPoint[currentBookingBus.id] === 'bp2' && 'Jhandewalan - Jhandewalan Metro Station'}
                            {selectedBoardingPoint[currentBookingBus.id] === 'bp3' && 'ISBT Kashmiri Gate - Akshardham Metro Station, Delhi'}
                            {selectedBoardingPoint[currentBookingBus.id] === 'bp4' && 'Anand Vihar - Anand Vihar ISBT'}
                          </span>
                        </div>
                        <div className="bus-review-detail-row">
                          <span className="bus-review-detail-label">Dropping Point:</span>
                          <span className="bus-review-detail-value">
                            {selectedDroppingPoint[currentBookingBus.id] === 'dp1' && 'Fazalganj'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Travellers Section */}
                    <div className="bus-review-section">
                      <h3 className="bus-review-section-title">Traveller Details</h3>
                      {(selectedSeats[currentBookingBus.id] || []).map((seat, index) => (
                        <div key={seat} className="bus-review-traveller-card" style={{ marginBottom: index < selectedSeats[currentBookingBus.id].length - 1 ? '12px' : '0' }}>
                          <h4 className="bus-review-traveller-label">Seat {seat}</h4>
                          <div className="bus-review-detail-row">
                            <span className="bus-review-detail-label">Name:</span>
                            <span className="bus-review-detail-value">{passengerFormData[seat]?.name || 'Not provided'}</span>
                          </div>
                          <div className="bus-review-detail-row">
                            <span className="bus-review-detail-label">Age:</span>
                            <span className="bus-review-detail-value">{passengerFormData[seat]?.age || 'Not provided'}</span>
                          </div>
                          <div className="bus-review-detail-row">
                            <span className="bus-review-detail-label">Gender:</span>
                            <span className="bus-review-detail-value">{travellerGenders[seat] === 'female' ? 'Female' : 'Male'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Contact Details */}
                    <div className="bus-review-section">
                      <h3 className="bus-review-section-title">Contact Details</h3>
                      <div className="bus-review-selection-card">
                        <div className="bus-review-detail-row">
                          <span className="bus-review-detail-label">Email:</span>
                          <span className="bus-review-detail-value">{contactDetails.email || 'Not provided'}</span>
                        </div>
                        <div className="bus-review-detail-row">
                          <span className="bus-review-detail-label">Mobile:</span>
                          <span className="bus-review-detail-value">{contactDetails.mobile || 'Not provided'}</span>
                        </div>
                        <div className="bus-review-detail-row">
                          <span className="bus-review-detail-label">State:</span>
                          <span className="bus-review-detail-value">{contactDetails.state}</span>
                        </div>
                      </div>
                    </div>

                    {/* Applied Offer */}
                    {appliedOffer && (
                      <div className="bus-review-section">
                        <h3 className="bus-review-section-title">Applied Offer</h3>
                        <div className="bus-review-selection-card">
                          <div className="bus-review-detail-row">
                            <span className="bus-review-detail-label">Offer Code:</span>
                            <span className="bus-review-detail-value">{appliedOffer.code}</span>
                          </div>
                          <div className="bus-review-detail-row">
                            <span className="bus-review-detail-label">Discount:</span>
                            <span className="bus-review-detail-value">₹{appliedOffer.discount}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Total Amount Summary */}
                    <div className="bus-review-section">
                      <h3 className="bus-review-section-title">Total Amount</h3>
                      <div className="bus-review-total-card">
                        <div className="bus-review-detail-row">
                          <span className="bus-review-detail-label">Base Fare:</span>
                          <span className="bus-review-detail-value">₹{baseFare.toFixed(1)}</span>
                        </div>
                        {appliedOffer && (
                          <div className="bus-review-detail-row">
                            <span className="bus-review-detail-label">Discount:</span>
                            <span className="bus-review-detail-value">-₹{discountAmount.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="bus-review-total-divider"></div>
                        <div className="bus-review-detail-row bus-review-total-row">
                          <span className="bus-review-total-label">Grand Total:</span>
                          <span className="bus-review-total-value">₹{finalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Important Information */}
                    <div className="bus-review-section">
                      <h3 className="bus-review-section-title">Important Information</h3>
                      <p className="bus-review-info-text">
                        Please review your journey & traveller details carefully to avoid any cancellation penalties later.
                      </p>
                    </div>
                  </div>

                  {/* Complete Booking Button */}
                  <button className="continue-button-panel" onClick={handlePanelContinue}>COMPLETE BOOKING</button>
                  <p className="terms-text">By proceeding, I agree to Voyago's <a href="#">User Agreement</a>, <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                </>
              )}

              {/* Review Booking Button - Hidden/Removed */}
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Confirmation Modal for Bus Booking */}
      {showConfirmationModal && (
        <>
          <div className="confirmation-modal-backdrop" onClick={handleCancelBusBooking}></div>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 10001, position: 'fixed' }}>
            <div className="confirmation-modal-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="#9CA3AF" strokeWidth="4"/>
                <text x="40" y="55" fontSize="48" fill="#6B7280" fontWeight="600" textAnchor="middle">?</text>
              </svg>
            </div>
            <h3 className="confirmation-modal-title">Want to confirm your bus booking?</h3>
            <div className="confirmation-modal-buttons">
              <button 
                type="button" 
                className="confirmation-btn-yes" 
                onClick={handleConfirmBusBooking}
                style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 10002 }}
              >
                Yes, Confirm
              </button>
              <button 
                type="button" 
                className="confirmation-btn-no" 
                onClick={handleCancelBusBooking}
                style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 10002 }}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success Modal for Bus Booking */}
      {showSuccessModal && (
        <>
          <div className="success-modal-backdrop"></div>
          <div className="success-modal">
            <div className="success-modal-top">
              <div className="success-checkmark-badge">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 30L25 40L45 20" stroke="#FF5A5F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="success-modal-title">Booking successful</h2>
            </div>
            <div className="success-modal-zigzag"></div>
            <div className="success-modal-bottom">
              <p className="success-modal-coins"><strong>Your bus booking has been confirmed successfully!</strong></p>
              <button className="success-modal-btn" onClick={() => {
                setShowSuccessModal(false);
                closePanel();
                navigate('/');
                window.scrollTo(0, 0);
              }}>
                Go Home
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BusResults;
