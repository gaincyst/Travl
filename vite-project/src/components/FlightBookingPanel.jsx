import React, { useState, useRef } from "react";
import "../styles/FlightBookingPanel.css";

// Seats and Meals Section Component
function SeatsAndMealsSection({ flightData, selectedSeats, setSelectedSeats, selectedMeal, setSelectedMeal }) {
  const [activeTab, setActiveTab] = useState('seats'); // 'seats' or 'meals'
  const [vegOnly, setVegOnly] = useState(false);
  const maxSeats = 1; // Based on passenger count

  // Meal data
  const mealsData = [
    { id: 1, name: 'SHONDESH TIRAMISU', price: 250, isVeg: true, image: '/meals/images.jfif' },
    { id: 2, name: 'PANEER MAKHANI WITH JEERA ALOO & VEGETABLE PULAO', price: 600, isVeg: true, image: '/meals/images (1).jfif' },
    { id: 3, name: 'VEGETABLE MANCHURIAN WITH FRIED RICE', price: 600, isVeg: true, image: '/meals/images (2).jfif' },
    { id: 4, name: 'MINI IDLIS, MEDU VADA AND UPMA', price: 600, isVeg: true, image: '/meals/images (3).jfif' },
    { id: 5, name: 'HERB ROAST VEGETABLE ROLL', price: 400, isVeg: true, image: '/meals/images (4).jfif' },
    { id: 6, name: 'SEASONAL FRESH FRUIT PLATTER', price: 300, isVeg: true, image: '/meals/images (5).jfif' },
    { id: 7, name: 'CHICKEN JUNGLEE SANDWICH', price: 400, isVeg: false, image: '/meals/images (6).jfif' },
    { id: 8, name: 'AWADHI CHICKEN BIRYANI WITH MIRCH SALAN', price: 600, isVeg: false, image: '/meals/images (7).jfif' }
  ];

  const filteredMeals = vegOnly ? mealsData.filter(m => m.isVeg) : mealsData;

  // Generate seat data - rows 1 to 31, columns A-F
  const generateSeats = () => {
    const seats = [];
    const unavailableSeats = ['1A', '1B', '1C', '1D', '1E', '1F', '2A', '2B', '2C', '2D', '2E', '2F',
      '3A', '3F', '5A', '5B', '5C', '21A', '21F', '26A', '26B', '26C', '27B', '27C', '28A', '28E', '28F', '29B', '30D', '30E', '30F'];
    const exitRowSeats = ['12A', '12B', '12C', '12D', '12E', '12F', '13A', '13B', '13C', '13D', '13E', '13F'];
    const xlSeats = ['12C', '12D', '12E', '12F', '13A', '13B', '13C', '13D', '13E', '13F'];
    const nonRecliningSeats = ['11C', '11D', '11E', '11F'];
    const premiumSeats = ['3B', '3C', '3D', '3E', '4A', '4B', '4C', '4D', '4E', '4F', '5D', '5E', '5F'];
    const midPriceSeats = ['7B', '8A', '8B', '8C', '8D', '8E', '9A', '9B', '9C', '9D', '9E', '9F', 
      '10A', '10B', '10C', '10D', '10E', '10F', '14A', '14B', '14C', '14D', '14E', '14F',
      '15A', '15B', '15C', '15D', '15E', '15F', '16A', '16B', '16C', '16D', '16E', '16F',
      '17A', '17B', '17C', '17D', '17E', '17F', '18A', '18B', '18C', '18D', '18E', '18F',
      '19A', '19B', '19C', '19D', '19E', '19F', '20A', '20B', '20C', '20D', '20E', '20F',
      '21B', '21C', '21D', '21E', '22B', '22C', '22D', '23A', '23B', '23C', '23D', '23E', '23F',
      '24A', '24B', '24C', '24D', '24E', '24F', '25A', '25B', '25C', '25D', '25E', '25F',
      '26D', '26E', '26F', '27A', '27D', '27E', '27F', '28B', '28C', '28D', '29A', '29C', '29D', '29E', '29F'];
    const freeSeats = ['30B', '30C', '31B', '31C', '31E'];
    
    for (let row = 1; row <= 31; row++) {
      const rowSeats = [];
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
        const seatId = `${row}${col}`;
        const isUnavailable = unavailableSeats.includes(seatId);
        const isExit = exitRowSeats.includes(seatId);
        const isXL = xlSeats.includes(seatId);
        const isNonReclining = nonRecliningSeats.includes(seatId);
        const isPremium = premiumSeats.includes(seatId);
        const isMidPrice = midPriceSeats.includes(seatId);
        const isFree = freeSeats.includes(seatId);
        
        let price = 0;
        let priceCategory = 'free';
        if (!isUnavailable) {
          if (isFree) {
            price = 0;
            priceCategory = 'free';
          } else if (isPremium) {
            price = Math.floor(Math.random() * (835 - 545) + 545);
            priceCategory = 'premium';
          } else if (isMidPrice) {
            price = Math.floor(Math.random() * (440 - 390) + 390);
            priceCategory = 'mid';
          }
        }
        
        rowSeats.push({
          id: seatId,
          row,
          col,
          available: !isUnavailable,
          isExit,
          isXL,
          isNonReclining,
          price,
          priceCategory
        });
      });
      seats.push(rowSeats);
    }
    return seats;
  };

  const seats = generateSeats();

  const handleSeatClick = (seat) => {
    if (!seat.available) return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length < maxSeats) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const renderSeatIcon = (seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (!seat.available) {
      return <div className="flight-seat flight-seat-unavailable">✕</div>;
    }
    
    let seatClass = 'flight-seat';
    
    // Exit row seats (rows 12-13) get special styling
    if (seat.isExit || seat.isXL) {
      seatClass += ' flight-seat-exit-row';
      if (isSelected) {
        seatClass += ' flight-seat-selected';
      }
      return (
        <div className={seatClass} onClick={() => handleSeatClick(seat)}>
          <span className="seat-label-xl">XL</span>
        </div>
      );
    }
    
    // Non-reclining seats
    if (seat.isNonReclining) {
      seatClass += ' flight-seat-non-recline';
      if (isSelected) {
        seatClass += ' flight-seat-selected';
      }
      return <div className={seatClass} onClick={() => handleSeatClick(seat)}></div>;
    }
    
    // Regular seats
    if (isSelected) {
      seatClass += ' flight-seat-selected';
    } else if (seat.priceCategory === 'free') {
      seatClass += ' flight-seat-free';
    } else if (seat.priceCategory === 'premium') {
      seatClass += ' flight-seat-premium';
    } else if (seat.priceCategory === 'mid') {
      seatClass += ' flight-seat-mid';
    }
    
    return (
      <div className={seatClass} onClick={() => handleSeatClick(seat)}>
        {seat.price === 0 && <span className="seat-price-zero">₹0</span>}
      </div>
    );
  };

  return (
    <div className="flight-seats-meals-container">
      {/* Tabs */}
      <div className="flight-sm-tabs">
        <button 
          className={`flight-sm-tab ${activeTab === 'seats' ? 'flight-sm-tab-active' : ''}`}
          onClick={() => setActiveTab('seats')}
        >
          🪑 Seats
        </button>
        <button 
          className={`flight-sm-tab ${activeTab === 'meals' ? 'flight-sm-tab-active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          🍽 Meals
        </button>
      </div>

      {/* Offer Banner or Veg Toggle */}
      {activeTab === 'seats' ? (
        <div className="flight-sm-offer-banner">
          <div className="flight-sm-offer-content">
            <img src="/logo/visa-logo.png" alt="VISA" className="visa-icon-small" onError={(e) => e.target.style.display = 'none'} />
            <span>Get <strong>FREE SEAT</strong> using VISA Signature Credit card. Discount will be automatically applied on payments page.</span>
          </div>
          <a href="#" className="flight-sm-offer-link">View T&C</a>
        </div>
      ) : (
        <div className="flight-meals-veg-toggle-bar">
          <label className="flight-veg-toggle">
            <img src="/logo/veg.png" alt="Veg" className="toggle-veg-icon" />
            <span className="toggle-label">Veg only</span>
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="toggle-checkbox"
            />
          </label>
        </div>
      )}

      {activeTab === 'seats' ? (
        <>
          {/* Route Header */}
          <div className="flight-sm-route-header">
            <div className="flight-sm-route-info">
              <h3 className="flight-sm-route-title">{flightData.departureCity} → {flightData.arrivalCity}</h3>
              <p className="flight-sm-seats-count">{selectedSeats.length} of {maxSeats} Seat(s) Selected</p>
            </div>
            <div className="flight-sm-selection-status">Selection pending</div>
          </div>

          {/* Main Seating Area */}
          <div className="flight-sm-seating-area">
            {/* Legend Box - Fixed */}
            <div className="flight-sm-legend">
              <div className="legend-item">
                <div className="legend-color legend-free"></div>
                <span>Free</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-mid"></div>
                <span>₹390-440</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-premium"></div>
                <span>₹545-835</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-exit"></div>
                <span>Exit Row Seats</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-non-recline"></div>
                <span>Non Reclining</span>
              </div>
              <div className="legend-item">
                <div className="legend-xl">XL</div>
                <span>Extra Legroom</span>
              </div>
            </div>

            {/* Scrollable Airplane Container */}
            <div className="flight-seat-map-scroll">
              <div className="flight-seat-map">
                {/* Front of Plane */}
                <div className="plane-front">
                  <div className="plane-nose"></div>
                </div>

                {/* Seat Grid */}
                <div className="flight-seat-grid">
                  {seats.map((rowSeats, rowIndex) => {
                    const row = rowIndex + 1;
                    const isExitRow = row === 12 || row === 13;
                    
                    return (
                      <div key={row} className="flight-seat-row-container">
                        {/* Exit Indicator Left */}
                        {row === 1 && (
                          <div className="exit-indicator exit-top-left">
                            <span className="exit-arrow">◄</span>
                            <span className="exit-text">EXIT</span>
                          </div>
                        )}
                        
                        <div className="flight-seat-row">
                          <span className="seat-row-number">{row}</span>
                          
                          {/* Left side seats: A, B, C */}
                          <div className="seat-group seat-group-left">
                            {rowSeats.slice(0, 3).map(seat => (
                              <div key={seat.id} className="seat-wrapper">
                                {row === 1 && <span className="seat-col-letter">{seat.col}</span>}
                                {renderSeatIcon(seat)}
                              </div>
                            ))}
                          </div>
                          
                          {/* Aisle */}
                          <div className="seat-aisle"></div>
                          
                          {/* Right side seats: D, E, F */}
                          <div className="seat-group seat-group-right">
                            {rowSeats.slice(3, 6).map(seat => (
                              <div key={seat.id} className="seat-wrapper">
                                {row === 1 && <span className="seat-col-letter">{seat.col}</span>}
                                {renderSeatIcon(seat)}
                              </div>
                            ))}
                          </div>
                          
                          <span className="seat-row-number">{row}</span>
                        </div>

                        {/* Exit Row Markers */}
                        {isExitRow && (
                          <>
                            <div className="exit-row-marker exit-row-left"></div>
                            <div className="exit-row-marker exit-row-right"></div>
                          </>
                        )}

                        {/* Lavatory Icons */}
                        {row === 1 && (
                          <>
                            <div className="lavatory-icon lav-top-left">🚻</div>
                            <div className="lavatory-icon lav-top-right">🚻</div>
                          </>
                        )}
                        {row === 31 && (
                          <>
                            <div className="lavatory-icon lav-bottom-left">🚻</div>
                            <div className="lavatory-icon lav-bottom-right">🚻</div>
                          </>
                        )}

                        {/* Exit Indicator Right */}
                        {row === 1 && (
                          <div className="exit-indicator exit-top-right">
                            <span className="exit-text">EXIT</span>
                            <span className="exit-arrow">►</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Rear Exit Doors */}
                {seats.length > 30 && (
                  <>
                    <div className="exit-indicator exit-bottom-left">
                      <span className="exit-arrow">◄</span>
                      <span className="exit-text">EXIT</span>
                    </div>
                    <div className="exit-indicator exit-bottom-right">
                      <span className="exit-text">EXIT</span>
                      <span className="exit-arrow">►</span>
                    </div>
                  </>
                )}

                {/* Back of Plane */}
                <div className="plane-back">
                  <div className="plane-tail-left"></div>
                  <div className="plane-tail-center"></div>
                  <div className="plane-tail-right"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flight-meals-content">
          {/* Meals Grid */}
          <div className="flight-meals-grid">
            {filteredMeals.map((meal) => {
              const isSelected = selectedMeal?.id === meal.id;
              const isDisabled = selectedMeal && !isSelected;
              
              return (
                <div 
                  key={meal.id} 
                  className={`flight-meal-card ${isDisabled ? 'flight-meal-disabled' : ''}`}
                >
                  <img 
                    src={meal.image} 
                    alt={meal.name} 
                    className="flight-meal-image"
                    onError={(e) => {
                      e.target.src = '/images/i1.jpg';
                    }}
                  />
                  <div className="flight-meal-info">
                    <h4 className="flight-meal-name">{meal.name}</h4>
                    <div className="flight-meal-details">
                      <img 
                        src={meal.isVeg ? '/logo/veg.png' : '/logo/nonveg.png'} 
                        alt={meal.isVeg ? 'Veg' : 'Non-veg'} 
                        className="flight-meal-type-icon"
                      />
                      <span className="flight-meal-price">₹{meal.price}</span>
                    </div>
                  </div>
                  <button
                    className={`flight-meal-btn ${isSelected ? 'flight-meal-btn-remove' : ''}`}
                    onClick={() => setSelectedMeal(isSelected ? null : meal)}
                    disabled={isDisabled}
                  >
                    {isSelected ? 'Remove' : 'Add'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FlightBookingPanel({ isOpen, onClose, flightData }) {
  // Step navigation state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [stepData, setStepData] = useState({
    tripSummary: {},
    travelDetails: {},
    seatsAndMeals: {},
    addOns: {},
    reviewBooking: {}
  });
  
  // GST checkbox state
  const [hasGST, setHasGST] = useState(false);
  
  // Seats and Meals state
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  
  // Baggage dropdown state
  const [baggageDropdownOpen, setBaggageDropdownOpen] = useState(false);
  const [selectedBaggageWeight, setSelectedBaggageWeight] = useState({ weight: 10, price: 900 });
  const [baggageQuantity, setBaggageQuantity] = useState(1);
  const [baggageSelected, setBaggageSelected] = useState(false);
  const [baggageTab, setBaggageTab] = useState('surface'); // 'surface' or 'premium'
  
  // Confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Adults management state
  const totalAdults = flightData?.adults || 1; // Get from flightData or default to 1
  const [visibleAdults, setVisibleAdults] = useState(1); // Number of adult forms currently visible
  
  // Adult form data state - array of objects for each adult
  const [adultsData, setAdultsData] = useState(
    Array.from({ length: 10 }, () => ({
      title: '',
      firstName: '',
      lastName: '',
      countryCode: '',
      mobile: '',
      email: '',
      wheelchair: false
    }))
  );
  
  // Update adult data for a specific index
  const updateAdultData = (index, field, value) => {
    setAdultsData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };
  
  // Refs for scrolling to sections (for display reference only)
  const panelContentRef = useRef(null);
  
  if (!isOpen || !flightData) return null;

  const navigationSteps = [
    { id: "trip-summary", label: "Trip Summary" },
    { id: "travel-details", label: "Travels details" },
    { id: "seats-meals", label: "Seats & Meals" },
    { id: "add-ons", label: "Add-Ons" }
  ];

  const handleStepClick = (stepIndex) => {
    // Only allow clicking on current step or completed steps
    if (stepIndex <= currentStepIndex || completedSteps.includes(stepIndex)) {
      setCurrentStepIndex(stepIndex);
      if (panelContentRef.current) {
        panelContentRef.current.scrollTop = 0;
      }
    }
  };

  const handleContinue = async () => {
    const currentStep = navigationSteps[currentStepIndex];
    
    // Validate current step data
    // TODO: Add validation logic for each step
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
    
    // If on Review Booking (step 4), show confirmation modal
    if (currentStepIndex === 4) {
      setShowConfirmationModal(true);
    } else {
      // Move to next step
      setCurrentStepIndex(currentStepIndex + 1);
      if (panelContentRef.current) {
        panelContentRef.current.scrollTop = 0;
      }
    }
  };

  const handleConfirmBooking = async () => {
    try {
      // TODO: API call to save booking
      console.log("Saving booking data:", stepData);
      
      // Close modal and panel
      setShowConfirmationModal(false);
      alert("Booking confirmed successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save booking. Please try again.");
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmationModal(false);
  };

  // Baggage options
  const surfaceOptions = [
    { weight: 10, price: 900 },
    { weight: 15, price: 1350 },
    { weight: 20, price: 1800 },
    { weight: 25, price: 2250 },
    { weight: 30, price: 2700 }
  ];
  
  const premiumOptions = [
    { weight: 10, price: 1800 },
    { weight: 15, price: 2700 },
    { weight: 20, price: 3600 },
    { weight: 25, price: 4501 },
    { weight: 30, price: 5400 }
  ];

  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0: // Trip Summary
        return (
          <>
            {/* Flight Details Summary */}
            <div className="flight-summary-panel">
              {/* Top Header Row */}
              <div className="flight-header-row">
                <div className="flight-route-title">{flightData.departureCity} → {flightData.arrivalCity}</div>
                <div className="cancellation-badge">CANCELLATION FEES APPLY</div>
              </div>

              {/* Date and Duration Row */}
              <div className="flight-date-row">
                <div className="date-duration-left">
                  <span className="flight-date-text">Friday, Feb 13</span>
                  <span className="flight-stops-duration">{flightData.stops} · {flightData.duration}</span>
                </div>
                <a href="#" className="fare-rules-link">View Fare Rules</a>
              </div>

              {/* Airline Info Row */}
              <div className="airline-row">
                <div className="airline-left-section">
                  <img src={flightData.airlineLogo} alt={flightData.airline} className="airline-logo-img" />
                  <div className="airline-details">
                    <span className="airline-name-text">{flightData.airline}</span>
                    <span className="flight-number-text">{flightData.flightCode}</span>
                    <span className="aircraft-type-badge">{flightData.layout || "Boeing 737"}</span>
                  </div>
                </div>
                <div className="economy-class-text">
                  Economy &gt; <span className="fare-class">SPICESAVER</span>
                </div>
              </div>

              {/* Flight Timeline */}
              <div className="flight-journey-timeline">
                {/* Departure */}
                <div className="journey-point-section">
                  <div className="journey-time">{flightData.departureTime}</div>
                  <div className="journey-city">{flightData.departureCity}</div>
                  <div className="journey-location">Indira Gandhi International Airport, {flightData.departureTerminal}</div>
                </div>

                {/* Duration Line */}
                <div className="journey-duration-line">
                  <div className="duration-text-center">{flightData.duration}</div>
                  <div className="timeline-visual">
                    <div className="journey-circle"></div>
                    <div className="dotted-line"></div>
                    <div className="journey-circle"></div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="journey-point-section">
                  <div className="journey-time">{flightData.arrivalTime}</div>
                  <div className="journey-city">{flightData.arrivalCity}</div>
                  <div className="journey-location">Chaudhary Charan Singh International Airport, {flightData.arrivalTerminal}</div>
                </div>
              </div>

              {/* Baggage Section */}
              <div className="baggage-section-bottom">
                <div className="baggage-item-row">
                  <img src="/logo/cabin-baggage.png" alt="Cabin Baggage" className="baggage-icon-img" />
                  <span className="baggage-text"><strong>Cabin Baggage:</strong> 7 Kgs (1 piece only) / Adult</span>
                </div>
                <div className="baggage-item-row">
                  <img src="/logo/baggage1.png" alt="Check-in Baggage" className="baggage-icon-img" />
                  <span className="baggage-text"><strong>Check-In Baggage:</strong> 15 Kgs (1 piece only) / Adult</span>
                </div>
              </div>
            </div>

            {/* Refund on Cancellation Section */}
            <div className="refund-cancellation-section">
              <div className="refund-header">
                <h3 className="refund-title">Refund on Cancellation</h3>
                <a href="#" className="cancellation-policy-link">Cancellation &amp; Rescheduling Policy</a>
              </div>

              <div className="refund-route">{flightData.departureLocation} - {flightData.arrivalLocation}</div>

              <div className="refund-timeline">
                <div className="refund-point">
                  <div className="refund-amount">₹1070 refund</div>
                  <div className="timeline-marker marker-yellow"></div>
                  <div className="refund-time-label">Now</div>
                  <div className="refund-time-value">00:45</div>
                </div>

                <div className="refund-point">
                  <div className="refund-amount">₹70 refund</div>
                  <div className="timeline-marker marker-orange"></div>
                  <div className="refund-time-label">11 Feb</div>
                  <div className="refund-time-value">05:00</div>
                </div>

                <div className="refund-point">
                  <div className="refund-amount">Non Refundable</div>
                  <div className="timeline-marker marker-red"></div>
                  <div className="refund-time-label">12 Feb</div>
                  <div className="refund-time-value">02:00</div>
                </div>

                <div className="refund-point">
                  <div className="refund-amount">&nbsp;</div>
                  <div className="timeline-marker marker-red-dark">
                    <span className="plane-icon">✈</span>
                  </div>
                  <div className="refund-time-label">Departure</div>
                  <div className="refund-time-value">12 Feb, 05:00</div>
                </div>

                <div className="timeline-line">
                  <div className="line-segment segment-yellow"></div>
                  <div className="line-segment segment-orange"></div>
                  <div className="line-segment segment-red"></div>
                </div>
              </div>
            </div>

            {/* Fare Upgrade Section */}
            <div className="fare-upgrade-section">
              <h3 className="fare-upgrade-title">Get more benefits by upgrading your fare</h3>
              
              <div className="fare-options-grid">
                {/* Your Selection */}
                <div className="fare-option-card selected">
                  <div className="fare-card-header">
                    <input type="radio" name="fare" checked readOnly className="fare-radio" />
                    <div className="fare-card-info">
                      <div className="fare-label">Your Selection</div>
                      <div className="fare-price">₹ 3,399</div>
                    </div>
                  </div>
                  <div className="fare-features-list">
                    <div className="fare-feature disabled">
                      <span className="feature-icon icon-minus">—</span>
                      <span className="feature-text">Flight delay protection benefit not included</span>
                    </div>
                    <div className="fare-feature disabled">
                      <span className="feature-icon icon-cross">✕</span>
                      <span className="feature-text">No Refund On Cancellation</span>
                    </div>
                    <div className="fare-feature disabled">
                      <span className="feature-icon icon-minus">—</span>
                      <span className="feature-text">Date Change fee starts at ₹ 2,999 up to 4 hrs before departure</span>
                    </div>
                    <div className="fare-feature disabled">
                      <span className="feature-icon icon-minus">—</span>
                      <span className="feature-text">Seats Chargeable</span>
                    </div>
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text">Cabin bag <strong>7 Kgs</strong> + Check-in <strong>15 Kgs</strong></span>
                    </div>
                  </div>
                </div>

                {/* MMT Regular */}
                <div className="fare-option-card">
                  <div className="fare-card-header">
                    <input type="radio" name="fare" className="fare-radio" />
                    <div className="fare-card-info">
                      <div className="fare-label">MMT Regular</div>
                      <div className="fare-price">
                        <span className="original-price">₹ 3,670</span>
                        <span className="discounted-price">₹ 3,278</span>
                      </div>
                    </div>
                  </div>
                  <div className="fare-features-list">
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text"><strong>Flight Delay Protection</strong> included <span className="info-circle">ⓘ</span></span>
                    </div>
                    <div className="fare-feature disabled">
                      <span className="feature-icon icon-cross">✕</span>
                      <span className="feature-text">No Refund On Cancellation</span>
                    </div>
                    <div className="fare-feature disabled">
                      <span className="feature-icon icon-minus">—</span>
                      <span className="feature-text">Date Change fee starts at ₹ 2,999 up to 4 hrs before departure</span>
                    </div>
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text"><strong>Free Seats</strong> included <span className="info-circle">ⓘ</span></span>
                    </div>
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text">Cabin bag <strong>7 Kgs</strong> + Check-in <strong>15 Kgs</strong></span>
                    </div>
                  </div>
                  <div className="fare-coupon-badge">
                    <span className="coupon-icon">🎫</span> MMT BONUS COUPON APPLIED
                  </div>
                </div>

                {/* MMT Premium */}
                <div className="fare-option-card">
                  <div className="fare-card-header">
                    <input type="radio" name="fare" className="fare-radio" />
                    <div className="fare-card-info">
                      <div className="fare-label">MMT Premium</div>
                      <div className="fare-price">
                        <span className="original-price">₹ 4,187</span>
                        <span className="discounted-price">₹ 3,787</span>
                      </div>
                    </div>
                  </div>
                  <div className="fare-features-list">
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text"><strong>Flight Delay Protection</strong> included <span className="info-circle">ⓘ</span></span>
                    </div>
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text"><strong>Free cancellation</strong> upto <strong>24 hours</strong> before departure. <span className="info-circle">ⓘ</span></span>
                    </div>
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text"><strong>Free date change</strong> upto <strong>4 hours</strong> before departure. <span className="info-circle">ⓘ</span></span>
                    </div>
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text"><strong>Free Seats</strong> included <span className="info-circle">ⓘ</span></span>
                    </div>
                    <div className="fare-feature enabled">
                      <span className="feature-icon icon-check">✓</span>
                      <span className="feature-text">Cabin bag <strong>7 Kgs</strong> + Check-in <strong>15 Kgs</strong></span>
                    </div>
                  </div>
                  <div className="fare-coupon-badge">
                    <span className="coupon-icon">🎫</span> MMT BONUS COUPON APPLIED
                  </div>
                </div>
              </div>

              <div className="upgrade-banner">
                <span className="shield-icon">🛡️</span>
                <span className="banner-text">Just a click for a better trip. <strong>Upgrade now!</strong></span>
              </div>
            </div>
          </>
        );
      
      case 1: // Travel Details
        return (
          <div className="traveller-details-section">
            {/* Header */}
            <div className="traveller-header">
              <div className="traveller-header-left">
                <h2 className="traveller-title">Traveller Details</h2>
                <p className="traveller-subtitle">Choose from the saved list or add a new passenger</p>
              </div>
              <div className="traveller-header-right">
                <span className="traveller-badge">Traveller</span>
              </div>
            </div>

            {/* Info Alert */}
            <div className="traveller-info-alert">
              <span className="alert-icon">🆔</span>
              <span className="alert-text">Please ensure that your name matches your govt. ID such as Aadhaar, Passport or Driver's License</span>
            </div>

            {/* Adult Forms - Dynamically rendered */}
            {Array.from({ length: visibleAdults }).map((_, index) => (
              <div key={index} className="traveller-form-card">
                <div className="adult-header">
                  <label className="adult-checkbox-label">
                    <input type="checkbox" className="adult-checkbox" defaultChecked />
                    <span className="adult-title">ADULT {index + 1}</span>
                  </label>
                </div>

                {/* Name Row with Title */}
                <div className="form-row name-title-row">
                  <select 
                    className="form-input form-select-title"
                    value={adultsData[index].title}
                    onChange={(e) => updateAdultData(index, 'title', e.target.value)}
                  >
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                  </select>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="First & Middle Name"
                    value={adultsData[index].firstName}
                    onChange={(e) => updateAdultData(index, 'firstName', e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Last Name"
                    value={adultsData[index].lastName}
                    onChange={(e) => updateAdultData(index, 'lastName', e.target.value)}
                  />
                </div>

                {/* Contact Details Row */}
                <div className="form-labels-row">
                  <label className="form-field-label">Country Code</label>
                  <label className="form-field-label">Mobile No</label>
                  <label className="form-field-label">Email</label>
                </div>
                <div className="form-row contact-row">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Country Code(Optional)"
                    value={adultsData[index].countryCode}
                    onChange={(e) => updateAdultData(index, 'countryCode', e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Mobile No(Optional)"
                    value={adultsData[index].mobile}
                    onChange={(e) => updateAdultData(index, 'mobile', e.target.value)}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Email(Optional)"
                    value={adultsData[index].email}
                    onChange={(e) => updateAdultData(index, 'email', e.target.value)}
                  />
                </div>

                {/* Wheelchair Checkbox */}
                <div className="wheelchair-option">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      className="option-checkbox"
                      checked={adultsData[index].wheelchair}
                      onChange={(e) => updateAdultData(index, 'wheelchair', e.target.checked)}
                    />
                    <span className="checkbox-text">I require wheelchair <span className="optional-text">(Optional)</span></span>
                  </label>
                </div>

                {/* Add New Adult Link - Only show after current adult form and if more adults are expected */}
                {index === visibleAdults - 1 && visibleAdults < totalAdults && (
                  <div className="add-adult-section">
                    <button 
                      className="add-adult-btn"
                      onClick={() => setVisibleAdults(visibleAdults + 1)}
                    >
                      + ADD NEW ADULT
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Booking Details Section */}
            <div className="booking-details-card">
              <h3 className="booking-details-title">Booking details will be sent to</h3>
              
              <div className="form-labels-row">
                <label className="form-field-label">Country Code</label>
                <label className="form-field-label">Mobile No</label>
                <label className="form-field-label">Email</label>
              </div>
              <div className="form-row contact-row">
                <select className="form-input form-select-country">
                  <option value="91">India(91)</option>
                  <option value="1">USA(1)</option>
                  <option value="44">UK(44)</option>
                </select>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Mobile No"
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Email"
                />
              </div>

              {/* GST Checkbox */}
              <div className="gst-option">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    className="option-checkbox" 
                    checked={hasGST}
                    onChange={(e) => setHasGST(e.target.checked)}
                  />
                  <span className="checkbox-text">I have a GST number <span className="optional-text">(Optional)</span></span>
                </label>
              </div>

              {/* GST Details - Shown when checkbox is checked */}
              {hasGST && (
                <div className="gst-details-section">
                  <div className="form-row gst-details-row">
                    <div className="form-field">
                      <label className="form-field-label">Company Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-field-label">Registration No</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Registration No"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Billing Address Section */}
            <div className="billing-address-card">
              <h3 className="billing-address-title">Billing Address</h3>
              <p className="billing-address-subtitle">As per the latest govt. regulations, it's mandatory to provide your address.</p>
              
              <div className="billing-form-row">
                <div className="billing-field">
                  <label className="billing-label">Pincode</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder=""
                  />
                </div>
                <div className="billing-field">
                  <label className="billing-label">Address</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Address"
                  />
                </div>
              </div>

              <div className="billing-form-row">
                <div className="billing-field">
                  <label className="billing-label">City</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="New delhi"
                  />
                </div>
                <div className="billing-field">
                  <label className="billing-label">State</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Delhi"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2: // Seats & Meals
        return <SeatsAndMealsSection 
          flightData={flightData} 
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          selectedMeal={selectedMeal}
          setSelectedMeal={setSelectedMeal}
        />;
      
      case 3: // Add-Ons
        const baggageOptions = baggageTab === 'surface' ? surfaceOptions : premiumOptions;
        
        return (
          <div className="flight-step-content">
            <div className="baggage-courier-section">
              <h2 className="baggage-courier-title">Courier Your Bags & Travel Baggage Free</h2>
              <p className="baggage-courier-subtitle">
                Have excess baggage? Send it separately via our logistic partner at affordable rates & travel baggage-free!
              </p>
              
              <div className="baggage-courier-tabs">
                <button 
                  className={`baggage-tab ${baggageTab === 'surface' ? 'active' : ''}`}
                  onClick={() => {
                    setBaggageTab('surface');
                    setBaggageSelected(false);
                    setBaggageQuantity(1);
                    setSelectedBaggageWeight({ weight: 10, price: 900 });
                    setBaggageDropdownOpen(false);
                  }}
                >
                  <span className="tab-type">SURFACE</span>
                  <span className="tab-duration">4-7 days by road</span>
                </button>
                <button 
                  className={`baggage-tab ${baggageTab === 'premium' ? 'active' : ''}`}
                  onClick={() => {
                    setBaggageTab('premium');
                    setBaggageSelected(false);
                    setBaggageQuantity(1);
                    setSelectedBaggageWeight({ weight: 10, price: 1800 });
                    setBaggageDropdownOpen(false);
                  }}
                >
                  <span className="tab-type">PREMIUM</span>
                  <span className="tab-duration">In 72 hrs by air</span>
                </button>
              </div>
              
              <div className="baggage-option">
                <label className="baggage-checkbox-label">
                  <input 
                    type="checkbox" 
                    className="baggage-checkbox" 
                    checked={baggageSelected}
                    onChange={(e) => {
                      setBaggageSelected(e.target.checked);
                      if (!e.target.checked) {
                        setBaggageQuantity(1);
                      }
                    }}
                  />
                  <span className="baggage-price">
                    ₹ {(selectedBaggageWeight.price * baggageQuantity).toLocaleString('en-IN')} for {baggageQuantity} Bag{baggageQuantity > 1 ? 's' : ''}
                  </span>
                </label>
                <div className="baggage-weight-dropdown-container">
                  <div 
                    className="baggage-weight-dropdown"
                    onClick={() => setBaggageDropdownOpen(!baggageDropdownOpen)}
                  >
                    <span>{selectedBaggageWeight.weight} kgs {baggageSelected ? `X ${baggageQuantity} Bag${baggageQuantity > 1 ? 's' : ''}` : ''}</span>
                    <svg 
                      width="12" 
                      height="8" 
                      viewBox="0 0 12 8" 
                      fill="none"
                      style={{ transform: baggageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                      <path d="M1 1L6 6L11 1" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  
                  {baggageDropdownOpen && (
                    <div className="baggage-dropdown-menu">
                      {baggageOptions.map((option) => (
                        <div key={option.weight} className="baggage-dropdown-item">
                          <div className="baggage-dropdown-left">
                            <span className="baggage-dropdown-weight">{option.weight} kgs X {baggageQuantity} Bag{baggageQuantity > 1 ? 's' : ''}</span>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="baggage-info-icon">
                              <circle cx="7" cy="7" r="6.5" stroke="#999" strokeWidth="1"/>
                              <text x="7" y="10" textAnchor="middle" fontSize="10" fill="#999" fontFamily="Arial">i</text>
                            </svg>
                          </div>
                          <span className="baggage-dropdown-price">₹ {(option.price * baggageQuantity).toLocaleString('en-IN')}</span>
                          <button 
                            className="baggage-dropdown-add-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBaggageWeight(option);
                              setBaggageSelected(true);
                              setBaggageQuantity(1);
                              setBaggageDropdownOpen(false);
                            }}
                          >
                            ADD
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {baggageSelected && (
                  <div className="baggage-quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => setBaggageQuantity(Math.max(1, baggageQuantity - 1))}
                      disabled={baggageQuantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="text" 
                      className="quantity-input" 
                      value={baggageQuantity}
                      readOnly
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => setBaggageQuantity(baggageQuantity + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
              
              <div className="baggage-info-box">
                <ul className="baggage-info-list">
                  <li>Baggage will be transported separately via road/rail/air cargo, and NOT in the flight booked.</li>
                  <li>Pickup & drop addresses will be collected post booking.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 4: // Review Booking
        return (
          <div className="flight-step-content">
            <div className="review-booking-section">
              <h2 className="review-booking-title">Review Trip Details</h2>
              
              {/* Flight Details */}
              <div className="review-flight-card">
                <div className="review-flight-header">
                  <div className="review-airline-info">
                    <img src={flightData.airlineLogo} alt={flightData.airline} className="review-airline-logo" />
                    <span className="review-airline-name">{flightData.airline}</span>
                  </div>
                  <span className="review-fare-type">SAVER</span>
                </div>
                
                <div className="review-flight-timing">
                  <div className="review-time-section">
                    <div className="review-main-time">{flightData.departureTime}</div>
                    <div className="review-date">Friday, Feb 13</div>
                    <div className="review-airport">{flightData.departureCity}</div>
                  </div>
                  
                  <div className="review-duration-section">
                    <div className="review-duration">{flightData.duration}</div>
                    <div className="review-stop-type">{flightData.stops === '0 Stops' || flightData.stops === 0 ? 'Non Stop' : flightData.stops}</div>
                  </div>
                  
                  <div className="review-time-section">
                    <div className="review-main-time">{flightData.arrivalTime}</div>
                    <div className="review-date">Friday, Feb 13</div>
                    <div className="review-airport">{flightData.arrivalCity}</div>
                  </div>
                </div>
              </div>
              
              {/* Travellers Section */}
              <div className="review-section">
                <h3 className="review-section-title">Travellers</h3>
                {Array.from({ length: visibleAdults }).map((_, index) => (
                  <div key={index} className="review-traveller-card">
                    <h4 className="review-traveller-label">ADULT {index + 1}</h4>
                    <div className="review-detail-row">
                      <span className="review-detail-label">Title:</span>
                      <span className="review-detail-value">{adultsData[index].title || 'Not provided'}</span>
                    </div>
                    <div className="review-detail-row">
                      <span className="review-detail-label">First & Middle Name:</span>
                      <span className="review-detail-value">{adultsData[index].firstName || 'Not provided'}</span>
                    </div>
                    <div className="review-detail-row">
                      <span className="review-detail-label">Last Name:</span>
                      <span className="review-detail-value">{adultsData[index].lastName || 'Not provided'}</span>
                    </div>
                    {adultsData[index].countryCode && (
                      <div className="review-detail-row">
                        <span className="review-detail-label">Country Code:</span>
                        <span className="review-detail-value">{adultsData[index].countryCode}</span>
                      </div>
                    )}
                    {adultsData[index].mobile && (
                      <div className="review-detail-row">
                        <span className="review-detail-label">Mobile No:</span>
                        <span className="review-detail-value">{adultsData[index].mobile}</span>
                      </div>
                    )}
                    {adultsData[index].email && (
                      <div className="review-detail-row">
                        <span className="review-detail-label">Email:</span>
                        <span className="review-detail-value">{adultsData[index].email}</span>
                      </div>
                    )}
                    {adultsData[index].wheelchair && (
                      <div className="review-detail-row">
                        <span className="review-detail-label">Special Request:</span>
                        <span className="review-detail-value">Wheelchair Required</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Selected Seats */}
              {selectedSeats.length > 0 && (
                <div className="review-section">
                  <h3 className="review-section-title">Selected Seats</h3>
                  <div className="review-selection-card">
                    <div className="review-detail-row">
                      <span className="review-detail-label">Seats:</span>
                      <span className="review-detail-value">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="review-detail-row">
                      <span className="review-detail-label">Price:</span>
                      <span className="review-detail-value">₹{(selectedSeats.length * 200).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Selected Meal */}
              {selectedMeal && (
                <div className="review-section">
                  <h3 className="review-section-title">Selected Meal</h3>
                  <div className="review-selection-card">
                    <div className="review-meal-display">
                      <img src={selectedMeal.image} alt={selectedMeal.name} className="review-meal-image" />
                      <div className="review-meal-details">
                        <div className="review-meal-name">{selectedMeal.name}</div>
                        <div className="review-meal-price">₹{selectedMeal.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Baggage Add-On */}
              {baggageSelected && (
                <div className="review-section">
                  <h3 className="review-section-title">Baggage Courier Service</h3>
                  <div className="review-selection-card">
                    <div className="review-detail-row">
                      <span className="review-detail-label">Service Type:</span>
                      <span className="review-detail-value">{baggageTab.toUpperCase()}</span>
                    </div>
                    <div className="review-detail-row">
                      <span className="review-detail-label">Weight:</span>
                      <span className="review-detail-value">{selectedBaggageWeight.weight} Kgs</span>
                    </div>
                    <div className="review-detail-row">
                      <span className="review-detail-label">Quantity:</span>
                      <span className="review-detail-value">{baggageQuantity}</span>
                    </div>
                    <div className="review-detail-row">
                      <span className="review-detail-label">Total Price:</span>
                      <span className="review-detail-value">
                        ₹{(selectedBaggageWeight.price * baggageQuantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Important Information */}
              <div className="review-section">
                <h3 className="review-section-title">Important Information</h3>
                <p className="review-info-text">
                  Please review your itinerary & traveller details carefully to avoid any cancellation penalties later.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="flight-step-content"><p>Loading...</p></div>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="panel-backdrop" onClick={onClose}></div>
      
      {/* Side Panel */}
      <div className="passenger-details-panel">
        {/* Close Button */}
        <button className="panel-close-btn" onClick={onClose}>✕</button>
        
        {/* Panel Header */}
        <div className="panel-header">
          <h2>Continue booking</h2>
        </div>

        {/* Horizontal Navigation Menu */}
        <div className="flight-step-nav">
          {navigationSteps.map((step, index) => (
            <button
              key={step.id}
              className={`flight-step-item ${currentStepIndex === index ? 'flight-step-active' : ''} ${index > currentStepIndex && !completedSteps.includes(index) ? 'flight-step-disabled' : ''}`}
              onClick={() => handleStepClick(index)}
              disabled={index > currentStepIndex && !completedSteps.includes(index)}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Panel Content - Dynamic based on current step */}
        <div className="panel-content" ref={panelContentRef}>
          {renderStepContent()}

          {/* Continue Button */}
          <button 
            type="button"
            className="continue-button-flight-panel"
            onClick={handleContinue}
          >
            {currentStepIndex === 4 ? 'COMPLETE BOOKING' : 'CONTINUE'}
          </button>
          <p className="terms-text-flight">By proceeding, I agree to MakeMyTrip's <a href="#">User Agreement</a>, <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <>
          <div className="confirmation-modal-backdrop" onClick={handleCancelBooking}></div>
          <div className="confirmation-modal">
            <div className="confirmation-modal-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="#9CA3AF" strokeWidth="4"/>
                <text x="40" y="55" fontSize="48" fill="#6B7280" fontWeight="600" textAnchor="middle">?</text>
              </svg>
            </div>
            <h3 className="confirmation-modal-title">Want to book Oneway trip flight ?</h3>
            <div className="confirmation-modal-buttons">
              <button className="confirmation-btn-yes" onClick={handleConfirmBooking}>
                Yes, I Want
              </button>
              <button className="confirmation-btn-no" onClick={handleCancelBooking}>
                No, Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FlightBookingPanel;
