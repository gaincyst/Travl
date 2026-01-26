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

import SearchBox from "./SearchBox";
import BusFiltersPanel from "./BusFiltersPanel";
import DatePriceStrip from "./DatePriceStrip";
import "../styles/BusResults.css";

function BusResults() {
  const location = useLocation();
  const searchData = location.state || {};

  const [darkMode, setDarkMode] = useState(false);

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
                    <button className="bus-select-seat-btn">SELECT SEATS</button>
                  </div>
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
                    <button className="bus-select-seat-btn">SELECT SEATS</button>
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
                    <button className="bus-select-seat-btn">SELECT SEATS</button>
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
                    <button className="bus-select-seat-btn">SELECT SEATS</button>
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
