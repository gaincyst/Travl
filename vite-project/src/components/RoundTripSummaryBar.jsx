import React from "react";
import "../styles/RoundTripSummaryBar.css";

function RoundTripSummaryBar({ outboundFlight, returnFlight, onBookNow }) {
  if (!outboundFlight || !returnFlight) return null;

  // Calculate total price
  const outboundPrice = parseInt(outboundFlight.price.replace(/[^0-9]/g, ""));
  const returnPrice = parseInt(returnFlight.returnFlight.price.replace(/[^0-9]/g, ""));
  const totalPrice = outboundPrice + returnPrice;

  return (
    <div className="round-trip-summary-bar">
      <div className="summary-bar-container">
        {/* LEFT: Outbound Flight Summary */}
        <div className="summary-section outbound-section">
          <img 
            src={outboundFlight.airlineLogo} 
            alt={outboundFlight.airline} 
            className="summary-airline-logo" 
          />
          <div className="summary-flight-details">
            <div className="summary-airline-name">
              {outboundFlight.airline} • {outboundFlight.flightCode}
            </div>
            <div className="summary-route">
              <span className="summary-time">{outboundFlight.departureTime}</span>
              <span className="summary-city">{outboundFlight.departureLocation}</span>
              <span className="summary-arrow">→</span>
              <span className="summary-time">{outboundFlight.arrivalTime}</span>
              <span className="summary-city">{outboundFlight.arrivalLocation}</span>
            </div>
          </div>
          <div className="summary-price">{outboundFlight.price}</div>
        </div>

        {/* CENTER: Divider */}
        <div className="summary-divider"></div>

        {/* MIDDLE: Return Flight Summary */}
        <div className="summary-section return-section">
          <img 
            src={returnFlight.returnFlight.airlineLogo} 
            alt={returnFlight.returnFlight.airline} 
            className="summary-airline-logo" 
          />
          <div className="summary-flight-details">
            <div className="summary-airline-name">
              {returnFlight.returnFlight.airline} • {returnFlight.returnFlight.flightCode}
            </div>
            <div className="summary-route">
              <span className="summary-time">{returnFlight.returnFlight.departureTime}</span>
              <span className="summary-city">{returnFlight.returnFlight.departureLocation}</span>
              <span className="summary-arrow">→</span>
              <span className="summary-time">{returnFlight.returnFlight.arrivalTime}</span>
              <span className="summary-city">{returnFlight.returnFlight.arrivalLocation}</span>
            </div>
          </div>
          <div className="summary-price">{returnFlight.returnFlight.price}</div>
        </div>

        {/* DIVIDER: Before Actions */}
        <div className="summary-divider"></div>

        {/* RIGHT: Total Price & Book Button */}
        <div className="summary-actions">
          <div className="summary-total">
            <div className="summary-total-label">Total</div>
            <div className="summary-total-price">₹{totalPrice.toLocaleString('en-IN')}</div>
          </div>
          <button className="summary-book-btn" onClick={onBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoundTripSummaryBar;
