import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaMoon,
  FaSun,
  FaThLarge,
  FaUserCircle, FaChevronLeft, FaChevronRight, FaArrowUp, FaArrowDown, FaStar, FaHeart, FaRegHeart, FaWifi, FaSwimmingPool, FaUtensils, FaConciergeBell, FaImage,
  FaSignOutAlt, FaUser, FaTachometerAlt
} from "react-icons/fa";

import SearchBox from "./SearchBox";
import HotelFiltersPanel from "./HotelFiltersPanel";
import AuthModal from "./AuthModal";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import "../styles/HotelResults.css";

function HotelResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};

  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const { isLoggedIn, currentUser, refreshAuth, logoutUser } = useAuth();

  // Hotel Sorting state management - 3 states: null (no sort), 'asc', 'desc'
  // Smart is 'active' by default
  const [hotelSortStates, setHotelSortStates] = useState({
    popularity: null,
    price: null,
    userRatings: null,
    lowestPriceBestRated: null,
    smart: 'active'
  });

  const toggleHotelSort = (sortKey) => {
    setHotelSortStates(prev => {
      // If Smart is clicked, just toggle it to active
      if (sortKey === 'smart') {
        return {
          popularity: null,
          price: null,
          userRatings: null,
          lowestPriceBestRated: null,
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
        popularity: null,
        price: null,
        userRatings: null,
        lowestPriceBestRated: null,
        smart: null, // Deselect smart when any other sort is clicked
        [sortKey]: newState
      };
    });
  };

  const getHotelSortLabel = (sortKey, state) => {
    if (state === null || state === 'asc') {
      return {
        popularity: 'High to Low',
        price: 'High to Low',
        userRatings: (
          <>
            5<FaStar style={{ color: '#FFD700', fontSize: '10px', marginLeft: '2px', marginRight: '2px' }} /> to 1<FaStar style={{ color: '#FFD700', fontSize: '10px', marginLeft: '2px' }} />
          </>
        ),
        lowestPriceBestRated: null
      }[sortKey];
    } else {
      return {
        popularity: 'Low to High',
        price: 'Low to High',
        userRatings: (
          <>
            1<FaStar style={{ color: '#FFD700', fontSize: '10px', marginLeft: '2px', marginRight: '2px' }} /> to 5<FaStar style={{ color: '#FFD700', fontSize: '10px', marginLeft: '2px' }} />
          </>
        ),
        lowestPriceBestRated: null
      }[sortKey];
    }
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-theme");
  };

  // Wishlist state for hotels
  const [wishlistedHotels, setWishlistedHotels] = useState([]);

  const toggleWishlist = (hotelId) => {
    if (wishlistedHotels.includes(hotelId)) {
      setWishlistedHotels(wishlistedHotels.filter(id => id !== hotelId));
    } else {
      setWishlistedHotels([...wishlistedHotels, hotelId]);
    }
  };

  // Sample hotel data
  const hotelData = [
    {
      id: 1,
      name: "Azora by Ayatana Goa",
      location: "Morjim",
      distance: "2.1 km from Morjai Temple",
      rating: 8.9,
      ratingText: "Excellent",
      totalRatings: 288,
      stars: 4,
      roomsLeft: 2,
      image: "/hotels/h2.jpg",
      photoCount: 102,
      amenities: ["Free Wifi", "Swimming pool at the property", "Restaurants", "Room Service"],
      description: "Large pool, hygienic environment, delicious meals, and attentive service near Morjim Beach",
      price: 6315,
      taxes: 853
    },
    {
      id: 2,
      name: "Ginger Goa, Panjim",
      location: "Panjim",
      distance: "1.6 km drive to Panjim Church | 6 minutes walk to Panaji Ktc Bus Terminal",
      rating: 4.0,
      ratingText: "Very Good",
      totalRatings: 6760,
      stars: 3,
      roomsLeft: 5,
      image: "/hotels/h3.jpg",
      photoCount: 102,
      amenities: ["Free Wifi", "Swimming pool at the property", "Restaurants", "Room Service"],
      description: "Location near central business hub, helpful staff with good service, hygienic and clean rooms",
      price: 11999,
      taxes: 2160
    },
    {
      id: 3,
      name: "The Leela Goa Beach Resort",
      location: "Cavelossim",
      distance: "5.2 km from Cavelossim Beach",
      rating: 9.2,
      ratingText: "Superb",
      totalRatings: 1543,
      stars: 5,
      roomsLeft: 3,
      image: "/hotels/h4.jpg",
      photoCount: 250,
      amenities: ["Free Wifi", "Swimming pool at the property", "Restaurants", "Room Service"],
      description: "Luxury beachfront property with world-class amenities and exceptional service",
      price: 18500,
      taxes: 3330
    },
    {
      id: 4,
      name: "Taj Holiday Village Resort",
      location: "Candolim",
      distance: "800m from Candolim Beach",
      rating: 8.7,
      ratingText: "Excellent",
      totalRatings: 892,
      stars: 5,
      roomsLeft: 1,
      image: "/hotels/h5.jpg",
      photoCount: 180,
      amenities: ["Free Wifi", "Swimming pool at the property", "Restaurants", "Room Service"],
      description: "Beautiful villa-style resort with lush gardens, multiple pools and direct beach access",
      price: 15200,
      taxes: 2736
    },
    {
      id: 5,
      name: "Novotel Goa Shrem Resort",
      location: "Candolim",
      distance: "1.2 km from Candolim Beach",
      rating: 8.3,
      ratingText: "Very Good",
      totalRatings: 2150,
      stars: 4,
      roomsLeft: 4,
      image: "/hotels/h6.jpg",
      photoCount: 156,
      amenities: ["Free Wifi", "Swimming pool at the property", "Restaurants", "Room Service"],
      description: "Modern resort with spacious rooms, great pool area and family-friendly facilities",
      price: 9800,
      taxes: 1764
    }
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

  // Hotel-specific offers (isolated from flight and bus offers)
  const hotelOffers = [
    { id: 1, logo: "/banks/b1.png", title: "Up to 15,000 Off", sub: "with ICICI Bank Credit Card EMI", bgColor: "#fff3e6" },
    { id: 2, logo: "/banks/b2.png", title: "Up to 20% Off", sub: "with RBL Bank Credit Card EMI", bgColor: "#f0f2ff" },
    { id: 3, logo: "/banks/b3.png", title: "Get Flat 12% Off", sub: "with AU Bank Credit Card", bgColor: "#ffefd5" },
    { id: 4, logo: "/banks/b4.png", title: "Flat 15% Off", sub: "with Kotak Retail Credit Card EMI", bgColor: "#fff9e6" }
  ];

  return (
    <div className="hotel-results-page">
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
            <li className="active">
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
          <h1>Hotel</h1>
          <nav className="breadcrumb">
            <span>Home</span> &gt; <span>Hotel</span> &gt;{" "}
            <span className="current">Hotel Grid</span>
          </nav>
        </div>
      </header>

      {/* SEARCH BOX */}
      <section className="search-section-container">
        <SearchBox 
          preFilledData={searchData} 
          hideServiceTabs={true}
          activeService="hotel"
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
          {hotelOffers.map((offer) => (
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
      <main className="hotel-results-main-content">
        <div className="hotel-container">
          <div className="hotel-results-layout">
            {/* LEFT SIDEBAR */}
            <aside className="hotel-sidebar-filters">
              <HotelFiltersPanel />
            </aside>

            {/* RIGHT SIDE CONTENT */}
            <section className="hotel-list-section">
              {/* PROPERTY COUNT HEADING */}
              <h2 className="hotel-property-count">2285 Properties in Goa</h2>
              
              {/* HOTEL SORT BY BAR */}
              <div className="hotel-sort-by-bar">
                <span className="hotel-results-count">120 Hotels Available</span>
                <div className="hotel-sort-options">
                  <button 
                    className={`hotel-sort-btn ${hotelSortStates.popularity !== null ? 'active' : ''}`}
                    onClick={() => toggleHotelSort('popularity')}
                  >
                    Popularity
                    <span className="hotel-sort-label">
                      {getHotelSortLabel('popularity', hotelSortStates.popularity)}
                      {hotelSortStates.popularity === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                      {hotelSortStates.popularity === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                    </span>
                  </button>
                  <button 
                    className={`hotel-sort-btn ${hotelSortStates.price !== null ? 'active' : ''}`}
                    onClick={() => toggleHotelSort('price')}
                  >
                    Price
                    <span className="hotel-sort-label">
                      {getHotelSortLabel('price', hotelSortStates.price)}
                      {hotelSortStates.price === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                      {hotelSortStates.price === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                    </span>
                  </button>
                  <button 
                    className={`hotel-sort-btn ${hotelSortStates.userRatings !== null ? 'active' : ''}`}
                    onClick={() => toggleHotelSort('userRatings')}
                  >
                    User Ratings
                    <span className="hotel-sort-label">
                      {getHotelSortLabel('userRatings', hotelSortStates.userRatings)}
                      {hotelSortStates.userRatings === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                      {hotelSortStates.userRatings === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                    </span>
                  </button>
                  <button 
                    className={`hotel-sort-btn ${hotelSortStates.lowestPriceBestRated !== null ? 'active' : ''}`}
                    onClick={() => toggleHotelSort('lowestPriceBestRated')}
                  >
                    <span style={{textAlign: 'center', lineHeight: '1.3'}}>
                      Lowest Price<br />& Best Rated
                    </span>
                    <span className="hotel-sort-label">
                      {hotelSortStates.lowestPriceBestRated === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                      {hotelSortStates.lowestPriceBestRated === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                    </span>
                  </button>
                  <button 
                    className={`hotel-sort-btn ${hotelSortStates.smart === 'active' ? 'active' : ''}`}
                    onClick={() => toggleHotelSort('smart')}
                  >
                    Smart
                    <span className="hotel-sort-label">Recommended</span>
                  </button>
                </div>
              </div>
              
              {/* HOTEL CARDS */}
              <div className="hotel-cards-container">
                {hotelData.map((hotel) => (
                  <div key={hotel.id} className="hotel-card">
                    {/* Rooms Left Badge */}
                    <div className="hotel-rooms-left">{hotel.roomsLeft} rooms left</div>

                    {/* Left Section: Image */}
                    <div className="hotel-card-image-section">
                      <div className="hotel-image-wrapper">
                        <img src={hotel.image} alt={hotel.name} className="hotel-main-image" />
                        <button 
                          className="hotel-wishlist-btn"
                          onClick={() => toggleWishlist(hotel.id)}
                        >
                          {wishlistedHotels.includes(hotel.id) ? 
                            <FaHeart style={{ color: '#ff0000' }} /> : 
                            <FaRegHeart style={{ color: '#ffffff' }} />
                          }
                        </button>
                        <div className="hotel-photo-count">
                          <FaImage /> +{hotel.photoCount} Property Photos
                        </div>
                      </div>
                      <div className="hotel-image-dots">
                        <span className="dot active"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>

                    {/* Center Section: Hotel Details */}
                    <div className="hotel-card-details">
                      <div className="hotel-name-rating">
                        <h3 className="hotel-name">
                          {hotel.name}
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <FaStar key={i} style={{ color: '#FFA500', fontSize: '14px', marginLeft: '4px' }} />
                          ))}
                        </h3>
                      </div>
                      
                      <p className="hotel-location">
                        {hotel.location} • {hotel.distance}
                      </p>

                      <div className="hotel-rating-block">
                        <span className="hotel-rating-badge">{hotel.rating}</span>
                        <span className="hotel-rating-text">{hotel.ratingText} · {hotel.totalRatings} Ratings</span>
                      </div>

                      <div className="hotel-amenities">
                        {hotel.amenities.includes("Free Wifi") && (
                          <div className="hotel-amenity">
                            <span className="amenity-check">✓</span> Free Wifi
                          </div>
                        )}
                        {hotel.amenities.includes("Swimming pool at the property") && (
                          <div className="hotel-amenity">
                            <span className="amenity-check">✓</span> Swimming pool at the property
                          </div>
                        )}
                      </div>

                      <div className="hotel-extra-amenities">
                        <FaUtensils className="extra-icon" /> Restaurants
                        <FaConciergeBell className="extra-icon" style={{ marginLeft: '15px' }} /> Room Service
                      </div>

                      <div className="hotel-highlight">
                        <span className="highlight-icon">≋</span>
                        {hotel.description}
                      </div>
                    </div>

                    {/* Dashed Divider */}
                    <div className="hotel-card-divider"></div>

                    {/* Right Section: Price & CTA */}
                    <div className="hotel-card-price-section">
                      <div className="hotel-price-details">
                        <div className="hotel-main-price">₹{hotel.price.toLocaleString()}</div>
                        <div className="hotel-tax-info">+ ₹{hotel.taxes} taxes & fees</div>
                        <div className="hotel-per-info">per night, per room</div>
                      </div>
                      <button 
                        className="hotel-book-btn"
                        onClick={() => navigate('/hotel-booking', { 
                          state: {
                            hotelName: hotel.name,
                            hotelLocation: hotel.location,
                            hotelDistance: hotel.distance,
                            rating: hotel.rating,
                            ratingText: hotel.ratingText,
                            stars: hotel.stars,
                            price: hotel.price,
                            taxes: hotel.taxes,
                            image: hotel.image,
                            amenities: hotel.amenities,
                            city: searchData.city || "Goa",
                            checkInDate: searchData.checkInDate || new Date(),
                            checkOutDate: searchData.checkOutDate || new Date(new Date().setDate(new Date().getDate() + 1)),
                            rooms: searchData.guests?.rooms || 1,
                            adults: searchData.guests?.adults || 2,
                            children: searchData.guests?.children || 0
                          }
                        })}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default HotelResults;
