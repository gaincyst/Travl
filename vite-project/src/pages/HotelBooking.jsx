import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaMoon,
  FaSun,
  FaThLarge,
  FaUserCircle,
  FaStar,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaUser,
  FaBed
} from "react-icons/fa";
import HotelSearchHeader from "../components/HotelSearchHeader";
import "../styles/HotelBooking.css";

function HotelBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};
  
  const [darkMode, setDarkMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-theme");
  };

  const handleSearchUpdate = (updatedData) => {
    console.log("Search updated with:", updatedData);
    // Here you can handle search updates, e.g., fetch new hotel data
  };

  // Sample images for carousel (you can replace with actual hotel images)
  const hotelImages = [
    bookingData.image || "/hotels/h2.jpg",
    "/hotels/h3.jpg",
    "/hotels/h4.jpg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotelImages.length) % hotelImages.length);
  };

  return (
    <div className="hotel-booking-page">
      {/* HEADER 1 - Top Navigation Header (Same as HotelResults.jsx) */}
      <nav className="minimal-navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="logo-container">
            <img
              src="/logos.png"
              alt="Travel2 Logo"
              className="nav-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Menu */}
          <ul className="nav-menu">
            <li onClick={() => navigate("/")}>
              <FaPlane className="menu-icon" /> Flights
            </li>
            <li className="active">
              <FaHotel className="menu-icon" /> Hotels
            </li>
            <li onClick={() => navigate("/")}>
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

      {/* HEADER 2 - Search Summary Header (exactly as Screenshot 2) */}
      <HotelSearchHeader 
        initialData={{
          city: bookingData.city || bookingData.hotelName || "Casa Joi, Goa",
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          rooms: bookingData.rooms || 1,
          adults: bookingData.adults || 2,
          children: bookingData.children || 0
        }}
        onSearch={handleSearchUpdate}
      />

      {/* HOTEL DETAIL SECTION */}
      <section className="hotel-detail-section">
        <div className="hotel-detail-container">
          {/* TOP: Hotel Info Header (Full Width) */}
          <div className="hotel-info-header">
            {/* Star Rating + Hotel Type */}
            <div className="hotel-type-badge">
              <span className="stars-count">5</span>
              <FaStar className="star-icon-badge" />
              <span className="hotel-label">• Hotel</span>
            </div>

            {/* Hotel Name */}
            <h1 className="hotel-detail-name">
              {bookingData.hotelName || "Hyatt Centric Janakpuri, New Delhi"}
            </h1>

            {/* Location & Metro Info */}
            <div className="hotel-location-info">
              <FaMapMarkerAlt className="location-icon-small" />
              <span className="location-text">
                {bookingData.hotelLocation || "Janakpuri, Delhi"} | 
              </span>
              <span className="metro-info">
                🚇 2 minutes walk to {bookingData.hotelDistance || "Janakpuri West Metro Station"}
              </span>
            </div>

            {/* Rating + View Reviews */}
            <div className="rating-review-section">
              <div className="rating-badge-green">
                {bookingData.rating || "3.6"}/5
              </div>
              <button className="view-reviews-btn">View Reviews</button>
            </div>
          </div>

          {/* BOTTOM: Image Gallery + Price Card */}
          <div className="hotel-content-grid">
            {/* LEFT: Image Gallery */}
            <div className="hotel-image-gallery">
              <div className="main-image-container">
                <img 
                  src={hotelImages[currentImageIndex]} 
                  alt={bookingData.hotelName || "Hotel"} 
                  className="main-hotel-image"
                />
                
                {/* Navigation Arrows */}
                <button className="image-nav-btn prev" onClick={prevImage}>
                  <FaChevronLeft />
                </button>
                <button className="image-nav-btn next" onClick={nextImage}>
                  <FaChevronRight />
                </button>

                {/* Bottom Overlay */}
                <div className="image-overlay-bottom">
                  <span className="photo-label">Property Photos (93)</span>
                  <button className="view-all-btn">
                    View All <span className="arrow-circle">→</span>
                  </button>
                </div>
              </div>

              {/* Additional Image Thumbnails */}
              <div className="thumbnail-images">
                <div className="thumbnail-item">
                  <img src="/hotels/h3.jpg" alt="Room" />
                  <div className="thumbnail-overlay">
                    <span>Room(59)</span>
                    <span className="circle-icon">○</span>
                  </div>
                </div>
                <div className="thumbnail-item">
                  <img src="/hotels/h4.jpg" alt="Traveller Photos" />
                  <div className="thumbnail-overlay">
                    <span>Traveller Photos(103)</span>
                    <span className="circle-icon">○</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Price Card */}
            <div className="hotel-price-section">
              <div className="price-detail-card">
                {/* Room Type + Guests */}
                <div className="room-guest-info">
                  <div className="room-type-badge">2 TWIN BEDS</div>
                  <div className="guest-details">
                    <div className="guest-item">
                      <FaUser className="guest-icon" />
                      <span>{bookingData.adults || 2} Guests</span>
                    </div>
                    <div className="guest-item">
                      <FaBed className="room-icon" />
                      <span>undefined Rooms</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="hotel-tags">
                  <span className="tag-couple-friendly">💑 Couple Friendly</span>
                </div>

                {/* Cancellation Info */}
                <div className="cancellation-info">
                  <span className="check-icon">✓</span>
                  <span className="cancellation-text">
                    Free Cancellation Till 07-Feb-2026 13.59
                  </span>
                </div>

                {/* Price Section with Button */}
                <div className="price-and-button-section">
                  <div className="price-section">
                    <div className="price-main">₹{bookingData.price?.toLocaleString() || "16,490"}</div>
                    <div className="price-taxes">+{bookingData.taxes?.toLocaleString() || "2,968"} taxes & fees</div>
                    <div className="price-per">Room per night</div>
                  </div>

                  {/* CTA Button */}
                  <button className="view-room-options-btn">
                    Book Now <FaChevronDown className="btn-arrow" />
                  </button>
                </div>
              </div>

              {/* View Map Link (Outside/Below Price Card) */}
              <div className="view-map-link">
                <FaMapMarkerAlt className="map-link-icon" />
                <span>View on map</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HotelBooking;
