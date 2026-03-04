import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FlightBookingPanel.css";

// ===== SEATS AND MEALS SECTION - COMMENTED OUT (NOT IN USE) =====
// This component is kept for reference but not used in the booking flow
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
// ===== END OF SEATS AND MEALS SECTION =====

function FlightBookingPanel({ isOpen, onClose, flightData }) {
  const navigate = useNavigate();
  
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
  
  /* ===== SEATS AND MEALS STATE - COMMENTED OUT =====
  // Seats and Meals state
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  ===== END OF SEATS AND MEALS STATE ===== */
  
  // Baggage dropdown state
  const [baggageDropdownOpen, setBaggageDropdownOpen] = useState(false);
  const [selectedBaggageWeight, setSelectedBaggageWeight] = useState({ weight: 10, price: 900 });
  const [baggageQuantity, setBaggageQuantity] = useState(1);
  const [baggageSelected, setBaggageSelected] = useState(false);
  const [baggageTab, setBaggageTab] = useState('surface'); // 'surface' or 'premium'
  
  // Confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Fare upgrade state
  const [selectedFare, setSelectedFare] = useState('your-selection');
  
  // Travellers management state
  const totalAdults = flightData?.adults || 1;
  const totalChildren = flightData?.children || 0;
  const totalInfants = flightData?.infants || 0;
  const totalTravellers = totalAdults + totalChildren + totalInfants;
  
  const [visibleTravellers, setVisibleTravellers] = useState(1); // Number of traveller forms currently visible
  
  // Travellers accordion state for Review Booking section
  const [travellersExpanded, setTravellersExpanded] = useState(false);
  
  // Fare Rules modal state
  const [fareRulesModalOpen, setFareRulesModalOpen] = useState(false);
  const [selectedFlightForFareRules, setSelectedFlightForFareRules] = useState('outbound'); // 'outbound' or 'return'
  const [fareRulesTab, setFareRulesTab] = useState('cancellation'); // 'cancellation' or 'dateChange'
  
  // Cancellation Policy modal state
  const [cancellationPolicyModalOpen, setCancellationPolicyModalOpen] = useState(false);
  const [cancellationPolicyTab, setCancellationPolicyTab] = useState('cancellation'); // 'cancellation' or 'reschedule'
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [selectedCancellationFlight, setSelectedCancellationFlight] = useState('outbound'); // 'outbound' or 'return'
  
  // Traveller form data state for all types
  const [travellersData, setTravellersData] = useState(
    Array.from({ length: 20 }, () => ({
      type: '', // 'adult', 'child', or 'infant'
      title: '',
      firstName: '',
      lastName: '',
      countryCode: '',
      mobile: '',
      email: '',
      wheelchair: false
    }))
  );
  
  // Update traveller data for a specific index
  const updateTravellerData = (index, field, value) => {
    setTravellersData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
  };
  
  // Get traveller type and number based on index
  const getTravellerInfo = (index) => {
    if (index < totalAdults) {
      return { type: 'adult', number: index + 1, label: `ADULT ${index + 1}` };
    } else if (index < totalAdults + totalChildren) {
      return { type: 'child', number: index - totalAdults + 1, label: `CHILD ${index - totalAdults + 1}` };
    } else {
      return { type: 'infant', number: index - totalAdults - totalChildren + 1, label: `INFANT ${index - totalAdults - totalChildren + 1}` };
    }
  };
  
  // Handle fare selection
  const handleFareSelection = (fareType) => {
    setSelectedFare(fareType);
  };
  
  // Refs for scrolling to sections (for display reference only)
  const panelContentRef = useRef(null);
  
  if (!isOpen || !flightData) return null;

  const navigationSteps = [
    { id: "trip-summary", label: "Trip Summary" },
    { id: "traveller-details", label: "Traveller Details" },
    // { id: "seats-meals", label: "Seats & Meals" }, // COMMENTED OUT
    // { id: "add-ons", label: "Add-Ons" }, // COMMENTED OUT
    { id: "fare-details", label: "Fare Details" }
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
    
    // If on Review Booking (step 3), show confirmation modal
    if (currentStepIndex === 3) {
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
      
      // Close confirmation modal and show success modal
      setShowConfirmationModal(false);
      setShowSuccessModal(true);
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
                  <span className="flight-date-text">{flightData.departureDate || "Friday, Feb 13"}</span>
                  <span className="flight-stops-duration">{flightData.stops} · {flightData.duration}</span>
                </div>
                <a 
                  href="#" 
                  className="fare-rules-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedFlightForFareRules('outbound');
                    setFareRulesTab('cancellation');
                    setFareRulesModalOpen(true);
                  }}
                >
                  View Fare Rules
                </a>
              </div>

              {/* Airline Info Row */}
              <div className="airline-row">
                <div className="airline-left-section">
                  <img src={flightData.airlineLogo} alt={flightData.airline} className="airline-logo-img" />
                  <div className="airline-details">
                    <span className="airline-name-text">{flightData.airline}</span>
                    <span className="flight-number-text">{flightData.flightCode}</span>
                    {flightData.layout && <span className="aircraft-type-badge">{flightData.layout}</span>}
                  </div>
                </div>
                <div className="economy-class-text">
                  Economy &gt; <span className="fare-class">SAVER</span>
                </div>
              </div>

              {/* Flight Timeline */}
              <div className="flight-journey-timeline">
                {/* Departure */}
                <div className="journey-point-section">
                  <div className="journey-time">{flightData.departureTime}</div>
                  <div className="journey-city">{flightData.departureCity}</div>
                  <div className="journey-location">{flightData.departureCity} Airport</div>
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
                  <div className="journey-location">{flightData.arrivalCity} International Airport, {flightData.arrivalTerminal}</div>
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

            {/* Return Journey Section - For Round Trip */}
            {flightData.isRoundTrip && flightData.returnFlight && (
              <div className="flight-summary-panel">
                {/* Top Header Row */}
                <div className="flight-header-row">
                  <div className="flight-route-title">{flightData.arrivalCity} → {flightData.departureCity}</div>
                  <div className="cancellation-badge">CANCELLATION FEES APPLY</div>
                </div>

                {/* Date and Duration Row */}
                <div className="flight-date-row">
                  <div className="date-duration-left">
                    <span className="flight-date-text">{flightData.returnFlight.departureDate || "Saturday, Feb 15"}</span>
                    <span className="flight-stops-duration">{flightData.returnFlight.stops} · {flightData.returnFlight.duration}</span>
                  </div>
                  <a 
                    href="#" 
                    className="fare-rules-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFlightForFareRules('return');
                      setFareRulesTab('cancellation');
                      setFareRulesModalOpen(true);
                    }}
                  >
                    View Fare Rules
                  </a>
                </div>

                {/* Airline Info Row */}
                <div className="airline-row">
                  <div className="airline-left-section">
                    <img src={flightData.returnFlight.airlineLogo} alt={flightData.returnFlight.airline} className="airline-logo-img" />
                    <div className="airline-details">
                      <span className="airline-name-text">{flightData.returnFlight.airline}</span>
                      <span className="flight-number-text">{flightData.returnFlight.flightCode}</span>
                      {flightData.returnFlight.layout && <span className="aircraft-type-badge">{flightData.returnFlight.layout}</span>}
                    </div>
                  </div>
                  <div className="economy-class-text">
                    Economy &gt; <span className="fare-class">SAVER</span>
                  </div>
                </div>

                {/* Flight Timeline */}
                <div className="flight-journey-timeline">
                  {/* Departure */}
                  <div className="journey-point-section">
                    <div className="journey-time">{flightData.returnFlight.departureTime}</div>
                    <div className="journey-city">{flightData.arrivalCity}</div>
                    <div className="journey-location">{flightData.arrivalCity} Airport</div>
                  </div>

                  {/* Duration Line */}
                  <div className="journey-duration-line">
                    <div className="duration-text-center">{flightData.returnFlight.duration}</div>
                    <div className="timeline-visual">
                      <div className="journey-circle"></div>
                      <div className="dotted-line"></div>
                      <div className="journey-circle"></div>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="journey-point-section">
                    <div className="journey-time">{flightData.returnFlight.arrivalTime}</div>
                    <div className="journey-city">{flightData.departureCity}</div>
                    <div className="journey-location">{flightData.departureCity} International Airport</div>
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
            )}

            {/* Refund on Cancellation Section */}
            <div className="refund-cancellation-section">
              <div className="refund-header">
                <h3 className="refund-title">Refund on Cancellation</h3>
                <a 
                  href="#" 
                  className="cancellation-policy-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setCancellationPolicyTab('cancellation');
                    setTermsExpanded(false);
                    setSelectedCancellationFlight('outbound');
                    setCancellationPolicyModalOpen(true);
                  }}
                >
                  Cancellation &amp; Rescheduling Policy
                </a>
              </div>

              {/* Outbound Flight Refund Timeline */}
              <div className="refund-route">{flightData.departureLocation} - {flightData.arrivalLocation}</div>

              <div className="refund-timeline">
                <div className="refund-point">
                  <div className="refund-amount">₹2217 refund</div>
                  <div className="timeline-marker marker-yellow"></div>
                  <div className="refund-time-label">Now</div>
                  <div className="refund-time-value">17:24</div>
                </div>

                <div className="refund-point">
                  <div className="refund-amount">Non Refundable</div>
                  <div className="timeline-marker marker-red"></div>
                  <div className="refund-time-label">22 Feb</div>
                  <div className="refund-time-value">00:30</div>
                </div>

                <div className="refund-point">
                  <div className="refund-amount">&nbsp;</div>
                  <div className="timeline-marker marker-red-dark">
                    <span className="plane-icon">✈</span>
                  </div>
                  <div className="refund-time-label">Departure</div>
                  <div className="refund-time-value">22 Feb, 04:30</div>
                </div>

                <div className="timeline-line">
                  <div className="line-segment segment-yellow"></div>
                  <div className="line-segment segment-red"></div>
                </div>
              </div>

              {/* Return Flight Refund Timeline - For Round Trip Only */}
              {flightData.isRoundTrip && flightData.returnFlight && (
                <>
                  <div className="refund-route">{flightData.arrivalLocation} - {flightData.departureLocation}</div>

                  <div className="refund-timeline">
                    <div className="refund-point">
                      <div className="refund-amount">Non Refundable</div>
                      <div className="timeline-marker marker-red"></div>
                      <div className="refund-time-label">Now</div>
                      <div className="refund-time-value">17:24</div>
                    </div>

                    <div className="refund-point">
                      <div className="refund-amount">&nbsp;</div>
                      <div className="timeline-marker marker-red-dark">
                        <span className="plane-icon">✈</span>
                      </div>
                      <div className="refund-time-label">Departure</div>
                      <div className="refund-time-value">26 Feb, 23:40</div>
                    </div>

                    <div className="timeline-line">
                      <div className="line-segment segment-red"></div>
                    </div>
                  </div>
                </>
              )}
            </div>

          {/* ===== FARE UPGRADE SECTION - COMMENTED OUT =====
            <div className="fare-upgrade-section">
              <h3 className="fare-upgrade-title">Get more benefits by upgrading your fare</h3>
              
              <div className="fare-options-grid">
                <div 
                  className={`fare-option-card ${selectedFare === 'your-selection' ? 'selected' : ''}`}
                  onClick={() => handleFareSelection('your-selection')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="fare-card-header">
                    <input 
                      type="radio" 
                      name="fare" 
                      checked={selectedFare === 'your-selection'} 
                      onChange={() => handleFareSelection('your-selection')}
                      className="fare-radio" 
                    />
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

                <div 
                  className={`fare-option-card ${selectedFare === 'mmt-regular' ? 'selected' : ''}`}
                  onClick={() => handleFareSelection('mmt-regular')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="fare-card-header">
                    <input 
                      type="radio" 
                      name="fare" 
                      checked={selectedFare === 'mmt-regular'} 
                      onChange={() => handleFareSelection('mmt-regular')}
                      className="fare-radio" 
                    />
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

                <div 
                  className={`fare-option-card ${selectedFare === 'mmt-premium' ? 'selected' : ''}`}
                  onClick={() => handleFareSelection('mmt-premium')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="fare-card-header">
                    <input 
                      type="radio" 
                      name="fare" 
                      checked={selectedFare === 'mmt-premium'} 
                      onChange={() => handleFareSelection('mmt-premium')}
                      className="fare-radio" 
                    />
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
          ===== END OF FARE UPGRADE SECTION ===== */}
          </>
        );
        
      
      case 1: // Traveller Details
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

            {/* Traveller Forms - Dynamically rendered based on adults, children, infants */}
            {Array.from({ length: visibleTravellers }).map((_, index) => {
              const travellerInfo = getTravellerInfo(index);
              
              return (
                <div key={index} className="traveller-form-card">
                  <div className="adult-header">
                    <label className="adult-checkbox-label">
                      <input type="checkbox" className="adult-checkbox" defaultChecked />
                      <span className="adult-title">{travellerInfo.label}</span>
                    </label>
                  </div>

                  {/* Name Row with Title (Title only for adults) */}
                  <div className="form-row name-title-row">
                    {travellerInfo.type === 'adult' && (
                      <select 
                        className="form-input form-select-title"
                        value={travellersData[index].title}
                        onChange={(e) => updateTravellerData(index, 'title', e.target.value)}
                      >
                        <option value="">Title</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Mstr">Mstr</option>
                        <option value="Miss">Miss</option>
                      </select>
                    )}
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="First & Middle Name"
                      value={travellersData[index].firstName}
                      onChange={(e) => updateTravellerData(index, 'firstName', e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Last Name"
                      value={travellersData[index].lastName}
                      onChange={(e) => updateTravellerData(index, 'lastName', e.target.value)}
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
                      value={travellersData[index].countryCode}
                      onChange={(e) => updateTravellerData(index, 'countryCode', e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Mobile No(Optional)"
                      value={travellersData[index].mobile}
                      onChange={(e) => updateTravellerData(index, 'mobile', e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Email(Optional)"
                      value={travellersData[index].email}
                      onChange={(e) => updateTravellerData(index, 'email', e.target.value)}
                    />
                  </div>

                  {/* Wheelchair Checkbox */}
                  <div className="wheelchair-option">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        className="option-checkbox"
                        checked={travellersData[index].wheelchair}
                        onChange={(e) => updateTravellerData(index, 'wheelchair', e.target.checked)}
                      />
                      <span className="checkbox-text">I require wheelchair <span className="optional-text">(Optional)</span></span>
                    </label>
                  </div>

                  {/* Add New Traveller Button - Show only after current form and if more travellers expected */}
                  {index === visibleTravellers - 1 && visibleTravellers < totalTravellers && (
                    <div className="add-adult-section">
                      <button 
                        className="add-adult-btn"
                        onClick={() => setVisibleTravellers(visibleTravellers + 1)}
                      >
                        + ADD NEW TRAVELLER
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

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

            {/* ===== BILLING ADDRESS SECTION - COMMENTED OUT =====
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
            ===== END OF BILLING ADDRESS SECTION ===== */}
          </div>
        );
      
      /* ===== CASE 2: SEATS & MEALS - COMMENTED OUT =====
      case 2: // Seats & Meals
        return <SeatsAndMealsSection 
          flightData={flightData} 
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          selectedMeal={selectedMeal}
          setSelectedMeal={setSelectedMeal}
        />;
      ===== END OF SEATS & MEALS CASE ===== */
      
      /* ===== CASE 2: ADD-ONS - COMMENTED OUT =====
      case 2: // Add-Ons (was case 3)
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
      ===== END OF ADD-ONS CASE ===== */
      
      case 2: // Fare Details
        // Get passenger counts from flightData
        const numAdults = flightData?.adults || 1;
        const numChildren = flightData?.children || 0;
        const numInfants = flightData?.infants || 0;
        
        // Price per passenger type (base fare)
        const adultBaseFare = 4500;
        const childBaseFare = Math.floor(adultBaseFare * 0.75); // 75% of adult fare
        const infantBaseFare = Math.floor(adultBaseFare * 0.10); // 10% of adult fare
        
        // Calculate total base fare
        const totalBaseFare = (numAdults * adultBaseFare) + (numChildren * childBaseFare) + (numInfants * infantBaseFare);
        
        // Taxes and fees (proportional to base fare)
        const taxesPerAdult = 850;
        const totalTaxes = Math.floor(((numAdults + numChildren * 0.75 + numInfants * 0.10) * taxesPerAdult));
        
        // Build passenger label
        let passengerLabel = '';
        if (numAdults > 0) passengerLabel += `${numAdults} Adult${numAdults > 1 ? 's' : ''}`;
        if (numChildren > 0) passengerLabel += (passengerLabel ? ' and ' : '') + `${numChildren} Child${numChildren > 1 ? 'ren' : ''}`;
        if (numInfants > 0) passengerLabel += (passengerLabel ? ' and ' : '') + `${numInfants} Infant${numInfants > 1 ? 's' : ''}`;
        
        // Calculate grand total
        const grandTotal = totalBaseFare + totalTaxes + (baggageSelected ? selectedBaggageWeight.price * baggageQuantity : 0);
        
        return (
          <div className="flight-step-content">
            <div className="fare-details-section">
              <h2 className="fare-details-title">Fare Breakdown</h2>
              
              {/* Price Summary */}
              <div className="fare-summary-card">
                <div className="fare-row">
                  <span className="fare-label">Base Fare ({passengerLabel})</span>
                  <span className="fare-value">₹{totalBaseFare.toLocaleString('en-IN')}</span>
                </div>
                
                {/* Show detailed breakdown if multiple passenger types */}
                {(numAdults > 0 || numChildren > 0 || numInfants > 0) && (numChildren > 0 || numInfants > 0) && (
                  <div className="fare-breakdown-details">
                    {numAdults > 0 && (
                      <div className="fare-sub-row">
                        <span className="fare-sub-label">• {numAdults} Adult{numAdults > 1 ? 's' : ''} @ ₹{adultBaseFare.toLocaleString('en-IN')}</span>
                        <span className="fare-sub-value">₹{(numAdults * adultBaseFare).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {numChildren > 0 && (
                      <div className="fare-sub-row">
                        <span className="fare-sub-label">• {numChildren} Child{numChildren > 1 ? 'ren' : ''} @ ₹{childBaseFare.toLocaleString('en-IN')}</span>
                        <span className="fare-sub-value">₹{(numChildren * childBaseFare).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {numInfants > 0 && (
                      <div className="fare-sub-row">
                        <span className="fare-sub-label">• {numInfants} Infant{numInfants > 1 ? 's' : ''} @ ₹{infantBaseFare.toLocaleString('en-IN')}</span>
                        <span className="fare-sub-value">₹{(numInfants * infantBaseFare).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="fare-row">
                  <span className="fare-label">Taxes & Fees</span>
                  <span className="fare-value">₹{totalTaxes.toLocaleString('en-IN')}</span>
                </div>
                {baggageSelected && (
                  <div className="fare-row">
                    <span className="fare-label">Baggage Courier Service</span>
                    <span className="fare-value">₹{(selectedBaggageWeight.price * baggageQuantity).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="fare-divider"></div>
                <div className="fare-row fare-total">
                  <span className="fare-label">Total Amount</span>
                  <span className="fare-value">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              {/* Important Notes */}
              <div className="fare-notes">
                <h3>Important Information</h3>
                <ul>
                  <li>Rates are quoted in INR</li>
                  <li>The airline fee is indicative and can change without prior notice</li>
                  <li>Convenience fee is non-refundable</li>
                  <li>Please review your booking details before proceeding</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 3: // Review Booking (Hidden from navigation)
        return (
          <div className="flight-step-content">
            <div className="review-booking-section">
              <h2 className="review-booking-title">Review Your Booking</h2>
              
              {/* Departure Flight Details */}
              <div className="review-section">
                <h3 className="review-section-title">Departure Flight</h3>
              </div>
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
              
              {/* Return Flight Details (if exists) */}
              {flightData.isRoundTrip && flightData.returnFlight && (
                <>
                  <div className="review-section">
                    <h3 className="review-section-title">Return Flight</h3>
                  </div>
                  <div className="review-flight-card">
                    <div className="review-flight-header">
                      <div className="review-airline-info">
                        <img src={flightData.returnFlight.airlineLogo} alt={flightData.returnFlight.airline} className="review-airline-logo" />
                        <span className="review-airline-name">{flightData.returnFlight.airline}</span>
                      </div>
                      <span className="review-fare-type">SAVER</span>
                    </div>
                    
                    <div className="review-flight-timing">
                      <div className="review-time-section">
                        <div className="review-main-time">{flightData.returnFlight.departureTime}</div>
                        <div className="review-date">Friday, Feb 13</div>
                        <div className="review-airport">{flightData.arrivalCity}</div>
                      </div>
                      
                      <div className="review-duration-section">
                        <div className="review-duration">{flightData.returnFlight.duration}</div>
                        <div className="review-stop-type">{flightData.returnFlight.stops === '0 Stops' || flightData.returnFlight.stops === 0 ? 'Non Stop' : flightData.returnFlight.stops}</div>
                      </div>
                      
                      <div className="review-time-section">
                        <div className="review-main-time">{flightData.returnFlight.arrivalTime}</div>
                        <div className="review-date">Friday, Feb 13</div>
                        <div className="review-airport">{flightData.departureCity}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Travellers Section */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3 className="review-section-title">Travellers</h3>
                  {visibleTravellers > 1 && (
                    <button 
                      className="travellers-toggle-btn"
                      onClick={() => setTravellersExpanded(!travellersExpanded)}
                      aria-label={travellersExpanded ? "Collapse travellers" : "View all travellers"}
                    >
                      {travellersExpanded ? '▲' : '▼'}
                    </button>
                  )}
                </div>
                {Array.from({ length: travellersExpanded ? visibleTravellers : 1 }).map((_, index) => {
                  const travellerInfo = getTravellerInfo(index);
                  return (
                    <div key={index} className="review-traveller-card">
                      <h4 className="review-traveller-label">{travellerInfo.label}</h4>
                      {travellerInfo.type === 'adult' && (
                        <div className="review-detail-row">
                          <span className="review-detail-label">Title:</span>
                          <span className="review-detail-value">{travellersData[index].title || 'Not provided'}</span>
                        </div>
                      )}
                      <div className="review-detail-row">
                        <span className="review-detail-label">First & Middle Name:</span>
                        <span className="review-detail-value">{travellersData[index].firstName || 'Not provided'}</span>
                      </div>
                      <div className="review-detail-row">
                        <span className="review-detail-label">Last Name:</span>
                        <span className="review-detail-value">{travellersData[index].lastName || 'Not provided'}</span>
                      </div>
                      {travellersData[index].countryCode && (
                        <div className="review-detail-row">
                          <span className="review-detail-label">Country Code:</span>
                          <span className="review-detail-value">{travellersData[index].countryCode}</span>
                        </div>
                      )}
                      {travellersData[index].mobile && (
                        <div className="review-detail-row">
                          <span className="review-detail-label">Mobile No:</span>
                          <span className="review-detail-value">{travellersData[index].mobile}</span>
                        </div>
                      )}
                      {travellersData[index].email && (
                        <div className="review-detail-row">
                          <span className="review-detail-label">Email:</span>
                          <span className="review-detail-value">{travellersData[index].email}</span>
                        </div>
                      )}
                      {travellersData[index].wheelchair && (
                        <div className="review-detail-row">
                          <span className="review-detail-label">Special Request:</span>
                          <span className="review-detail-value">Wheelchair Required</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* ===== SELECTED SEATS & MEALS - COMMENTED OUT =====
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
              ===== END OF SELECTED SEATS & MEALS ===== */}
              
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
              
              {/* Total Amount Summary */}
              <div className="review-section">
                <h3 className="review-section-title">Total Amount</h3>
                <div className="review-total-card">
                  {(() => {
                    // Calculate same values as Fare Details section
                    const numAdults = flightData?.adults || 1;
                    const numChildren = flightData?.children || 0;
                    const numInfants = flightData?.infants || 0;
                    
                    const adultBaseFare = 4500;
                    const childBaseFare = Math.floor(adultBaseFare * 0.75);
                    const infantBaseFare = Math.floor(adultBaseFare * 0.10);
                    
                    const totalBaseFare = (numAdults * adultBaseFare) + (numChildren * childBaseFare) + (numInfants * infantBaseFare);
                    const taxesPerAdult = 850;
                    const totalTaxes = Math.floor(((numAdults + numChildren * 0.75 + numInfants * 0.10) * taxesPerAdult));
                    const grandTotal = totalBaseFare + totalTaxes + (baggageSelected ? selectedBaggageWeight.price * baggageQuantity : 0);
                    
                    return (
                      <>
                        <div className="review-detail-row">
                          <span className="review-detail-label">Base Fare:</span>
                          <span className="review-detail-value">₹{totalBaseFare.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="review-detail-row">
                          <span className="review-detail-label">Taxes & Fees:</span>
                          <span className="review-detail-value">₹{totalTaxes.toLocaleString('en-IN')}</span>
                        </div>
                        {baggageSelected && (
                          <div className="review-detail-row">
                            <span className="review-detail-label">Baggage Service:</span>
                            <span className="review-detail-value">₹{(selectedBaggageWeight.price * baggageQuantity).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="review-total-divider"></div>
                        <div className="review-detail-row review-total-row">
                          <span className="review-total-label">Grand Total:</span>
                          <span className="review-total-value">₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
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
            {currentStepIndex === 3 ? 'COMPLETE BOOKING' : 'CONTINUE'}
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

      {/* Success Modal */}
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
              <p className="success-modal-coins"> <strong>You Successfully Created Your Flight Booking !!</strong></p>
              <button className="success-modal-btn" onClick={() => {
                setShowSuccessModal(false);
                onClose();
                navigate('/');
                window.scrollTo(0, 0);
              }}>
                Go Home
              </button>
            </div>
          </div>
        </>
      )}

      {/* Fare Rules Modal */}
      {fareRulesModalOpen && (
        <>
          <div className="fare-rules-modal-backdrop" onClick={() => setFareRulesModalOpen(false)}></div>
          <div className="fare-rules-modal">
            <div className="fare-rules-modal-header">
              <h2 className="fare-rules-modal-title">Fare rules</h2>
              <button 
                className="fare-rules-modal-close"
                onClick={() => setFareRulesModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="fare-rules-tabs">
              <button 
                className={`fare-rules-tab ${fareRulesTab === 'cancellation' ? 'active' : ''}`}
                onClick={() => setFareRulesTab('cancellation')}
              >
                Cancellation Charges
              </button>
              <button 
                className={`fare-rules-tab ${fareRulesTab === 'dateChange' ? 'active' : ''}`}
                onClick={() => setFareRulesTab('dateChange')}
              >
                Date change charges
              </button>
            </div>

            <div className="fare-rules-content">
              <div className="fare-rules-flight-code">
                <img 
                  src={selectedFlightForFareRules === 'outbound' ? flightData.airlineLogo : flightData.returnFlight?.airlineLogo || flightData.airlineLogo} 
                  alt="airline" 
                  className="fare-rules-airline-icon"
                />
                <span>
                  {selectedFlightForFareRules === 'outbound' 
                    ? `${flightData.departureCity?.substring(0, 3).toUpperCase()}-${flightData.arrivalCity?.substring(0, 3).toUpperCase()}`
                    : `${flightData.arrivalCity?.substring(0, 3).toUpperCase()}-${flightData.departureCity?.substring(0, 3).toUpperCase()}`
                  }
                </span>
              </div>

              {fareRulesTab === 'cancellation' ? (
                <div className="fare-rules-table">
                  <div className="fare-rules-table-header">
                    <div className="fare-rules-col-left">
                      <div className="fare-rules-header-title">Time frame</div>
                      <div className="fare-rules-header-subtitle">(From Scheduled Flight departure)</div>
                    </div>
                    <div className="fare-rules-col-right">
                      <div className="fare-rules-header-title">Airline Fee + MMT Fee</div>
                      <div className="fare-rules-header-subtitle">(Per passenger)</div>
                    </div>
                  </div>

                  <div className="fare-rules-table-body">
                    <div className="fare-rules-table-row">
                      <div className="fare-rules-col-left">0 hours to 3 hours*</div>
                      <div className="fare-rules-col-right">
                        <div>ADULT : <strong>Non Refundable</strong></div>
                      </div>
                    </div>
                    <div className="fare-rules-table-row">
                      <div className="fare-rules-col-left">3 hours to 365 days*</div>
                      <div className="fare-rules-col-right">
                        <div>ADULT : <strong>Non Refundable</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="fare-rules-footer-note">*From the Time of Departure</div>
                </div>
              ) : (
                <div className="fare-rules-table">
                  <div className="fare-rules-table-header">
                    <div className="fare-rules-col-left">
                      <div className="fare-rules-header-title">Time frame</div>
                      <div className="fare-rules-header-subtitle">(From Scheduled Flight departure)</div>
                    </div>
                    <div className="fare-rules-col-right">
                      <div className="fare-rules-header-title">Airline Fee + MMT Fee + Fare difference</div>
                      <div className="fare-rules-header-subtitle">(Per passenger)</div>
                    </div>
                  </div>

                  <div className="fare-rules-table-body">
                    <div className="fare-rules-table-row">
                      <div className="fare-rules-col-left">0 hours to 3 hours*</div>
                      <div className="fare-rules-col-right">
                        <div>ADULT : <strong>Non Changeable</strong></div>
                      </div>
                    </div>
                    <div className="fare-rules-table-row">
                      <div className="fare-rules-col-left">3 hours to 365 days*</div>
                      <div className="fare-rules-col-right">
                        <div>ADULT : <strong>₹ 2,999 + ₹ 350 + Fare difference</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="fare-rules-footer-note">*From the Time of Departure</div>
                </div>
              )}

              <div className="fare-rules-disclaimer">
                <strong>*Important:</strong> The Airline fee is indicative. MakeMyTrip does not guarantee the accuracy of this information. All fees mentioned are per passenger. {fareRulesTab === 'dateChange' && 'Date change charges are applicable only on selecting the same Airline on a new date. The difference in fares between the old and the new booking will also be payable by the user. Please refer to the Date Change Charges section above for details on the number of allowed free date changes, if applicable'}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cancellation & Rescheduling Policy Modal */}
      {cancellationPolicyModalOpen && (
        <>
          <div className="cancellation-policy-modal-backdrop" onClick={() => {
            setCancellationPolicyModalOpen(false);
            setTermsExpanded(false);
            setSelectedCancellationFlight('outbound');
          }}></div>
          <div className="cancellation-policy-modal">
            <button 
              className="cancellation-policy-modal-close"
              onClick={() => {
                setCancellationPolicyModalOpen(false);
                setTermsExpanded(false);
                setSelectedCancellationFlight('outbound');
              }}
            >
              ×
            </button>

            <div className="cancellation-policy-tabs">
              <button 
                className={`cancellation-policy-tab ${cancellationPolicyTab === 'cancellation' ? 'active' : ''}`}
                onClick={() => {
                  setCancellationPolicyTab('cancellation');
                  setTermsExpanded(false);
                  setSelectedCancellationFlight('outbound');
                }}
              >
                Cancellation
              </button>
              <button 
                className={`cancellation-policy-tab ${cancellationPolicyTab === 'reschedule' ? 'active' : ''}`}
                onClick={() => {
                  setCancellationPolicyTab('reschedule');
                  setTermsExpanded(false);
                  setSelectedCancellationFlight('outbound');
                }}
              >
                Reschedule
              </button>
            </div>

            <div className="cancellation-policy-content">
              {cancellationPolicyTab === 'cancellation' ? (
                <>
                  <p className="cancellation-policy-subtitle">
                    *Cancellation charges applicable (Airline fee + ixigo fee)
                  </p>

                  {flightData.isRoundTrip && flightData.returnFlight && (
                    <div className="flight-selector-buttons">
                      <button 
                        className={`flight-selector-btn ${selectedCancellationFlight === 'outbound' ? 'active' : ''}`}
                        onClick={() => setSelectedCancellationFlight('outbound')}
                      >
                        {flightData.departureCity?.substring(0, 3).toUpperCase()} - {flightData.arrivalCity?.substring(0, 3).toUpperCase()}
                      </button>
                      <button 
                        className={`flight-selector-btn ${selectedCancellationFlight === 'return' ? 'active' : ''}`}
                        onClick={() => setSelectedCancellationFlight('return')}
                      >
                        {flightData.arrivalCity?.substring(0, 3).toUpperCase()} - {flightData.departureCity?.substring(0, 3).toUpperCase()}
                      </button>
                    </div>
                  )}

                  <div className="cancellation-policy-timeline">
                    <div className="timeline-status-text">Non Refundable</div>
                    
                    <div className="timeline-bar-wrapper cancellation-timeline-wrapper">
                      <div className="timeline-bar red-bar">
                        <div className="timeline-icon left-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#ef4444"/>
                            <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="timeline-icon right-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#dc2626"/>
                            <path d="M7 12h10M13 8l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-labels">
                      <div className="timeline-label-left">
                        <div className="timeline-label-title">Now</div>
                        <div className="timeline-label-time">
                          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                      </div>
                      <div className="timeline-label-right">
                        <div className="timeline-label-title">Departure</div>
                        <div className="timeline-label-time">
                          {selectedCancellationFlight === 'outbound' 
                            ? (flightData.departureDate ? `${flightData.departureDate.split(',')[1]?.trim().split(' ')[1] || '05'} Mar` : '05 Mar') + ', ' + (flightData.departureTime || '05:30')
                            : (flightData.returnFlight?.departureDate ? `${flightData.returnFlight.departureDate.split(',')[1]?.trim().split(' ')[1] || '15'} Mar` : '15 Mar') + ', ' + (flightData.returnFlight?.departureTime || '23:40')
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="cancellation-policy-footer-text">
                    Total refund amount applicable for {totalTravellers} traveller{totalTravellers > 1 ? 's' : ''}. In case of partial cancellation, refund amount will vary.
                  </p>
                  <a 
                    href="#" 
                    className="cancellation-policy-terms-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setTermsExpanded(!termsExpanded);
                    }}
                  >
                    {termsExpanded ? 'Hide Terms & Conditions' : 'View Terms & Conditions'}
                  </a>
                  
                  {termsExpanded && (
                    <div className="terms-conditions-section">
                      <h3 className="terms-conditions-title">Terms & Conditions</h3>
                      <ol className="terms-conditions-list">
                        <li>Cancellation charges are applicable per passenger per sector.</li>
                        <li>Discount and Assured fee, if any, will be adjusted in the final refund amount.</li>
                        <li>Partial cancellation cannot be made for tickets booked under special or discounted fares.</li>
                        <li>In case of a no-show or for tickets cancelled post a specific time, only statutory taxes are refundable.</li>
                        <li>Penalty charged by the airline is indicative only and may change without any prior notice. ixigo does not guarantee the accuracy of this information.</li>
                        <li>Cancellation request will be processed only within the mentioned time period.</li>
                        <li>If the flight fare is less than default cancellation penalty then taxes will be refundable.</li>
                        <li>In the event of cancellation, the discount applied to your booking will be non-refundable and fully recovered from the refund amount.</li>
                      </ol>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="cancellation-policy-subtitle">
                    *Rescheduling charges applicable (Airline fee + ixigo fee)
                  </p>

                  {flightData.isRoundTrip && flightData.returnFlight && (
                    <div className="flight-selector-buttons">
                      <button 
                        className={`flight-selector-btn ${selectedCancellationFlight === 'outbound' ? 'active' : ''}`}
                        onClick={() => setSelectedCancellationFlight('outbound')}
                      >
                        {flightData.departureCity?.substring(0, 3).toUpperCase()} - {flightData.arrivalCity?.substring(0, 3).toUpperCase()}
                      </button>
                      <button 
                        className={`flight-selector-btn ${selectedCancellationFlight === 'return' ? 'active' : ''}`}
                        onClick={() => setSelectedCancellationFlight('return')}
                      >
                        {flightData.arrivalCity?.substring(0, 3).toUpperCase()} - {flightData.departureCity?.substring(0, 3).toUpperCase()}
                      </button>
                    </div>
                  )}

                  <div className="cancellation-policy-timeline">
                    <div className="timeline-status-left">₹6996 + fare difference</div>
                    <div className="timeline-status-left-sub">(₹5998 + ₹998)*</div>
                    <div className="timeline-status-right">Non Changeable</div>
                    
                    <div className="timeline-bar-wrapper">
                      <div className="timeline-bar multi-bar">
                        <div className="timeline-segment yellow-segment"></div>
                        <div className="timeline-segment red-segment"></div>
                        <div className="timeline-icon left-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#f59e0b"/>
                            <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="timeline-icon middle-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#ef4444"/>
                          </svg>
                        </div>
                        <div className="timeline-icon right-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#dc2626"/>
                            <path d="M7 12h10M13 8l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="timeline-labels reschedule-labels">
                      <div className="timeline-label-left">
                        <div className="timeline-label-title">Now</div>
                        <div className="timeline-label-time">
                          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                      </div>
                      <div className="timeline-label-middle">
                        <div className="timeline-label-title">
                          {selectedCancellationFlight === 'outbound'
                            ? (flightData.departureDate ? `${flightData.departureDate.split(',')[1]?.trim().split(' ')[1] || '05'} Mar` : '05 Mar')
                            : (flightData.returnFlight?.departureDate ? `${flightData.returnFlight.departureDate.split(',')[1]?.trim().split(' ')[1] || '15'} Mar` : '15 Mar')
                          }
                        </div>
                        <div className="timeline-label-time">02:30</div>
                      </div>
                      <div className="timeline-label-right">
                        <div className="timeline-label-title">Departure</div>
                        <div className="timeline-label-time">
                          {selectedCancellationFlight === 'outbound'
                            ? (flightData.departureDate ? `${flightData.departureDate.split(',')[1]?.trim().split(' ')[1] || '05'} Mar` : '05 Mar') + ', ' + (flightData.departureTime || '05:30')
                            : (flightData.returnFlight?.departureDate ? `${flightData.returnFlight.departureDate.split(',')[1]?.trim().split(' ')[1] || '15'} Mar` : '15 Mar') + ', ' + (flightData.returnFlight?.departureTime || '23:40')
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="cancellation-policy-footer-text">
                    Rescheduling fee is applicable for {totalTravellers} traveller{totalTravellers > 1 ? 's' : ''}. In case of partial reschedule, rescheduling fee will vary.
                  </p>
                  <a 
                    href="#" 
                    className="cancellation-policy-terms-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setTermsExpanded(!termsExpanded);
                    }}
                  >
                    {termsExpanded ? 'Hide Terms & Conditions' : 'View Terms & Conditions'}
                  </a>
                  
                  {termsExpanded && (
                    <div className="terms-conditions-section">
                      <h3 className="terms-conditions-title">Terms & Conditions</h3>
                      <p className="terms-conditions-intro">In case of flight rescheduling the following terms and conditions will apply:</p>
                      <ol className="terms-conditions-list">
                        <li>Penalty charged by the airline is indicative only and may change without any prior notice. ixigo does not guarantee the accuracy of this information.</li>
                        <li>Get one free change of date, sector and airline per passenger with ixigo Flex.</li>
                        <li>Discount and Flex fee, if any, will be adjusted in the final refund amount.</li>
                        <li>Reschedule request will be processed only within the mentioned time period.</li>
                        <li>The difference in fares between the old and the new booking will also be payable by the user.</li>
                      </ol>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FlightBookingPanel;
