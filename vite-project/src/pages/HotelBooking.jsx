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
  const [activeTab, setActiveTab] = useState("Description");
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showKeyLandmarks, setShowKeyLandmarks] = useState(true);
  const [showAttractions, setShowAttractions] = useState(true);
  const [showTransport, setShowTransport] = useState(true);

  const tabs = [
    "Description",
    "Gallery",
    "Amenities",
    "Food & Dining",
    "Choose Rooms",
    "Location",
    "Guest Reviews",
    "Property Policies"
    
   
  ];

  const scrollToSection = (tabName) => {
    setActiveTab(tabName);
    const sectionId = tabName.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

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
    "/hotels/hh1.jpeg",
    "/hotels/hh2.jpeg",
    "/hotels/hh3.jpeg"
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
                    View All <span className="arrow">→</span>
                  </button>
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

      {/* TAB NAVIGATION */}
      <div className="tab-navigation-container">
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => scrollToSection(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div className="tab-content-wrapper">
        {/* Description Section */}
        <section id="room-options" className="tab-section">
          <div className="tab-section-container">
            <div className="description-layout">
              {/* LEFT COLUMN - Hotel Information */}
              <div className="description-left">
                {/* Hotel Title Section */}
                <div className="description-hotel-title">
                  <div className="description-hotel-name-line">
                    <h1 className="description-hotel-name">
                      {bookingData.hotelName || "Holiday Inn Express Gurugram Sector 50 By IHG"}
                    </h1>
                    <div className="description-stars-display">
                      <FaStar className="star-full" />
                      <FaStar className="star-full" />
                      <FaStar className="star-full" />
                      <FaStar className="star-half" />
                    </div>
                  </div>
                  <div className="description-address-line">
                    <span className="description-address">
                      Good Earth City Centre, Opposite Malibu Commerical Complex, Sector 50, Gurugram,, Gurugram, New Delhi and NCR, India, 122018
                    </span>
                    <span className="description-see-map">– SEE MAP</span>
                  </div>
                </div>

                {/* Highlights Section */}
                <div className="description-section">
                  <h2 className="description-section-title">Highlights</h2>
                  <div className="highlights-list">
                    <div className="highlight-item">
                      <div className="highlight-icon-wrapper">
                        <FaPlane className="highlight-icon" />
                      </div>
                      <div className="highlight-content">
                        <h3 className="highlight-title">Rated highly by Business travelers</h3>
                        <p className="highlight-text">"Highly recommend for a business traveller"</p>
                      </div>
                    </div>
                    <div className="highlight-item">
                      <div className="highlight-icon-wrapper">
                        <FaMapMarkerAlt className="highlight-icon" />
                      </div>
                      <div className="highlight-content">
                        <h3 className="highlight-title">Location</h3>
                        <p className="highlight-text">"Location is central in/ near mall with many food varieties"</p>
                      </div>
                    </div>
                    <div className="highlight-item">
                      <div className="highlight-icon-wrapper">
                        <FaUserCircle className="highlight-icon" />
                      </div>
                      <div className="highlight-content">
                        <h3 className="highlight-title">Attentive host service</h3>
                      </div>
                    </div>
                    <div className="highlight-item">
                      <div className="highlight-icon-wrapper">
                        <FaThLarge className="highlight-icon" />
                      </div>
                      <div className="highlight-content">
                        <h3 className="highlight-title">Great shopping nearby</h3>
                      </div>
                    </div>
                    <div className="highlight-item">
                      <div className="highlight-icon-wrapper">
                        <FaUser className="highlight-icon" />
                      </div>
                      <div className="highlight-content">
                        <h3 className="highlight-title">Rated highly by Couples</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facilities Section */}
                <div className="description-section">
                  <h2 className="description-section-title">Facilities</h2>
                  <div className="facilities-grid">
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Free Wi-Fi</span>
                    </div>
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Free parking</span>
                    </div>
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Front desk [24-hour]</span>
                    </div>
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Fitness center</span>
                    </div>
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Restaurants</span>
                    </div>
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Airport transfer</span>
                    </div>
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Kitchen</span>
                    </div>
                    <div className="facility-item">
                      <span className="facility-check">✓</span>
                      <span className="facility-text">Luggage storage</span>
                    </div>
                  </div>
                </div>

                {/* About Us Section */}
                <div className="description-section">
                  <h2 className="description-section-title">About us</h2>
                  <div className="about-text">
                    <p>
                      Experience the vibrant Holiday Inn Express Gurugram Sector 50, featuring an on-site art gallery. This contemporary hotel is ideally located{showFullAbout ? " near major shopping districts and business centers in Gurugram. The hotel offers modern amenities including complimentary Wi-Fi, free parking, and a 24-hour front desk. Guests can enjoy a fitness center, on-site restaurant, and spacious rooms with contemporary decor. The property is well-connected to the metro station and provides easy access to popular landmarks and entertainment venues." : "..."}
                      <span className="read-more-link" onClick={() => setShowFullAbout(!showFullAbout)}>
                        {showFullAbout ? "Read less" : "Read more"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Demand Alert Section */}
                <div className="demand-alert-box">
                  <p className="demand-alert-title">This property is in high demand!</p>
                  <p className="demand-alert-text">8 travelers have booked today.</p>
                </div>
              </div>

              {/* RIGHT COLUMN - Rating & Location Card */}
              <div className="description-right">
                <div className="rating-location-card">
                  {/* Rating Summary */}
                  <div className="rating-summary">
                    <div className="rating-score-section">
                      <div className="rating-score-big">7.0</div>
                      <div className="rating-text-big">Very good</div>
                    </div>
                    <div className="rating-reviews-link">
                      <span className="reviews-count">3,343 reviews</span>
                      <a href="#" className="read-reviews-link">Read all reviews</a>
                    </div>
                  </div>

                  {/* Rating Tags */}
                  <div className="rating-tags">
                    <span className="rating-tag">Location 7.6</span>
                    <span className="rating-tag">Cleanliness 7.5</span>
                    <span className="rating-tag">Service 7.4</span>
                    <span className="rating-tag">Value for money 6.7</span>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="testimonial-quote">
                    "This holiday inn has been a breath of fresh air."
                  </div>

                  {/* Map Preview */}
                  <div className="map-preview-box">
                    <div className="map-placeholder">
                      <FaMapMarkerAlt className="map-marker-icon" />
                      <span className="map-see-text">SEE MAP</span>
                    </div>
                  </div>

                  {/* Location Rating */}
                  <div className="location-rating-section">
                    <div className="location-score">7.6 Very good</div>
                    <div className="location-label">Location rating score</div>
                  </div>

                  {/* Very Good Location Badge */}
                  <div className="location-badge">
                    <FaMapMarkerAlt className="location-badge-icon" />
                    <span>Very good location</span>
                  </div>

                  {/* Parking Info */}
                  <div className="parking-info-row">
                    <div className="parking-icon-text">
                      <FaBus className="parking-icon" />
                      <span>Parking</span>
                    </div>
                    <span className="parking-status">FREE</span>
                  </div>

                  {/* Popular Landmarks */}
                  <div className="landmarks-section">
                    <h3 className="landmarks-title">Popular landmarks</h3>
                    <div className="landmarks-list">
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icon" />
                        <span className="landmark-name">Qutub Minar</span>
                        <span className="landmark-distance">17.3 km</span>
                      </div>
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icon" />
                        <span className="landmark-name">Lotus Temple</span>
                        <span className="landmark-distance">25.1 km</span>
                      </div>
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icon" />
                        <span className="landmark-name">Lodhi Garden</span>
                        <span className="landmark-distance">25.5 km</span>
                      </div>
                    
                    </div>
                  </div>

                  {/* Closest Landmarks */}
                  <div className="landmarks-section">
                    <h3 className="landmarks-title">Closest landmarks</h3>
                    <div className="landmarks-list">
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icon" />
                        <span className="landmark-name">Block B Market</span>
                        <span className="landmark-distance">770 m</span>
                      </div>
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icon" />
                        <span className="landmark-name">kunaic mandi mart</span>
                        <span className="landmark-distance">1.0 km</span>
                      </div>
                      
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icon" />
                        <span className="landmark-name">Imperia Towers Park</span>
                        <span className="landmark-distance">1.1 km</span>
                      </div>
                    </div>
                  </div>

                  {/* See Nearby Places Link */}
                  <a href="#" className="see-nearby-link">See nearby places</a>
                </div>
              </div>
            </div>
          </div>
        </section>

       {/* Gallery Section */}
<section id="gallery" className="tab-section">
  <div className="tab-section-container">
      <h2 className="tab-section-title">Gallery</h2>
    <div className="gallery-compact-grid">
      {/* LEFT - Primary Large Image */}
      <div className="gallery-frame-main">
        <img 
          src="/hotels/hh4.jpeg" 
          alt="Property Exterior" 
          className="gallery-img"
        />
        <div className="gallery-img-overlay">
          <span className="gallery-img-label">Property Photos (93)</span>
          <button className="gallery-action-btn">
            View All <FaChevronRight className="icon-xs" />
          </button>
        </div>
      </div>

      {/* RIGHT - Secondary Stack */}
      <div className="gallery-frame-stack">
        <div className="gallery-frame-item">
          <img src="/hotels/hh2.jpeg" alt="Room" className="gallery-img" />
          <div className="gallery-img-overlay">
            <span className="gallery-img-label">Room(59)</span>
            <div className="gallery-icon-circle"><FaChevronRight /></div>
          </div>
        </div>

        <div className="gallery-frame-item">
          <img src="/hotels/hh3.jpeg" alt="Traveller" className="gallery-img" />
          <div className="gallery-img-overlay">
            <span className="gallery-img-label">Traveller Photos(103)</span>
            <div className="gallery-icon-circle"><FaChevronRight /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Amenities Section */}
        <section id="amenities" className="tab-section">
          <div className="tab-section-container">
            <div className="amenities-header">
              <h2 className="amenities-title">Amenities and facilities</h2>
              <div className="amenities-rating">
                <span className="amenities-rating-score">Good 6.6</span>
                <span className="amenities-rating-label">Facilities</span>
              </div>
            </div>
            
            <div className="amenities-grid">
              {/* Column 1 */}
              <div className="amenities-column">
                <div className="amenity-category">
                  <h3 className="amenity-category-title">Languages spoken</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">🇬🇧</span>
                      <span className="amenity-text">English</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🇮🇳</span>
                      <span className="amenity-text">Hindi</span>
                    </div>
                  </div>
                </div>

                <div className="amenity-category">
                  <h3 className="amenity-category-title">Accessibility</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">♿</span>
                      <span className="amenity-text">Wheelchair accessible</span>
                    </div>
                  </div>
                </div>

                <div className="amenity-category">
                  <h3 className="amenity-category-title">Internet access</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">📶</span>
                      <span className="amenity-text">Free Wi-Fi in all rooms!</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">💻</span>
                      <span className="amenity-text">Internet</span>
                    </div>
                    {showAllAmenities && (
                      <>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Internet services</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">📶</span>
                          <span className="amenity-text">Wi-Fi in public areas</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {showAllAmenities && (
                  <div className="amenity-category">
                    <h3 className="amenity-category-title">Things to do, ways to relax</h3>
                    <div className="amenity-list">
                      <div className="amenity-item">
                        <span className="amenity-icon">✓</span>
                        <span className="amenity-text">Computer station</span>
                      </div>
                      <div className="amenity-item">
                        <span className="amenity-icon">💪</span>
                        <span className="amenity-text">Fitness center</span>
                      </div>
                      <div className="amenity-item">
                        <span className="amenity-icon">🏋️</span>
                        <span className="amenity-text">Gym/fitness</span>
                      </div>
                      <div className="amenity-item">
                        <span className="amenity-icon">✓</span>
                        <span className="amenity-text">Private bath</span>
                      </div>
                      <div className="amenity-item">
                        <span className="amenity-icon">🎫</span>
                        <span className="amenity-text">Ticket services</span>
                      </div>
                      <div className="amenity-item">
                        <span className="amenity-icon">🗺️</span>
                        <span className="amenity-text">Tours</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2 */}
              <div className="amenities-column">
                <div className="amenity-category">
                  <h3 className="amenity-category-title">Dining, drinking, and snacking</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">A la carte breakfast</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">A la carte in restaurant</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Alternative meal arrangement</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Asian breakfast</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Asian cuisine in restaurant</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Bottle of water</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Breakfast [buffet]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Breakfast [continental]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🍴</span>
                      <span className="amenity-text">Breakfast [free]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Breakfast service</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Buffet in restaurant</span>
                    </div>
                    {showAllAmenities && (
                      <>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Chinese cuisine in restaurant</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Coffee/tea in restaurant</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">☕</span>
                          <span className="amenity-text">Coffee shop</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Desserts in restaurant</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Fruits/snacks</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Halal breakfast</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">International cuisine in restaurant</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🍳</span>
                          <span className="amenity-text">Kitchen</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🍽️</span>
                          <span className="amenity-text">Restaurant [halal]</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Restaurant breakfast</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Restaurant dinner</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Restaurant lunch</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🍴</span>
                          <span className="amenity-text">Restaurants</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Room service [24-hour]</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Salad in restaurant</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Soup in restaurant</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Vegetarian restaurant</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Western breakfast</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Western cuisine in restaurant</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="amenities-column">
                <div className="amenity-category">
                  <h3 className="amenity-category-title">Services and conveniences</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Air conditioning in public area</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🛎️</span>
                      <span className="amenity-text">Concierge</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Contactless check-in/out</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🧹</span>
                      <span className="amenity-text">Daily housekeeping</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">👔</span>
                      <span className="amenity-text">Dry cleaning</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🛗</span>
                      <span className="amenity-text">Elevator</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">♿</span>
                      <span className="amenity-text">Facilities for disabled guests</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Food delivery</span>
                    </div>
                    {showAllAmenities && (
                      <>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Grooming service</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Invoice provided</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Ironing service</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🧺</span>
                          <span className="amenity-text">Laundromat</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🧺</span>
                          <span className="amenity-text">Laundry service</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🧳</span>
                          <span className="amenity-text">Luggage storage</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Meetings</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Meeting stationery</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">📮</span>
                          <span className="amenity-text">Postal service</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">📽️</span>
                          <span className="amenity-text">Projector/LED display</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🔒</span>
                          <span className="amenity-text">Safety deposit boxes</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Shared lounge/TV area</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🚭</span>
                          <span className="amenity-text">Smoke-free property</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🚬</span>
                          <span className="amenity-text">Smoking area</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">📠</span>
                          <span className="amenity-text">Xerox/fax in business center</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {showAllAmenities && (
                  <>
                    <div className="amenity-category">
                      <h3 className="amenity-category-title">Access</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">📹</span>
                      <span className="amenity-text">CCTV in common areas</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">📹</span>
                      <span className="amenity-text">CCTV outside property</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Check-in/out [express]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Check-in/out [private]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🏨</span>
                      <span className="amenity-text">Check-in [24-hour]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🧯</span>
                      <span className="amenity-text">Fire extinguisher</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🏨</span>
                      <span className="amenity-text">Front desk [24-hour]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🏨</span>
                      <span className="amenity-text">Hotel chain</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🚭</span>
                      <span className="amenity-text">Non-smoking rooms</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon" style={{opacity: 0.4}}>🐾</span>
                      <span className="amenity-text" style={{opacity: 0.4}}>Pets allowed</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Safety/security feature</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🔒</span>
                      <span className="amenity-text">Security [24-hour]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🚨</span>
                      <span className="amenity-text">Smoke alarms</span>
                    </div>
                  </div>
                </div>

                <div className="amenity-category">
                  <h3 className="amenity-category-title">Getting around</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">✈️</span>
                      <span className="amenity-text">Airport transfer</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🚲</span>
                      <span className="amenity-text">Bicycle parking</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🅿️</span>
                      <span className="amenity-text">Car park [free of charge]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🅿️</span>
                      <span className="amenity-text">Car park [on-site]</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🚗</span>
                      <span className="amenity-text">Rental car</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🚐</span>
                      <span className="amenity-text">Shuttle service</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🚕</span>
                      <span className="amenity-text">Taxi service</span>
                    </div>
                  </div>
                </div>
                  </>
                )}
              </div>

              {/* Column 4 */}
              <div className="amenities-column">
                <div className="amenity-category">
                  <h3 className="amenity-category-title">Cleanliness and safety</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Anti-viral cleaning products</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🌡️</span>
                      <span className="amenity-text">Body thermometer</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Breakfast in room</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Breakfast takeaway service</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Cashless payment service</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      <span className="amenity-text">Daily disinfection in all rooms</span>
                    </div>
                    {showAllAmenities && (
                      <>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Daily disinfection in common areas</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">😷</span>
                          <span className="amenity-text">Face coverings on staff</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🩹</span>
                          <span className="amenity-text">First aid kit</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">😷</span>
                          <span className="amenity-text">Free face masks</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Guest rooms seal after sanitization</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🧴</span>
                          <span className="amenity-text">Hand sanitizer</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Hotel room service app</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Hot water linen and laundry washing</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Hygiene certification</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Individually-wrapped food options</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Physical distancing of at least 1 meter</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Professional-grade sanitizing services</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Protective screens in common areas</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Room sanitization opt-out available</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Rooms sanitized between stays</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Safe dining setup</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Sanitized kitchen and tableware items</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Shared stationery removed</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Staff trained in safety protocol</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Sterilizing equipment</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">✓</span>
                          <span className="amenity-text">Temperature check for guests and staff</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {showAllAmenities && (
                  <div className="amenity-category">
                    <h3 className="amenity-category-title">Available in all rooms</h3>
                  <div className="amenity-list">
                    <div className="amenity-item">
                      <span className="amenity-icon">❄️</span>
                      <span className="amenity-text">Air conditioning</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">⏰</span>
                      <span className="amenity-text">Alarm clock</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🛋️</span>
                      <span className="amenity-text">Carpeting</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">☕</span>
                      <span className="amenity-text">Coffee/tea maker</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🏋️</span>
                      <span className="amenity-text">Fitness club privileges</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">💧</span>
                      <span className="amenity-text">Free bottled water</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">💨</span>
                      <span className="amenity-text">Hair dryer</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">🔒</span>
                      <span className="amenity-text">In-room safe box</span>
                    </div>
                    <div className="amenity-item">
                      <span className="amenity-icon">📶</span>
                      <span className="amenity-text">Internet access – wireless</span>
                    </div>
                    {showAllAmenities && (
                      <>
                        <div className="amenity-item">
                          <span className="amenity-icon">🔌</span>
                          <span className="amenity-text">Ironing facilities</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">💻</span>
                          <span className="amenity-text">Laptop safe box</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🛏️</span>
                          <span className="amenity-text">Linens</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🪞</span>
                          <span className="amenity-text">Mirror</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🚭</span>
                          <span className="amenity-text">Non-smoking</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">📺</span>
                          <span className="amenity-text">Satellite/cable channels</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🪑</span>
                          <span className="amenity-text">Seating area</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🚿</span>
                          <span className="amenity-text">Shower</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🥿</span>
                          <span className="amenity-text">Slippers</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🚨</span>
                          <span className="amenity-text">Smoke detector</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">📞</span>
                          <span className="amenity-text">Telephone</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">🚽</span>
                          <span className="amenity-text">Toiletries</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">⏰</span>
                          <span className="amenity-text">Wake-up service</span>
                        </div>
                        <div className="amenity-item">
                          <span className="amenity-icon">📶</span>
                          <span className="amenity-text">Wi-Fi [free]</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                )}
              </div>
            </div>
            
            {/* Read More / Read Less Link */}
            <div className="amenities-read-more-container">
              <button 
                className="amenities-read-more-link"
                onClick={() => setShowAllAmenities(!showAllAmenities)}
              >
                {showAllAmenities ? 'Read less' : 'Read more'}
              </button>
            </div>
          </div>
        </section>

        {/* Food & Dining Section */}
        <section id="food-and-dining" className="tab-section">
          <div className="tab-section-container">
            <h2 className="food-dining-title">Food & Dining</h2>
            
            <div className="restaurant-card">
              <div className="restaurant-header">
                <h3 className="restaurant-name">Kitchen District (Casual Dining)</h3>
              </div>
              
              <div className="restaurant-details">
                <div className="restaurant-detail-row">
                  <div className="detail-icon veg-icon">●</div>
                  <span className="detail-text">Both Vegetarian & Non-Vegetarian food</span>
                </div>
                
                <div className="restaurant-detail-row">
                  <div className="detail-icon clock-icon">🕐</div>
                  <span className="detail-text">
                    Breakfast <strong>07:00 AM - 10:30 AM</strong> | Lunch <strong>12:30 PM - 03:00 PM</strong> | Dinner <strong>07:30 PM - 11:00 PM</strong>
                  </span>
                </div>
                
                <div className="restaurant-detail-row">
                  <div className="detail-icon cuisine-icon">🍴</div>
                  <span className="detail-text">
                    Cuisines: North Indian, South Indian, Chinese, Continental, Mughlai, Italian, Other Local Cuisines
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guest Reviews Section */}
        <section id="guest-reviews" className="tab-section">
          <div className="tab-section-container">
            <h2 className="tab-section-title">Choose Room</h2>
            <div className="tab-section-content">
              <p>Guest reviews content goes here...</p>
            </div>
          </div>
        </section>


        {/* Location Section */}
        <section id="location" className="tab-section">
          <div className="tab-section-container">
            <div className="location-header">
              <h2 className="location-title">Location of {bookingData.hotelName || "Hyatt Centric Janakpuri, New Delhi"}</h2>
              <div className="location-address">
                <FaMapMarkerAlt className="location-address-icon" />
                <span className="location-address-text">
                  {bookingData.hotelAddress || "Janakpuri District Centre Complex, New Delhi, Delhi, India, 110058"}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="location-search-container">
              <div className="location-search-bar">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search Area, Landmark or Transit nearby"
                  className="location-search-input"
                />
              </div>
            </div>

            {/* Map and Landmarks Layout */}
            <div className="location-content-grid">
              {/* Left: Map Section */}
              <div className="location-map-container">
                <div className="map-controls-overlay">
                  <button className="map-control-btn">SHOW ALL NEARBY PLACES</button>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0853!2d77.0856!3d28.6219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzE4LjgiTiA3N8KwMDUnMDguMiJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="500"
                  style={{ border: 0, borderRadius: '12px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Location Map"
                ></iframe>
              </div>

              {/* Right: Landmarks Panel */}
              <div className="location-landmarks-panel">
                {/* Key Landmarks */}
                <div className="landmark-section">
                  <div className="landmark-section-header" onClick={() => setShowKeyLandmarks(!showKeyLandmarks)}>
                    <div className="landmark-header-left">
                      <span className="landmark-icon">📍</span>
                      <h3 className="landmark-section-title">Key Landmarks</h3>
                    </div>
                    <FaChevronDown className={`landmark-toggle-icon ${showKeyLandmarks ? 'expanded' : ''}`} />
                  </div>
                  {showKeyLandmarks && (
                    <div className="landmark-items">
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">Janakpuri West Metro Station</span>
                            <span className="landmark-category">Metro Station</span>
                          </div>
                        </div>
                        <span className="landmark-distance">0.2km</span>
                      </div>
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">Tilak Nagar Metro Station</span>
                            <span className="landmark-category">Metro Station</span>
                          </div>
                        </div>
                        <span className="landmark-distance">3.3km</span>
                      </div>
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">Red Fort</span>
                            <span className="landmark-category">Tourist Attraction</span>
                          </div>
                        </div>
                        <span className="landmark-distance">18.6km</span>
                      </div>
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">India Gate</span>
                            <span className="landmark-category">Tourist Attraction</span>
                          </div>
                        </div>
                        <span className="landmark-distance">19.2km</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attractions */}
                <div className="landmark-section">
                  <div className="landmark-section-header" onClick={() => setShowAttractions(!showAttractions)}>
                    <div className="landmark-header-left">
                      <span className="landmark-icon">📍</span>
                      <h3 className="landmark-section-title">Attractions</h3>
                    </div>
                    <FaChevronDown className={`landmark-toggle-icon ${showAttractions ? 'expanded' : ''}`} />
                  </div>
                  {showAttractions && (
                    <div className="landmark-items">
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">Qutub Minar</span>
                            <span className="landmark-category">Tourist Attraction</span>
                          </div>
                        </div>
                        <span className="landmark-distance">12.5km</span>
                      </div>
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">Lotus Temple</span>
                            <span className="landmark-category">Tourist Attraction</span>
                          </div>
                        </div>
                        <span className="landmark-distance">15.8km</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Transport */}
                <div className="landmark-section">
                  <div className="landmark-section-header" onClick={() => setShowTransport(!showTransport)}>
                    <div className="landmark-header-left">
                      <span className="landmark-icon">📍</span>
                      <h3 className="landmark-section-title">Transport</h3>
                    </div>
                    <FaChevronDown className={`landmark-toggle-icon ${showTransport ? 'expanded' : ''}`} />
                  </div>
                  {showTransport && (
                    <div className="landmark-items">
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">Indira Gandhi International Airport</span>
                            <span className="landmark-category">Airport</span>
                          </div>
                        </div>
                        <span className="landmark-distance">8.2km</span>
                      </div>
                      <div className="landmark-item">
                        <div className="landmark-item-left">
                          <span className="landmark-bullet">•</span>
                          <div className="landmark-item-content">
                            <span className="landmark-name">New Delhi Railway Station</span>
                            <span className="landmark-category">Railway Station</span>
                          </div>
                        </div>
                        <span className="landmark-distance">14.3km</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Guest- REview  Section */}
        <section id="similar-properties" className="tab-section">
          <div className="tab-section-container">
            <h2 className="tab-section-title">Guest Reviews</h2>
            <div className="tab-section-content">
              <p>Similar properties content goes here...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HotelBooking;
