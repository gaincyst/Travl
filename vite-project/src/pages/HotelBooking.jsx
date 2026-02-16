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
import AuthModal from "../components/AuthModal";
import Footer from "../components/Footer";
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
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomModalImageIndex, setRoomModalImageIndex] = useState(0);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPropertyInfoPanelOpen, setIsPropertyInfoPanelOpen] = useState(false);
  const [selectedRoomData, setSelectedRoomData] = useState(null);
  const [showMoreBenefits, setShowMoreBenefits] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [showGSTDetails, setShowGSTDetails] = useState(false);

  // Panel view state management ('guest-details' or 'review-booking')
  const [panelView, setPanelView] = useState('guest-details');
  
  // Guest form data state
  const [guestFormData, setGuestFormData] = useState([]);
  const [visibleGuestForms, setVisibleGuestForms] = useState(1);
  
  // Pincode and state data
  const [pincodeStateData, setPincodeStateData] = useState({
    billingAddress: '',
    pincode: '',
    state: 'Uttar Pradesh'
  });
  
  // Confirmation and success modal states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const totalAdults = bookingData.adults || 2;
  const totalChildren = bookingData.children || 0;

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
    // Scroll to tab navigation area
    const tabNavigation = document.querySelector('.tab-navigation-container');
    if (tabNavigation) {
      const offset = 90; // Account for navbar height
      const elementPosition = tabNavigation.getBoundingClientRect().top;
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

  // Near your other useState hooks



// Update your room selection handler
const handleSelectRoom = (room) => {
  console.log('Room selected:', room);
  setSelectedRoomData(room);
  setIsPropertyInfoPanelOpen(true);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'; // Disable background scroll
  }
};

const closePanel = () => {
  setIsPropertyInfoPanelOpen(false);
  setSelectedRoomData(null);
  setShowMoreBenefits(false);
  setShowPriceDetails(false);
  setPanelView('guest-details'); // Reset to guest details
  setVisibleGuestForms(1); // Reset visible forms
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto'; // Enable scroll
  }
};

// Handle Continue button click
const handlePanelContinue = () => {
  if (panelView === 'guest-details') {
    // Capture guest form data from DOM
    const guestData = [];
    for (let i = 0; i < visibleGuestForms; i++) {
      const titleInput = document.querySelector(`.guest-form-${i} select[name="title"]`);
      const firstNameInput = document.querySelector(`.guest-form-${i} input[name="firstName"]`);
      const lastNameInput = document.querySelector(`.guest-form-${i} input[name="lastName"]`);
      const emailInput = document.querySelector(`.guest-form-${i} input[name="email"]`);
      const mobileInput = document.querySelector(`.guest-form-${i} input[name="mobile"]`);
      
      guestData.push({
        title: titleInput?.value || 'Mr',
        firstName: firstNameInput?.value || '',
        lastName: lastNameInput?.value || '',
        email: emailInput?.value || '',
        mobile: mobileInput?.value || ''
      });
    }
    setGuestFormData(guestData);
    
    // Capture pincode and state data from DOM
    const billingAddressInput = document.querySelector('.pincode-state-section input[placeholder="Enter Billing Address"]');
    const pincodeInput = document.querySelector('.pincode-state-section input[placeholder="Enter Pincode"]');
    const stateSelect = document.querySelector('.pincode-state-section select.input-select');
    
    setPincodeStateData({
      billingAddress: billingAddressInput?.value || '',
      pincode: pincodeInput?.value || '',
      state: stateSelect?.value || 'Uttar Pradesh'
    });
    
    setPanelView('review-booking');
  } else if (panelView === 'review-booking') {
    // Show confirmation modal
    setShowConfirmationModal(true);
  }
};

// Handle booking confirmation
const handleConfirmHotelBooking = () => {
  setShowConfirmationModal(false);
  setShowSuccessModal(true);
};

// Handle cancel booking
const handleCancelBooking = () => {
  setShowConfirmationModal(false);
};

