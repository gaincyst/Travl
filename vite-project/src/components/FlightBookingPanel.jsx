import React, { useState, useRef } from "react";
import "../styles/FlightBookingPanel.css";

function FlightBookingPanel({ isOpen, onClose, flightData }) {
  // Step navigation state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [stepData, setStepData] = useState({
    tripSummary: {},
    travelDetails: {},
    seatsAndMeals: {},
    addOns: {},
    travelInsurance: {}
  });
  
  // GST checkbox state
  const [hasGST, setHasGST] = useState(false);
  
  // Refs for scrolling to sections (for display reference only)
  const panelContentRef = useRef(null);
  
  if (!isOpen || !flightData) return null;

  const navigationSteps = [
    { id: "trip-summary", label: "Trip Summary" },
    { id: "travel-details", label: "Travels details" },
    { id: "seats-meals", label: "Seats & Meals" },
    { id: "add-ons", label: "Add-Ons" },
    { id: "travel-insurance", label: "Travel Insurance" }
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
    
    // If on Trip Summary (last step), save to backend
    if (currentStepIndex === navigationSteps.length - 1) {
      try {
        // TODO: API call to save booking
        // const response = await saveBooking(stepData);
        console.log("Saving booking data:", stepData);
        
        // After successful save, move to next flow or show confirmation
        alert("Booking saved successfully!");
        // Continue to next flow step without closing panel
      } catch (error) {
        console.error("Error saving booking:", error);
        alert("Failed to save booking. Please try again.");
        return;
      }
    } else {
      // Move to next step
      setCurrentStepIndex(currentStepIndex + 1);
      if (panelContentRef.current) {
        panelContentRef.current.scrollTop = 0;
      }
    }
  };

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

            {/* Adult 1 Form */}
            <div className="traveller-form-card">
              <div className="adult-header">
                <label className="adult-checkbox-label">
                  <input type="checkbox" className="adult-checkbox" defaultChecked />
                  <span className="adult-title">ADULT 1</span>
                </label>
              </div>

              {/* Name Row with Title */}
              <div className="form-row name-title-row">
                <select className="form-input form-select-title">
                  <option value="">Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="First & Middle Name"
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Last Name"
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
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Mobile No(Optional)"
                />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Email(Optional)"
                />
              </div>

              {/* Wheelchair Checkbox */}
              <div className="wheelchair-option">
                <label className="checkbox-label">
                  <input type="checkbox" className="option-checkbox" />
                  <span className="checkbox-text">I require wheelchair <span className="optional-text">(Optional)</span></span>
                </label>
              </div>

              {/* Add New Adult Link */}
              <div className="add-adult-section">
                <button className="add-adult-btn">+ ADD NEW ADULT</button>
              </div>
            </div>

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
        return (
          <div className="flight-step-content">
            <h3 className="step-content-title">Select Seats & Meals</h3>
            {/* Placeholder: Content will be added later */}
            <div className="step-placeholder">
              <p>Seats & Meals content section</p>
            </div>
          </div>
        );
      
      case 3: // Add-Ons
        return (
          <div className="flight-step-content">
            <h3 className="step-content-title">Add Extra Services</h3>
            {/* Placeholder: Content will be added later */}
            <div className="step-placeholder">
              <p>Add-Ons content section</p>
            </div>
          </div>
        );
      
      case 4: // Travel Insurance
        return (
          <div className="flight-step-content">
            <h3 className="step-content-title">Travel Insurance</h3>
            {/* Placeholder: Content will be added later */}
            <div className="step-placeholder">
              <p>Travel Insurance content section</p>
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
      
      {/* Horizontal Navigation Menu */}
      <div className="flight-step-nav">
        {navigationSteps.map((step, index) => (
          <div key={step.id} className="flight-step-item-wrapper">
            {index === 0 && <div className="flight-step-separator">•</div>}
            <button
              className={`flight-step-item ${currentStepIndex === index ? 'flight-step-active' : ''} ${index > currentStepIndex && !completedSteps.includes(index) ? 'flight-step-disabled' : ''}`}
              onClick={() => handleStepClick(index)}
              disabled={index > currentStepIndex && !completedSteps.includes(index)}
            >
              {step.label}
            </button>
            {currentStepIndex === index && <div className="flight-step-indicator"></div>}
            {index < navigationSteps.length - 1 && <div className="flight-step-separator">•</div>}
          </div>
        ))}
      </div>
      
      {/* Side Panel */}
      <div className="passenger-details-panel">
        {/* Close Button */}
        <button className="panel-close-btn" onClick={onClose}>✕</button>
        
        {/* Panel Header */}
        <div className="panel-header">
          <h2>Continue booking</h2>
        </div>

        {/* Panel Content - Dynamic based on current step */}
        <div className="panel-content" ref={panelContentRef}>
          {renderStepContent()}

          {/* Continue Button */}
          <button 
            className="continue-button-flight-panel"
            onClick={handleContinue}
          >
            {currentStepIndex === navigationSteps.length - 1 ? 'COMPLETE BOOKING' : 'CONTINUE'}
          </button>
          <p className="terms-text-flight">By proceeding, I agree to MakeMyTrip's <a href="#">User Agreement</a>, <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>
    </>
  );
}

export default FlightBookingPanel;