// Handle success modal close and navigate to home
const handleSuccessClose = () => {
  setShowSuccessModal(false);
  closePanel();
  navigate('/');
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

            <div className="login-signup" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>
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
                  <button className="view-room-options-btn" onClick={() => scrollToSection("Choose Rooms")}>
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
        {activeTab === "Description" && (
        <section id="description" className="tab-section">
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
                        <FaMapMarkerAlt className="landmark-icons" />
                        <span className="landmark-name">Qutub Minar</span>
                        <span className="landmarks-distance">17.3 km</span>
                      </div>
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icons" />
                        <span className="landmark-name">Lotus Temple</span>
                        <span className="landmarks-distance">25.1 km</span>
                      </div>
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icons" />
                        <span className="landmark-name">Lodhi Garden</span>
                        <span className="landmarks-distance">25.5 km</span>
                      </div>
                    
                    </div>
                  </div>

                  {/* Closest Landmarks */}
                  <div className="landmarks-section">
                    <h3 className="landmarks-title">Closest landmarks</h3>
                    <div className="landmarks-list">
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icons" />
                        <span className="landmark-name">Block B Market</span>
                        <span className="landmarks-distance">770 m</span>
                      </div>
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icons" />
                        <span className="landmark-name">kunaic mandi mart</span>
                        <span className="landmarks-distance">1.0 km</span>
                      </div>
                      
                      <div className="landmark-item">
                        <FaMapMarkerAlt className="landmark-icons" />
                        <span className="landmark-name">Imperia Towers Park</span>
                        <span className="landmarks-distance">1.1 km</span>
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
        )}

       {/* Gallery Section */}
       {activeTab === "Gallery" && (
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
        )}

        {/* Amenities Section */}
        {activeTab === "Amenities" && (
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
        )}

        {/* Food & Dining Section */}
        {activeTab === "Food & Dining" && (
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
        )}

        {/* Choose Room Section */}
        {activeTab === "Choose Rooms" && (
        <section id="choose-rooms" className="tab-section">
          <div className="tab-section-container">
            {/* Header Row */}
            <div className="room-options-header">
              <div className="room-types-dropdown">
                <span>8 Room Types</span>
                <FaChevronDown />
              </div>
              <div className="room-header-columns">
                <span className="room-header-col">Room Options</span>
                <span className="room-header-col">Price</span>
              </div>
            </div>

            {/* Room Cards */}
            <div className="room-cards-container">
              {/* Room Card 1 - 2 TWIN BEDS */}
              <div className="room-card">
                <div className="room-card-left">
                  <h3 className="room-type-title">2 TWIN BEDS</h3>
                  <div className="room-image-container" onClick={() => {
                    setSelectedRoom({
                      name: 'TWIN SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh1.jpeg', '/public/hotels/hhh6.jpeg', '/public/hotels/hhh3.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }} style={{ cursor: 'pointer' }}>
                    <img src="/public/hotels/hhh1.jpeg" alt="2 Twin Beds Room" className="room-image" />
                    <div className="room-photos-overlay">
                      <span>+6 Photos</span>
                      <FaChevronRight />
                    </div>
                  </div>
                  <div className="room-specs">
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🏠</span>
                      <span>355 sq.ft (33 sq.mt)</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🖼️</span>
                      <span>City View</span>
                    </div>
                    <div className="room-spec-item">
                      <FaBed className="room-spec-icon-bed" />
                      <span>2 x Single Bed</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🚿</span>
                      <span>1 Bathroom</span>
                    </div>
                  </div>
                  <a href="#" className="view-more-details" onClick={(e) => {
                    e.preventDefault();
                    setSelectedRoom({
                      name: 'TWIN SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh1.jpeg', '/public/hotels/hhh6.jpeg', '/public/hotels/hhh3.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }}>View More Details</a>
                </div>

                <div className="room-card-middle">
                  {/* Room Plan 1 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">1. Room With Free Cancellation</h4>
                    <div className="room-plan-book-badge">
                      <span className="book-badge-icon">💰</span>
                      <div>
                        <span className="book-badge-text">Book @ ₹0 available</span>
                        <span className="book-badge-subtext">Risk Free Booking!</span>
                      </div>
                    </div>
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Standard Rate</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ ...selectedPlan, title: "Room With Free Cancellation", roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>

                  {/* Room Plan 2 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">2. Free Breakfast | Free Cancellation</h4>
                    <div className="room-plan-book-badge">
                      <span className="book-badge-icon">💰</span>
                      <div>
                        <span className="book-badge-text">Book @ ₹0 available</span>
                        <span className="book-badge-subtext">Risk Free Booking!</span>
                      </div>
                    </div>
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Complimentary Breakfast</li>
                      <li>Bed and Breakfast</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ ...selectedPlan, title: "Free Breakfast | Free Cancellation", roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>
                </div>
                {/* Find this button in your room card mapping/rendering section */}


                <div className="room-card-right">
                  {/* Price Block 1 */}
                  <div className="room-price-block">
                    <div className="room-price">₹11,490</div>
                    <div className="room-taxes">+ ₹ 2,068 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn"
                     onClick={() => handleSelectRoom({
                      name: 'TWIN SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh1.jpeg', '/public/hotels/hhh6.jpeg', '/public/hotels/hhh3.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })} >
                      SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>

                  {/* Price Block 2 */}
                  <div className="room-price-block">
                    <div className="room-price">₹13,090</div>
                    <div className="room-taxes">+ ₹ 2,356 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: 'TWIN SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh1.jpeg', '/public/hotels/hhh6.jpeg', '/public/hotels/hhh3.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>
                </div>
              </div>

              {/* Room Card 2 - 1 KING BED */}
              <div className="room-card">
                <div className="room-card-left">
                  <h3 className="room-type-title">1 KING BED</h3>
                  <div className="room-image-container" onClick={() => {
                    setSelectedRoom({
                      name: '1 KING BED',
                      size: '355 sq.ft (33 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh2.jpeg', '/public/hotels/hhh4.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }} style={{ cursor: 'pointer' }}>
                    <img src="/public/hotels/hhh2.jpeg" alt="1 King Bed Room" className="room-image" />
                    <div className="room-photos-overlay">
                      <span>+6 Photos</span>
                      <FaChevronRight />
                    </div>
                  </div>
                  <div className="room-specs">
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🏠</span>
                      <span>355 sq.ft (33 sq.mt)</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🖼️</span>
                      <span>City View</span>
                    </div>
                    <div className="room-spec-item">
                      <FaBed className="room-spec-icon-bed" />
                      <span>King Bed</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🚿</span>
                      <span>1 Bathroom</span>
                    </div>
                  </div>
                  <a href="#" className="view-more-details" onClick={(e) => {
                    e.preventDefault();
                    setSelectedRoom({
                      name: '1 KING BED',
                      size: '355 sq.ft (33 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh2.jpeg', '/public/hotels/hhh4.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }}>View More Details</a>
                </div>

                <div className="room-card-middle">
                  {/* Room Plan 1 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">1. Room Only | Free Cancellation</h4>
                    
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Standard Rate</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>

                  {/* Room Plan 2 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">2. Free Breakfast | Free Cancellation</h4>
                    
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Complimentary Breakfast</li>
                      <li>Bed and Breakfast</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>
                </div>

                <div className="room-card-right">
                  {/* Price Block 1 */}
                  <div className="room-price-block">
                    <div className="room-price">₹11,490</div>
                    <div className="room-taxes">+ ₹ 2,068 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: '1 KING BED',
                      size: '355 sq.ft (33 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh2.jpeg', '/public/hotels/hhh4.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>

                  {/* Price Block 2 */}
                  <div className="room-price-block">
                    <div className="room-price">₹13,090</div>
                    <div className="room-taxes">+ ₹ 2,356 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: '1 KING BED',
                      size: '355 sq.ft (33 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh2.jpeg', '/public/hotels/hhh4.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>
                </div>
              </div>

              {/* Room Card 3 - DELUXE ROOM */}
              <div className="room-card">
                <div className="room-card-left">
                  <h3 className="room-type-title">DELUXE ROOM</h3>
                  <div className="room-image-container" onClick={() => {
                    setSelectedRoom({
                      name: 'DELUXE ROOM',
                      size: '400 sq.ft (37 sq.mt)',
                      view: 'City View',
                      bed: 'Queen Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh7.jpeg', '/public/hotels/hhh3.jpeg', '/public/hotels/hhh6.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }} style={{ cursor: 'pointer' }}>
                    <img src="/public/hotels/hhh7.jpeg" alt="Deluxe Room" className="room-image" />
                    <div className="room-photos-overlay">
                      <span>+6 Photos</span>
                      <FaChevronRight />
                    </div>
                  </div>
                  <div className="room-specs">
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🏠</span>
                      <span>400 sq.ft (37 sq.mt)</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🖼️</span>
                      <span>City View</span>
                    </div>
                    <div className="room-spec-item">
                      <FaBed className="room-spec-icon-bed" />
                      <span>Queen Bed</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🚿</span>
                      <span>1 Bathroom</span>
                    </div>
                  </div>
                  <a href="#" className="view-more-details" onClick={(e) => {
                    e.preventDefault();
                    setSelectedRoom({
                      name: 'DELUXE ROOM',
                      size: '400 sq.ft (37 sq.mt)',
                      view: 'City View',
                      bed: 'Queen Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh7.jpeg', '/public/hotels/hhh3.jpeg', '/public/hotels/hhh6.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }}>View More Details</a>
                </div>

                <div className="room-card-middle">
                  {/* Room Plan 1 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">1. Room Only | Free Cancellation</h4>
                    <div className="room-plan-book-badge">
                      <span className="book-badge-icon">💰</span>
                      <div>
                        <span className="book-badge-text">Book @ ₹0 available</span>
                        <span className="book-badge-subtext">Risk Free Booking!</span>
                      </div>
                    </div>
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Standard Rate</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>

                  {/* Room Plan 2 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">2. Free Breakfast | Free Cancellation</h4>
                    <div className="room-plan-book-badge">
                      <span className="book-badge-icon">💰</span>
                      <div>
                        <span className="book-badge-text">Book @ ₹0 available</span>
                        <span className="book-badge-subtext">Risk Free Booking!</span>
                      </div>
                    </div>
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Complimentary Breakfast</li>
                      <li>Bed and Breakfast</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>
                </div>

                <div className="room-card-right">
                  {/* Price Block 1 */}
                  <div className="room-price-block">
                    <div className="room-price">₹12,890</div>
                    <div className="room-taxes">+ ₹ 2,320 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: 'DELUXE ROOM',
                      size: '400 sq.ft (37 sq.mt)',
                      view: 'City View',
                      bed: 'Queen Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh7.jpeg', '/public/hotels/hhh3.jpeg', '/public/hotels/hhh6.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>

                  {/* Price Block 2 */}
                  <div className="room-price-block">
                    <div className="room-price">₹14,590</div>
                    <div className="room-taxes">+ ₹ 2,626 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: 'DELUXE ROOM',
                      size: '400 sq.ft (37 sq.mt)',
                      view: 'City View',
                      bed: 'Queen Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh7.jpeg', '/public/hotels/hhh3.jpeg', '/public/hotels/hhh6.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>
                </div>
              </div>

              {/* Room Card 4 - EXECUTIVE SUITE */}
              <div className="room-card">
                <div className="room-card-left">
                  <h3 className="room-type-title">EXECUTIVE SUITE</h3>
                  <div className="room-image-container" onClick={() => {
                    setSelectedRoom({
                      name: 'EXECUTIVE SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh8.jpeg', '/public/hotels/hhh4.jpeg', '/public/hotels/hhh9.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }} style={{ cursor: 'pointer' }}>
                    <img src="/public/hotels/hhh8.jpeg" alt="Executive Suite" className="room-image" />
                    <div className="room-photos-overlay">
                      <span>+6 Photos</span>
                      <FaChevronRight />
                    </div>
                  </div>
                  <div className="room-specs">
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🏠</span>
                      <span>550 sq.ft (51 sq.mt)</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🖼️</span>
                      <span>City View</span>
                    </div>
                    <div className="room-spec-item">
                      <FaBed className="room-spec-icon-bed" />
                      <span>King Bed</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🚿</span>
                      <span>1 Bathroom</span>
                    </div>
                  </div>
                  <a href="#" className="view-more-details" onClick={(e) => {
                    e.preventDefault();
                    setSelectedRoom({
                      name: 'EXECUTIVE SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh1.jpeg', '/public/hotels/hhh2.jpeg', '/public/hotels/hhh3.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }}>View More Details</a>
                </div>

                <div className="room-card-middle">
                  {/* Room Plan 1 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">1. Suite With Free Cancellation</h4>
                    
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Standard Rate</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>

                  {/* Room Plan 2 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">2. Free Breakfast | Free Cancellation</h4>
                    
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Complimentary Breakfast</li>
                      <li>Bed and Breakfast</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>
                </div>

                <div className="room-card-right">
                  {/* Price Block 1 */}
                  <div className="room-price-block">
                    <div className="room-price">₹16,990</div>
                    <div className="room-taxes">+ ₹ 3,058 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: 'EXECUTIVE SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh8.jpeg', '/public/hotels/hhh4.jpeg', '/public/hotels/hhh9.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>

                  {/* Price Block 2 */}
                  <div className="room-price-block">
                    <div className="room-price">₹18,790</div>
                    <div className="room-taxes">+ ₹ 3,382 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: 'EXECUTIVE SUITE',
                      size: '450 sq.ft (42 sq.mt)',
                      view: 'City View',
                      bed: 'King Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh8.jpeg', '/public/hotels/hhh4.jpeg', '/public/hotels/hhh9.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>
                </div>
              </div>

              {/* Room Card 5 - PREMIUM TWIN */}
              <div className="room-card">
                <div className="room-card-left">
                  <h3 className="room-type-title">PREMIUM TWIN</h3>
                  <div className="room-image-container" onClick={() => {
                    setSelectedRoom({
                      name: 'PREMIUM TWIN',
                      size: '380 sq.ft (35 sq.mt)',
                      view: 'City View',
                      bed: '2 x Single Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh9.jpeg', '/public/hotels/hhh1.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }} style={{ cursor: 'pointer' }}>
                    <img src="/public/hotels/hhh9.jpeg" alt="Premium Twin Room" className="room-image" />
                    <div className="room-photos-overlay">
                      <span>+6 Photos</span>
                      <FaChevronRight />
                    </div>
                  </div>
                  <div className="room-specs">
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🏠</span>
                      <span>380 sq.ft (35 sq.mt)</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🖼️</span>
                      <span>City View</span>
                    </div>
                    <div className="room-spec-item">
                      <FaBed className="room-spec-icon-bed" />
                      <span>2 x Single Bed</span>
                    </div>
                    <div className="room-spec-item">
                      <span className="room-spec-icon">🚿</span>
                      <span>1 Bathroom</span>
                    </div>
                  </div>
                  <a href="#" className="view-more-details" onClick={(e) => {
                    e.preventDefault();
                    setSelectedRoom({
                      name: 'PREMIUM TWIN',
                      size: '380 sq.ft (35 sq.mt)',
                      view: 'City View',
                      bed: '2 x Single Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh9.jpeg', '/public/hotels/hhh1.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                    });
                    setRoomModalImageIndex(0);
                    setShowRoomModal(true);
                  }}>View More Details</a>
                </div>

                <div className="room-card-middle">
                  {/* Room Plan 1 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">1. Room With Free Cancellation</h4>
                    
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Standard Rate</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>

                  {/* Room Plan 2 */}
                  <div className="room-plan">
                    <h4 className="room-plan-title">2. Free Breakfast | Free Cancellation</h4>
                    
                    <ul className="room-plan-benefits">
                      <li>Book @ ₹0 available</li>
                      <li>20% discount on a la carte menu and soft beverages at Kitchen District.</li>
                      <li>Complimentary Breakfast</li>
                      <li>Bed and Breakfast</li>
                    </ul>
                    <div className="room-plan-cancellation">
                      <span className="cancellation-check">✓</span>
                      <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                    </div>
                    <a href="#" className="view-plan-details" onClick={(e) => { e.preventDefault(); setSelectedPlan({ title: 'Free Breakfast | Free Cancellation', roomType: '1 KING BED' }); setShowPlanModal(true); }}>View plan details & policies</a>
                  </div>
                </div>

                <div className="room-card-right">
                  {/* Price Block 1 */}
                  <div className="room-price-block">
                    <div className="room-price">₹12,190</div>
                    <div className="room-taxes">+ ₹ 2,194 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: 'PREMIUM TWIN',
                      size: '380 sq.ft (35 sq.mt)',
                      view: 'City View',
                      bed: '2 x Single Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh9.jpeg', '/public/hotels/hhh1.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>

                  {/* Price Block 2 */}
                  <div className="room-price-block">
                    <div className="room-price">₹13,890</div>
                    <div className="room-taxes">+ ₹ 2,500 taxes & fees</div>
                    <div className="room-per-night">Per Night</div>
                    <button className="select-room-btn" onClick={() => handleSelectRoom({
                      name: 'PREMIUM TWIN',
                      size: '380 sq.ft (35 sq.mt)',
                      view: 'City View',
                      bed: '2 x Single Bed',
                      bathroom: '1 Bathroom',
                      images: ['/public/hotels/hhh9.jpeg', '/public/hotels/hhh1.jpeg', '/public/hotels/hhh5.jpeg'],
                      description: 'Your discovery of Delhi starts from this chic and spacious room that puts you in the middle of the action in West Delhi'
                     })}>SELECT ROOM</button>
                    <div className="room-login-prompt" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>Login Now to unlock best deals and offers!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

     

        {/* Location Section */}
        {activeTab === "Location" && (
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
        )}

        {/* Guest Reviews Section */}
        {activeTab === "Guest Reviews" && (
        <section id="guest-reviews" className="tab-section">
          <div className="tab-section-container">
            {/* Reviews Header */}
            <div className="reviews-header">
              <h2 className="reviews-main-title">
                Guest Reviews & Rating for {bookingData.hotelName || "Hyatt Centric Janakpuri, New Delhi"}
              </h2>
              <div className="reviews-sort">
                <span className="reviews-sort-label">Sort By:</span>
                <select className="reviews-sort-dropdown">
                  <option>Latest first</option>
                  <option>Highest rated</option>
                  <option>Lowest rated</option>
                </select>
              </div>
            </div>

            {/* Top Summary Area */}
            <div className="reviews-summary-area">
              {/* Left - Overall Rating Box */}
              <div className="reviews-rating-card">
                <div className="rating-card-label">goRating</div>
                <div className="rating-card-score">3.7<span className="rating-card-max">/5</span></div>
                <div className="rating-card-info">
                  <div className="rating-card-count">763 Ratings</div>
                  <div className="rating-card-reviews">151 Reviews</div>
                </div>
              </div>

              {/* Middle - Star Rating Distribution */}
              <div className="reviews-distribution">
                <div className="distribution-row">
                  <span className="distribution-label">5 <FaStar className="distribution-star" /></span>
                  <div className="distribution-bar-container">
                    <div className="distribution-bar distribution-bar-5" style={{ width: '40%' }}></div>
                  </div>
                  <span className="distribution-count">298</span>
                </div>
                <div className="distribution-row">
                  <span className="distribution-label">4 <FaStar className="distribution-star" /></span>
                  <div className="distribution-bar-container">
                    <div className="distribution-bar distribution-bar-4" style={{ width: '18%' }}></div>
                  </div>
                  <span className="distribution-count">132</span>
                </div>
                <div className="distribution-row">
                  <span className="distribution-label">3 <FaStar className="distribution-star" /></span>
                  <div className="distribution-bar-container">
                    <div className="distribution-bar distribution-bar-3" style={{ width: '19%' }}></div>
                  </div>
                  <span className="distribution-count">144</span>
                </div>
                <div className="distribution-row">
                  <span className="distribution-label">2 <FaStar className="distribution-star" /></span>
                  <div className="distribution-bar-container">
                    <div className="distribution-bar distribution-bar-2" style={{ width: '11%' }}></div>
                  </div>
                  <span className="distribution-count">80</span>
                </div>
                <div className="distribution-row">
                  <span className="distribution-label">1 <FaStar className="distribution-star" /></span>
                  <div className="distribution-bar-container">
                    <div className="distribution-bar distribution-bar-1" style={{ width: '15%' }}></div>
                  </div>
                  <span className="distribution-count">109</span>
                </div>
              </div>

              {/* Right - What our guests say */}
              <div className="reviews-guests-say">
                <h3 className="guests-say-title">What our guests say?</h3>
                <div className="guests-say-tags">
                  <span className="guest-tag guest-tag-positive">cooperative staff (19)</span>
                  <span className="guest-tag guest-tag-positive">spacious room (14)</span>
                  <span className="guest-tag guest-tag-negative">poor service (13)</span>
                  <span className="guest-tag guest-tag-negative">worst experience (12)</span>
                  <span className="guest-tag guest-tag-positive">fine stay (11)</span>
                  <span className="guest-tag guest-tag-positive">perfect location (9)</span>
                  <span className="guest-tag guest-tag-more">+ 6 more</span>
                </div>
              </div>
            </div>

            {/* Highlighted Review Section */}
            <div className="reviews-highlighted">
              <div className="highlighted-review-title">Bathroom Review:</div>
              <div className="highlighted-review-text">
                Clean, running water available, Smelled fresh and pleasant, No bugs, pests, or insects.
              </div>
              <div className="highlighted-review-images">
                <img src="/public/hotels/bath1.jpg" alt="Bathroom" className="highlighted-review-img" />
                <img src="/public/hotels/bath2.jpg" alt="Bathroom" className="highlighted-review-img" />
                <div className="highlighted-review-more">+5 more</div>
              </div>
            </div>

            {/* Individual Review Cards */}
            <div className="reviews-list">
              {/* Review Card 1 */}
              <div className="review-card">
                <div className="review-card-header">
                  <div className="review-user-info">
                    <div className="review-avatar">RB</div>
                    <div className="review-user-details">
                      <div className="review-user-name">Rahul Banjara <span className="review-stay-date">(Stayed 30 Jan, 2026)</span></div>
                      <div className="review-user-type">Family Traveller | 37 Reviews Written</div>
                    </div>
                  </div>
                  <div className="review-rating review-rating-5">5/5</div>
                </div>
                <div className="review-text">
                  great stay , nice hotel.
                </div>
              </div>

              {/* Review Card 2 */}
              <div className="review-card">
                <div className="review-card-header">
                  <div className="review-user-info">
                    <div className="review-avatar">MK</div>
                    <div className="review-user-details">
                      <div className="review-user-name">Manjeet Kaushik <span className="review-stay-date">(Stayed 21 Jan, 2026)</span></div>
                      <div className="review-user-type">Friends Traveller</div>
                    </div>
                  </div>
                  <div className="review-rating review-rating-1">1/5</div>
                </div>
                <div className="review-text">
                  seriously it's Hyatt I don't believe that's I check in yesterday near about 3:30 pm check in was good once I entered in the I called reception that it's hot in the room ac is not efficitive they told the hotel ac chiller is not working since morning 😡 I was surprised they place a fan in my room like seriously it's very disappointing
                </div>
              </div>

              {/* Review Card 3 */}
              <div className="review-card">
                <div className="review-card-header">
                  <div className="review-user-info">
                    <div className="review-avatar">PJ</div>
                    <div className="review-user-details">
                      <div className="review-user-name">Pankaj Jain <span className="review-stay-date">(Stayed 2 Oct, 2025)</span></div>
                      <div className="review-user-type">ALL Traveller | 1 Reviews Written</div>
                    </div>
                  </div>
                  <div className="review-rating review-rating-3">3/5</div>
                </div>
                <div className="review-text">
                  3
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="reviews-pagination">
              <button className="pagination-btn pagination-first">&lt;&lt;</button>
              <button className="pagination-btn pagination-prev">&lt;</button>
              <button className="pagination-btn pagination-number pagination-active">1</button>
              <button className="pagination-btn pagination-number">2</button>
              <button className="pagination-btn pagination-number">3</button>
              <button className="pagination-btn pagination-number">4</button>
              <button className="pagination-btn pagination-number">5</button>
              <button className="pagination-btn pagination-number">6</button>
              <button className="pagination-btn pagination-next">&gt;</button>
              <button className="pagination-btn pagination-last">&gt;&gt;</button>
            </div>
          </div>
        </section>
        )}

        {/* Property Policy Section */}
        {activeTab === "Property Policies" && (
        <section id="property-policies" className="tab-section">
          <div className="tab-section-container">
            <div className="property-policies-container">
              {/* Header with Title and Time Badges */}
              <div className="property-policies-header">
                <h2 className="property-policies-title">Property Policies</h2>
                <div className="property-time-badges">
                  <span className="time-badge">Check-in Time: <strong>2 PM</strong></span>
                  <span className="time-badge">Check-out Time: <strong>12 PM</strong></span>
                </div>
              </div>

              {/* Key Policies List */}
              <div className="property-policies-list">
                <div className="policy-item">
                  <div className="policy-icon-check">✓</div>
                  <span className="policy-text">Primary Guest should be atleast 18 years of age.</span>
                </div>
                <div className="policy-item">
                  <div className="policy-icon-check">✓</div>
                  <span className="policy-text">Passport, Aadhaar and Govt. ID are accepted as ID proof(s)</span>
                </div>
                <div className="policy-item">
                  <div className="policy-icon-check">✓</div>
                  <span className="policy-text">Pets are not allowed</span>
                </div>
                <div className="policy-item">
                  <div className="policy-icon-check">✓</div>
                  <span className="policy-text">Outside food is not allowed</span>
                </div>
                <div className="policy-item">
                  <div className="policy-icon-check">✓</div>
                  <span className="policy-text">Smoking within the premises is not allowed</span>
                </div>
              </div>

              {/* View All Link */}
              <div className="property-view-all-link" onClick={() => setShowPolicyModal(true)}>
                View all 22 property policies
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Property Policies Modal */}
        {showPolicyModal && (
          <div className="policy-modal-overlay" onClick={() => setShowPolicyModal(false)}>
            <div className="policy-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="policy-modal-header">
                <h2 className="policy-modal-title">Property Policies</h2>
                <button className="policy-modal-close" onClick={() => setShowPolicyModal(false)}>✕</button>
              </div>

              {/* Modal Body */}
              <div className="policy-modal-body">
                {/* Must Read Rules */}
                <div className="policy-modal-section">
                  <h3 className="policy-modal-section-title">Must Read Rules</h3>
                  <div className="policy-modal-list">
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Primary Guest should be atleast 18 years of age.</span>
                    </div>
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Passport, Aadhaar and Govt. ID are accepted as ID proof(s)</span>
                    </div>
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Pets are not allowed</span>
                    </div>
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Outside food is not allowed</span>
                    </div>
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Smoking within the premises is not allowed</span>
                    </div>
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Optional : Fee for buffet breakfast: approximately INR 899 per person|Early check-in is available for a fee (subject to availability)|Late check-out is available for a fee (subject to availability)|Crib (infant bed) fee: INR 1500.0 per night|Rollaway bed fee: INR 1500.0 per night</span>
                    </div>
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Extra-person charges may apply and vary depending on property policy|Government-issued photo identification and a credit card may be required at check-in for incidental charges|Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed|This property accepts credit cards; cash is not accepted|Please note that cultural norms and guest policies may differ by country and by property; the policies listed are provided by the property|This property does not permit outside food or liquor on the premises.</span>
                    </div>
                  </div>
                </div>

                {/* Guest Profile */}
                <div className="policy-modal-section">
                  <h3 className="policy-modal-section-title">Guest Profile</h3>
                  <div className="policy-modal-list">
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">✓</div>
                      <span>Unmarried couples allowed</span>
                    </div>
                  </div>
                </div>

                {/* Event/Party (Housing) */}
                <div className="policy-modal-section">
                  <h3 className="policy-modal-section-title">Event/Party (Housing)</h3>
                  <div className="policy-modal-list">
                    <div className="policy-modal-item">
                      <div className="policy-modal-icon">ⓘ</div>
                      <span>Events and parties are not allowed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Details Modal */}
        {showRoomModal && selectedRoom && (
          <div className="room-modal-overlay" onClick={() => setShowRoomModal(false)}>
            <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="room-modal-header">
                <h2 className="room-modal-title">{selectedRoom.name}</h2>
                <button className="room-modal-close" onClick={() => setShowRoomModal(false)}>✕</button>
              </div>

              {/* Modal Body - Two Column Layout */}
              <div className="room-modal-body">
                {/* Left Column - Image Gallery */}
                <div className="room-modal-left">
                  <div className="room-modal-image-container">
                    <img 
                      src={selectedRoom.images[roomModalImageIndex]} 
                      alt={selectedRoom.name}
                      className="room-modal-image"
                    />
                    {selectedRoom.images.length > 1 && (
                      <button 
                        className="room-modal-image-nav"
                        onClick={() => setRoomModalImageIndex((roomModalImageIndex + 1) % selectedRoom.images.length)}
                      >
                        <FaChevronRight />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column - Room Details */}
                <div className="room-modal-right">
                  {/* Room Meta Info */}
                  <div className="room-modal-meta">
                    <div className="room-modal-meta-item">
                      <span className="room-modal-meta-icon">🏠</span>
                      <span>{selectedRoom.size}</span>
                    </div>
                    <div className="room-modal-meta-item">
                      <span className="room-modal-meta-icon">🖼️</span>
                      <span>{selectedRoom.view}</span>
                    </div>
                    <div className="room-modal-meta-item">
                      <FaBed className="room-modal-meta-icon-bed" />
                      <span>{selectedRoom.bed}</span>
                    </div>
                    <div className="room-modal-meta-item">
                      <span className="room-modal-meta-icon">🚿</span>
                      <span>{selectedRoom.bathroom}</span>
                    </div>
                  </div>

                  {/* About the Room */}
                  <div className="room-modal-section">
                    <h3 className="room-modal-section-title">About the room</h3>
                    <p className="room-modal-description">{selectedRoom.description}</p>
                  </div>

                  {/* Amenities */}
                  <div className="room-modal-section">
                    <h3 className="room-modal-section-title">Amenities</h3>

                    {/* Signature Amenities */}
                    <div className="room-modal-amenity-group">
                      <h4 className="room-modal-amenity-group-title">Signature Amenities</h4>
                      <ul className="room-modal-amenity-list">
                        <li>Hairdryer</li>
                      </ul>
                    </div>

                    {/* Popular with Guests */}
                    <div className="room-modal-amenity-group">
                      <h4 className="room-modal-amenity-group-title">Popular with Guests</h4>
                      <ul className="room-modal-amenity-list room-modal-amenity-list-columns">
                        <li>Heater</li>
                        <li>Mineral Water</li>
                        <li>Laundry Service</li>
                        <li>Air Conditioning</li>
                        <li>Housekeeping</li>
                        <li>Iron/Ironing Board</li>
                        <li>Wi-Fi</li>
                        <li>Bathroom</li>
                        <li>Room Service</li>
                      </ul>
                    </div>

                    {/* Room Features */}
                    <div className="room-modal-amenity-group">
                      <h4 className="room-modal-amenity-group-title">Room Features</h4>
                      <ul className="room-modal-amenity-list room-modal-amenity-list-columns">
                        <li>Telephone</li>
                        <li>Charging Points</li>
                        <li>Sofa</li>
                        <li>Closet</li>
                        <li>Mini Fridge</li>
                        <li>Chair</li>
                        <li>Centre Table</li>
                        <li>Work Desk</li>
                      </ul>
                    </div>

                    {/* Basic Facilities */}
                    <div className="room-modal-amenity-group">
                      <h4 className="room-modal-amenity-group-title">Basic Facilities</h4>
                      <ul className="room-modal-amenity-list">
                        <li>Kettle</li>
                      </ul>
                    </div>

                    {/* Beds and Blanket */}
                    <div className="room-modal-amenity-group">
                      <h4 className="room-modal-amenity-group-title">Beds and Blanket</h4>
                      <ul className="room-modal-amenity-list">
                        <li>Blanket</li>
                      </ul>
                    </div>

                    {/* Safety and Security */}
                    <div className="room-modal-amenity-group">
                      <h4 className="room-modal-amenity-group-title">Safety and Security</h4>
                      <ul className="room-modal-amenity-list room-modal-amenity-list-columns">
                        <li>Safe</li>
                        <li>Cupboards with Locks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Details Modal */}
        {showPlanModal && selectedPlan && (
          <div className="plan-modal-overlay" onClick={() => setShowPlanModal(false)}>
            <div className="plan-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="plan-modal-header">
                <div>
                  <h2 className="plan-modal-title">{selectedPlan?.title || "Plan Details"}</h2>
                  <p className="plan-modal-subtitle">{selectedPlan.roomType}</p>
                </div>
                <button className="plan-modal-close" onClick={() => setShowPlanModal(false)}>✕</button>
              </div>

              {/* Modal Body */}
              <div className="plan-modal-body">
                {/* Benefits List */}
                <div className="plan-modal-benefits">
                  <div className="plan-modal-benefit-item">
                    <div className="plan-modal-bullet">●</div>
                    <div className="plan-modal-benefit-content">
                      <h4 className="plan-modal-benefit-title">Book @ ₹0 available</h4>
                      <p className="plan-modal-benefit-text">Pay the remaining amount using any payment option before 06 Feb, 2026. Your booking will get automatically cancelled if the payment is not received before 06 Feb, 2026.</p>
                    </div>
                  </div>

                  <div className="plan-modal-benefit-item">
                    <div className="plan-modal-bullet">●</div>
                    <div className="plan-modal-benefit-content">
                      <h4 className="plan-modal-benefit-title">Book @ ₹0 available</h4>
                      <p className="plan-modal-benefit-text">Book @ ₹0 available</p>
                    </div>
                  </div>

                  <div className="plan-modal-benefit-item">
                    <div className="plan-modal-bullet">●</div>
                    <div className="plan-modal-benefit-content">
                      <h4 className="plan-modal-benefit-title">20% discount on a la carte menu and soft beverages at Kitchen District.</h4>
                      <p className="plan-modal-benefit-text">20% discount on a la carte menu and soft beverages at Kitchen District.</p>
                    </div>
                  </div>

                  <div className="plan-modal-benefit-item">
                    <div className="plan-modal-bullet">●</div>
                    <div className="plan-modal-benefit-content">
                      <h4 className="plan-modal-benefit-title">Complimentary Breakfast</h4>
                      <p className="plan-modal-benefit-text">Complimentary Breakfast is available.</p>
                    </div>
                  </div>

                  <div className="plan-modal-benefit-item">
                    <div className="plan-modal-bullet">●</div>
                    <div className="plan-modal-benefit-content">
                      <h4 className="plan-modal-benefit-title">Bed and Breakfast</h4>
                      <p className="plan-modal-benefit-text">Bed and Breakfast</p>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="plan-modal-section">
                  <h3 className="plan-modal-section-title">Cancellation Policy</h3>
                  
                  <div className="plan-modal-timeline">
                    <div className="plan-modal-timeline-bar">
                      <div className="plan-modal-timeline-green">100% Refund</div>
                      <div className="plan-modal-timeline-yellow">
                        <span>Non</span>
                        <span>Refundable</span>
                      </div>
                    </div>
                    <div className="plan-modal-timeline-markers">
                      <div className="plan-modal-timeline-marker">
                        <span className="plan-modal-marker-label">Now</span>
                      </div>
                      <div className="plan-modal-timeline-marker plan-modal-timeline-marker-center">
                        <span className="plan-modal-marker-date">07 Feb</span>
                        <span className="plan-modal-marker-time">01 59 PM</span>
                      </div>
                      <div className="plan-modal-timeline-marker plan-modal-timeline-marker-end">
                        <span className="plan-modal-marker-date">08 Feb</span>
                        <span className="plan-modal-marker-time">01 59 PM</span>
                        <span className="plan-modal-marker-label-small">Check-in</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancellation Charges Table */}
                <div className="plan-modal-section">
                  <h4 className="plan-modal-subsection-title">Cancellations post that will be subject to a fee as follows</h4>
                  
                  <table className="plan-modal-table">
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>FEE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>04 Feb, 7.50 PM to 07 Feb, 1:59 PM</td>
                        <td>Booking amount for 0.0 nights</td>
                      </tr>
                      <tr>
                        <td>07 Feb, 2.00 PM to 08 Feb, 1:59 PM</td>
                        <td>Booking amount for 1.0 nights</td>
                      </tr>
                      <tr>
                        <td>After 08 Feb, 2.00 PM</td>
                        <td>100.0% of booking amount</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="plan-modal-footer-note">● Cancellations are only allowed before the Check-In Time. All time mentioned above is in Destination Time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Passenger Details Panel */}
        {isPropertyInfoPanelOpen && (
          <>
            {/* Backdrop */}
            <div className="panel-backdrop" onClick={closePanel}></div>
            
            {/* Side Panel */}
            <div className="passenger-details-panel">
              {/* Close Button */}
              <button className="panel-close-btn" onClick={closePanel}>✕</button>
              
              {/* Panel Header */}
              <div className="panel-header">
                <h2>Continue booking</h2>
              </div>

              {/* Panel Content */}
              <div className="panel-content">
                {panelView === 'guest-details' ? (
                  <>
                    {/* Hotel Summary */}
                <div className="hotel-summary">
                  <div className="hotel-summary-header">
                    <div className="hotel-info-left">
                      <div className="hotel-star-badge">
                        <span className="stars-count">5</span>
                        <FaStar className="star-icon-mini" />
                        <span className="hotel-label-mini">• Hotel</span>
                      </div>
                      <h3 className="hotel-name-panel">Hyatt Centric Janakpuri, New Delhi</h3>
                      <div className="hotel-address">
                        <FaMapMarkerAlt className="location-icon-tiny" />
                        <span>Janakpuri District Centre Complex, New Delhi, Delhi, India, 110058</span>
                      </div>
                    </div>
                    <div className="hotel-thumbnail">
                      <img src="/hotels/hh1.jpeg" alt="Hotel" />
                    </div>
                  </div>

                  <div className="booking-dates-info">
                    <div className="date-info-item">
                      <div className="date-label">Check In</div>
                      <div className="date-value">Sun, 08 Feb, 2026</div>
                      <div className="time-value">2 PM</div>
                    </div>
                    <div className="date-info-item">
                      <div className="date-label">Check Out</div>
                      <div className="date-value">Mon, 09 Feb, 2026</div>
                      <div className="time-value">12 PM</div>
                    </div>
                    <div className="date-info-item">
                      <div className="date-label">Guests</div>
                      <div className="date-value">2 Adults</div>
                      <div className="time-value">1 Night</div>
                    </div>
                  </div>
                </div>

                {/* Room Summary Card */}
                <div className="room-summary-card">
                  <div className="room-summary-header-panel">
                    <div className="great-choice-badge">Great Choice!</div>
                    <h4 className="room-title-panel">Room</h4>
                  </div>

                  <div className="room-details-grid">
                    {/* Left Side - Room Info */}
                    <div className="room-info-left">
                      <div className="room-bed-type">1 x 2 TWIN BEDS</div>
                      <div className="room-adults">
                        <FaUser className="user-icon-tiny" />
                        <FaUser className="user-icon-tiny" />
                        <span className="adults-text">2 Adults</span>
                      </div>
                      <div className="room-meal-plan">
                        Room with Breakfast
                        <span className="cancellation-text">Free Cancellation before 07 Feb 01:59 PM</span>
                      </div>
                      <a href="#" className="view-policy-link">View Booking &amp; Cancellation Policy</a>
                    </div>

                    {/* Right Side - Benefits */}
                    <div className="room-benefits-right">
                      <div className="benefit-item">• Book @ ₹0 available</div>
                      <div className="benefit-item">• Room With Free Cancellation | Breakfast only</div>
                      <div className="benefit-item">• 20% discount on a la carte menu and soft beverages at Kitchen District.</div>
                      {showMoreBenefits && (
                        <div className="benefit-item">• Complimentary Breakfast</div>
                      )}
                      <a 
                        href="#" 
                        className="view-more-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowMoreBenefits(!showMoreBenefits);
                        }}
                      >
                        {showMoreBenefits ? 'View less' : 'View more (1)'}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Guest Details Section */}
                <div className="guest-details-section">
                  <div className="section-header-collapsible">
                    <h3 className="section-title-bold">GUEST DETAILS</h3>
                    <button className="collapse-btn">▲</button>
                  </div>

                  <div className="guest-form-content">
                    {/* Dynamically render guest forms based on visibleGuestForms */}
                    {Array.from({ length: visibleGuestForms }).map((_, index) => (
                      <div key={index} className={`guest-form-wrapper guest-form-${index}`}>
                        <h4 className="guest-number-label">Guest {index + 1}</h4>
                        
                        {/* Title, First Name, Last Name Row */}
                        <div className="form-row-guest">
                          <div className="form-field-guest title-field">
                            <label>Title</label>
                            <select className="input-select" name="title">
                              <option>Mr</option>
                              <option>Mrs</option>
                              <option>Ms</option>
                            </select>
                          </div>
                          <div className="form-field-guest">
                            <label>First Name</label>
                            <input type="text" placeholder="Enter First Name" name="firstName" />
                          </div>
                          <div className="form-field-guest">
                            <label>Last Name</label>
                            <input type="text" placeholder="Enter Last Name" name="lastName" />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="form-field-guest full-width">
                          <label>Email Address <span className="field-note">(Your booking voucher will be sent to this email address)</span></label>
                          <input type="email" placeholder="Enter Email Address" name="email" />
                        </div>

                        {/* Mobile Number */}
                        <div className="form-field-guest full-width">
                          <label>Mobile Number</label>
                          <div className="phone-input-group">
                            <select className="country-code-select">
                              <option>+91 India</option>
                              <option>+1 USA</option>
                              <option>+44 UK</option>
                            </select>
                            <input type="tel" placeholder="Enter Phone Number" className="phone-input" name="mobile" />
                          </div>
                        </div>

                        {/* Only show GST checkbox for first guest */}
                        {index === 0 && (
                          <>
                            {/* GST Checkbox */}
                            <div className="checkbox-field">
                              <input 
                                type="checkbox" 
                                id="gst-checkbox"
                                checked={showGSTDetails}
                                onChange={(e) => setShowGSTDetails(e.target.checked)}
                              />
                              <label htmlFor="gst-checkbox">Enter GST Details <span className="optional-text">(Optional)</span></label>
                            </div>

                            {/* GST Details Form - Shown when checkbox is checked */}
                            {showGSTDetails && (
                              <div className="gst-details-form">
                                <h4 className="gst-form-title">BUSINESS PROFILE</h4>
                                
                                {/* GST Number and Company Name Row */}
                                <div className="gst-form-row">
                                  <div className="gst-form-field">
                                    <label>GST Number</label>
                                    <input type="text" placeholder="EG: 06BZAHM6385P6Z2" />
                                  </div>
                                  <div className="gst-form-field">
                                    <label>Company Name</label>
                                    <input type="text" placeholder="Enter Company Name" />
                                  </div>
                                </div>

                                {/* Business Email ID */}
                                <div className="gst-form-field gst-full-width">
                                  <label>Business Email ID</label>
                                  <input type="email" placeholder="Enter Email Address" />
                                </div>

                                {/* Company Address */}
                                <div className="gst-form-field gst-full-width">
                                  <label>Company Address</label>
                                  <textarea 
                                    placeholder="Enter Company Address" 
                                    rows="3"
                                    className="gst-textarea"
                                  ></textarea>
                                </div>

                                {/* Company Phone Number and Admin Email ID Row */}
                                <div className="gst-form-row">
                                  <div className="gst-form-field">
                                    <label>Company Phone Number</label>
                                    <input type="tel" placeholder="Enter Phone Number" />
                                  </div>
                                  <div className="gst-form-field">
                                    <label>Admin Email ID</label>
                                    <input type="email" placeholder="Enter Email Address" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}

                    {/* Add Guest Button - Show only if more adults are expected */}
                    {visibleGuestForms < totalAdults && (
                      <div className="add-guest-section">
                        <button 
                          className="add-guest-btn"
                          onClick={() => setVisibleGuestForms(visibleGuestForms + 1)}
                        >
                          + ADD GUEST
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pincode and State Section */}
                <div className="pincode-state-section">
                  <h3 className="section-title-bold">YOUR PINCODE AND STATE</h3>
                  <p className="section-subtitle">(Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.)</p>

                  <div className="form-row-address">
                    <div className="form-field-guest">
                      <label className="state-label">&nbsp;</label>
                      <input type="text" placeholder="Enter Billing Address" />
                    </div>
                    <div className="form-field-guest">
                      <label className="state-label">&nbsp;</label>
                      <input type="text" placeholder="Enter Pincode" />
                    </div>
                    <div className="form-field-guest">
                      <label className="state-label">State</label>
                      <select className="input-select">
                        <option>Uttar Pradesh</option>
                        <option>Delhi</option>
                        <option>Maharashtra</option>
                        <option>Karnataka</option>
                        <option>Tamil Nadu</option>
                      </select>
                    </div>
                  </div>

                  {/* Confirm Checkbox */}
                  <div className="checkbox-field">
                    <input type="checkbox" id="save-billing-checkbox" />
                    <label htmlFor="save-billing-checkbox">Confirm and save billing details to your profile</label>
                  </div>
                </div>

                {/* Price Details Section */}
                <div className="price-details-panel-section">
                  <div className="price-header-collapsible" onClick={() => setShowPriceDetails(!showPriceDetails)}>
                    <h3 className="section-title-bold">Price Details</h3>
                    <button className="collapse-arrow-btn">{showPriceDetails ? '▲' : '▼'}</button>
                  </div>

                  {/* Collapsible Price Breakdown */}
                  {showPriceDetails && (
                    <div className="price-breakdown-content">
                      <div className="price-row-item strike-through">
                        <span>Original price (1 room x 1 night)</span>
                        <span>Rs. 18,848.07</span>
                      </div>
                      <div className="price-row-item">
                        <span>Room price (1 room x 1 night)</span>
                        <span>Rs. 9,249.00</span>
                      </div>
                      <div className="price-row-item">
                        <span>Extra charges</span>
                        <span>Rs. 300.00</span>
                      </div>
                      <div className="price-divider-line"></div>
                      <div className="price-row-item bold-row">
                        <span>Price Before Taxes</span>
                        <span>Rs. 9,549.00</span>
                      </div>
                      <div className="price-row-item">
                        <span>Taxes and fees</span>
                        <span>Rs. 1,718.82</span>
                      </div>
                      <div className="price-row-item green-text">
                        <span>Booking fees</span>
                        <span>FREE</span>
                      </div>
                      <div className="price-divider-line"></div>
                    </div>
                  )}

                  {/* Final Price - Always Visible */}
                  <div className="price-final-row">
                    <div className="price-final-label">
                      <span>Price</span>
                      <span className="info-icon">ⓘ</span>
                    </div>
                    <span className="price-final-amount">Rs. 11,267.82</span>
                  </div>
                  <p className="price-included-note">Included in price: Extra Person Fee Rs. 300.00, Tax 18%</p>
                </div>
                  </>
                ) : (
                  <>
                    {/* REVIEW BOOKING SECTION */}
                    <div className="hotel-review-booking-section">
                      <h2 className="hotel-review-booking-title">Review Your Booking</h2>
                      
                      {/* Hotel Details Card */}
                      <div className="hotel-review-card">
                        <div className="hotel-review-header">
                          <div className="hotel-review-info">
                            <span className="hotel-review-name">Hyatt Centric Janakpuri, New Delhi</span>
                            <div className="hotel-review-location">
                              <FaMapMarkerAlt className="location-icon-tiny" />
                              <span>Janakpuri, Delhi</span>
                            </div>
                          </div>
                          <img src="/hotels/hh1.jpeg" alt="Hotel" className="hotel-review-thumbnail" />
                        </div>
                        
                        <div className="hotel-review-dates">
                          <div className="hotel-review-date-item">
                            <div className="hotel-review-date-label">Check In</div>
                            <div className="hotel-review-date-value">Sun, 08 Feb, 2026</div>
                            <div className="hotel-review-time-value">2 PM</div>
                          </div>
                          
                          <div className="hotel-review-duration">
                            <div className="hotel-review-nights">1 Night</div>
                          </div>
                          
                          <div className="hotel-review-date-item">
                            <div className="hotel-review-date-label">Check Out</div>
                            <div className="hotel-review-date-value">Mon, 09 Feb, 2026</div>
                            <div className="hotel-review-time-value">12 PM</div>
                          </div>
                        </div>

                        <div className="hotel-review-room-info">
                          <div className="hotel-review-room-type">1 x 2 TWIN BEDS</div>
                          <div className="hotel-review-guests">
                            <FaUser className="user-icon-tiny" />
                            <FaUser className="user-icon-tiny" />
                            <span>{totalAdults} Adults</span>
                            {totalChildren > 0 && <span>, {totalChildren} Children</span>}
                          </div>
                          <div className="hotel-review-meal">Room with Breakfast</div>
                        </div>
                      </div>
                      
                      {/* Guest Details Section */}
                      <div className="hotel-review-section">
                        <h3 className="hotel-review-section-title">Guest Details</h3>
                        {guestFormData.map((guest, index) => (
                          <div key={index} className="hotel-review-guest-card">
                            <h4 className="hotel-review-guest-label">Guest {index + 1}</h4>
                            <div className="hotel-review-detail-row">
                              <span className="hotel-review-detail-label">Title:</span>
                              <span className="hotel-review-detail-value">{guest.title || 'Not provided'}</span>
                            </div>
                            <div className="hotel-review-detail-row">
                              <span className="hotel-review-detail-label">First Name:</span>
                              <span className="hotel-review-detail-value">{guest.firstName || 'Not provided'}</span>
                            </div>
                            <div className="hotel-review-detail-row">
                              <span className="hotel-review-detail-label">Last Name:</span>
                              <span className="hotel-review-detail-value">{guest.lastName || 'Not provided'}</span>
                            </div>
                            {guest.email && (
                              <div className="hotel-review-detail-row">
                                <span className="hotel-review-detail-label">Email:</span>
                                <span className="hotel-review-detail-value">{guest.email}</span>
                              </div>
                            )}
                            {guest.mobile && (
                              <div className="hotel-review-detail-row">
                                <span className="hotel-review-detail-label">Mobile:</span>
                                <span className="hotel-review-detail-value">{guest.mobile}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Pincode and State Section */}
                      <div className="hotel-review-section">
                        <h3 className="hotel-review-section-title">Billing Address & State</h3>
                        <div className="hotel-review-guest-card">
                          {pincodeStateData.billingAddress && (
                            <div className="hotel-review-detail-row">
                              <span className="hotel-review-detail-label">Billing Address:</span>
                              <span className="hotel-review-detail-value">{pincodeStateData.billingAddress}</span>
                            </div>
                          )}
                          {pincodeStateData.pincode && (
                            <div className="hotel-review-detail-row">
                              <span className="hotel-review-detail-label">Pincode:</span>
                              <span className="hotel-review-detail-value">{pincodeStateData.pincode}</span>
                            </div>
                          )}
                          <div className="hotel-review-detail-row">
                            <span className="hotel-review-detail-label">State:</span>
                            <span className="hotel-review-detail-value">{pincodeStateData.state}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Details Section */}
                      <div className="hotel-review-section">
                        <h3 className="hotel-review-section-title">Price Details</h3>
                        <div className="hotel-review-total-card">
                          <div className="hotel-review-detail-row">
                            <span className="hotel-review-detail-label">Room price (1 room x 1 night):</span>
                            <span className="hotel-review-detail-value">₹9,249</span>
                          </div>
                          <div className="hotel-review-detail-row">
                            <span className="hotel-review-detail-label">Extra charges:</span>
                            <span className="hotel-review-detail-value">₹300</span>
                          </div>
                          <div className="hotel-review-detail-row">
                            <span className="hotel-review-detail-label">Taxes and fees:</span>
                            <span className="hotel-review-detail-value">₹1,718.82</span>
                          </div>
                          <div className="hotel-review-total-divider"></div>
                          <div className="hotel-review-detail-row hotel-review-total-row">
                            <span className="hotel-review-total-label">Grand Total:</span>
                            <span className="hotel-review-total-value">₹11,267.82</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Important Information */}
                      <div className="hotel-review-section">
                        <h3 className="hotel-review-section-title">Important Information</h3>
                        <p className="hotel-review-info-text">
                          Please review your booking details carefully. Check-in time is 2 PM and check-out time is 12 PM.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Continue Button */}
                <button className="continue-button-hotel-panel" onClick={handlePanelContinue}>
                  {panelView === 'guest-details' ? 'CONTINUE' : 'COMPLETE BOOKING'}
                </button>
                <p className="terms-text-hotel">By proceeding, I agree to MakeMyTrip's <a href="#">User Agreement</a>, <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
              </div>
            </div>
          </>
        )}

        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <>
            <div className="hotel-confirmation-modal-backdrop" onClick={handleCancelBooking}></div>
            <div className="hotel-confirmation-modal">
              <div className="hotel-confirmation-modal-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="38" stroke="#9CA3AF" strokeWidth="4"/>
                  <text x="40" y="55" fontSize="48" fill="#6B7280" fontWeight="600" textAnchor="middle">?</text>
                </svg>
              </div>
              <h3 className="hotel-confirmation-modal-title">Want to book this hotel ?</h3>
              <div className="hotel-confirmation-modal-actions">
                <button className="hotel-confirm-yes-btn" onClick={handleConfirmHotelBooking}>
                  Yes, I Want
                </button>
                <button className="hotel-confirm-cancel-btn" onClick={handleCancelBooking}>
                  No, Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <>
            <div className="hotel-success-modal-backdrop"></div>
            <div className="hotel-success-modal">
              <div className="hotel-success-modal-top">
                <div className="hotel-success-checkmark-badge">
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 30L25 40L45 20" stroke="#FF5A5F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="hotel-success-modal-title">Booking successful</h2>
              </div>
              <div className="hotel-success-modal-zigzag"></div>
              <div className="hotel-success-modal-bottom">
                <p className="hotel-success-modal-coins"> <strong>Your Hotel booking has been confirmed successfully !!</strong></p>
                <button className="hotel-success-modal-btn" onClick={handleSuccessClose}>
                  Go Home
                </button>
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
        
        {/* Footer */}
        <Footer />
         
      </div>
    </div>
  );
}

export default HotelBooking;


