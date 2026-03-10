import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MyTripsNavbar from "../components/MyTripsNavbar";
import "../styles/CancelPage.css";

function CancelPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, service } = location.state || {};
  
  // State management
  const [cancellationReason, setCancellationReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [refundMode, setRefundMode] = useState("original");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  // Passenger/Guest selection state
  const [selectedPassengers, setSelectedPassengers] = useState([0]); // Default: first passenger selected
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  
  // Get primary passenger/guest name from booking data
  const getPrimaryName = () => {
    if (service === "Flights" || service === "Buses") {
      return booking.passengerName || "Guest";
    } else if (service === "Hotels") {
      return booking.guestName || "Guest";
    }
    return "Guest";
  };

  const primaryPassengerName = getPrimaryName();
  
  // Get total passenger/guest count from booking data
  const getTotalCount = () => {
    if (service === "Flights" || service === "Buses") {
      return 1 + (booking.additionalPassengers || 0);
    } else if (service === "Hotels") {
      return 1 + (booking.additionalGuests || 0);
    }
    return 1;
  };

  const totalPassengersCount = getTotalCount();
  
  // Generate names for additional passengers/guests
  const generateAdditionalNames = (count) => {
    const names = ["Priya Sharma", "Aman Sharma", "Riya Patel", "Arjun Singh", "Neha Gupta", "Vikram Reddy"];
    return names.slice(0, count);
  };
  
  // Mock passenger/guest data based on service type
  const getPassengersOrGuests = () => {
    const additionalCount = totalPassengersCount - 1;
    const additionalNames = generateAdditionalNames(additionalCount);
    
    if (service === "Flights" || service === "Buses") {
      const passengers = [
        { id: 0, name: primaryPassengerName, primary: true, route: `(${booking.origin || 'DEL'} to ${booking.destination || 'BOM'})` }
      ];
      additionalNames.forEach((name, index) => {
        passengers.push({ id: index + 1, name: name, primary: false });
      });
      return passengers;
    } else if (service === "Hotels") {
      const guests = [
        { id: 0, name: primaryPassengerName, primary: true, room: "Room 101" }
      ];
      additionalNames.forEach((name, index) => {
        guests.push({ id: index + 1, name: name, primary: false, room: index < 2 ? "Room 101" : "Room 102" });
      });
      return guests;
    }
    return [];
  };

  const passengersOrGuests = getPassengersOrGuests();
  
  // Toggle passenger/guest selection
  const togglePassengerSelection = (id) => {
    setSelectedPassengers(prev => {
      if (prev.includes(id)) {
        // Don't allow deselecting if it's the last one
        if (prev.length === 1) return prev;
        return prev.filter(passengerId => passengerId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // If no booking data, show error
  if (!booking) {
    return (
      <div className="cancel-page">
        <div className="cancel-logo">
          <a href="/">
            <img src="/logos.png" alt="Travel2 Logo" className="cancel-logo-img" />
          </a>
        </div>
        <div className="cancel-container">
          <div className="cancel-booking-card">
            <div className="cancel-card-header">
              Cancel Your Booking
            </div>
            <div className="cancel-card-body">
              <p>No booking data available. Please select a booking to cancel.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract airline/bus operator name from service
  const getServiceProvider = () => {
    if (service === "Flights") {
      return "Indigo Airline";
    } else if (service === "Buses") {
      return "Deluxe Express";
    }
    return "";
  };

  const getFlightNumber = () => {
    return "XY123";
  };

  // Calculate fare breakdown
  const calculateFareBreakdown = () => {
    if (!booking || !booking.amount) {
      return {
        totalAmount: "0.00",
        cancellationCharge: "0.00",
        convenienceFee: "0.00",
        taxDeduction: "0.00",
        refundableAmount: "0.00",
        nonRefundableAmount: "0.00"
      };
    }
    
    const amountStr = booking.amount.toString().replace(/[₹,\s]/g, "");
    const totalAmount = parseFloat(amountStr) || 0;
    
    // Calculate charges based on booking status
    let cancellationCharge = 0;
    let convenienceFee = 50;
    let taxDeduction = 0;
    
    if (booking.status === "INITIATE") {
      // Upcoming booking - minimal charges
      cancellationCharge = totalAmount * 0.10; // 10% cancellation charge
      taxDeduction = totalAmount * 0.05; // 5% tax
    } else {
      // Completed booking - higher charges
      cancellationCharge = totalAmount * 0.30; // 30% cancellation charge
      taxDeduction = totalAmount * 0.05; // 5% tax
    }
    
    const refundableAmount = totalAmount - cancellationCharge - convenienceFee - taxDeduction;
    const nonRefundableAmount = cancellationCharge + convenienceFee + taxDeduction;
    
    return {
      totalAmount: totalAmount.toFixed(2),
      cancellationCharge: cancellationCharge.toFixed(2),
      convenienceFee: convenienceFee.toFixed(2),
      taxDeduction: taxDeduction.toFixed(2),
      refundableAmount: refundableAmount.toFixed(2),
      nonRefundableAmount: nonRefundableAmount.toFixed(2)
    };
  };

  const fareBreakdown = booking ? calculateFareBreakdown() : null;

  // Handle cancellation confirmation
  const handleCancelBooking = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCancellation = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate('/my-trips');
  };

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="cancel-page">
      <MyTripsNavbar />

      <div className="back-to-trips-wrapper">
        <button className="btn-back-to-trips" onClick={() => navigate('/my-trips')}>
          ← Back to My Trips
        </button>
      </div>

      <div className="cancel-container">
        <div className="cancel-booking-card">
          <div className="cancel-card-header">
            Cancel Your Booking
          </div>
          <div className="cancel-card-body">
            
            {/* Ticket Summary Section */}
            {(service === "Flights" || service === "Buses") && (
              <div className="ticket-summary">
                <div className="ticket-summary-left">
                  <div className="airline-logo-section">
                    <img 
                      src={service === "Flights" ? "/airlines/a4.png" : "/buses/bus1.jpg"} 
                      alt={getServiceProvider()} 
                      className="provider-logo" 
                    />
                  </div>
                  <div className="flight-details-section">
                    <div className="provider-name">{getServiceProvider()}</div>
                    <div className="flight-number">
                      {service === "Flights" ? `Flight No. - ${getFlightNumber()}` : `Bus No. - ${booking.txnId?.substring(0, 6) || 'N/A'}`}
                    </div>
                    <div className="flight-number" style={{ color: '#4b5563', marginTop: '2px', fontWeight: 600 }}>
                      {primaryPassengerName}
                    </div>
                    {booking.status === "INITIATE" && (
                      <span className="refundable-badge">Refundable</span>
                    )}
                  </div>
                </div>

                <div className="ticket-summary-middle">
                  <div className="journey-time">
                    <div className="departure-info">
                      <div className="time">{booking.travelTime || 'N/A'}</div>
                      <div className="date">{booking.travelDate || booking.date}</div>
                      <div className="location">{booking.origin || 'N/A'}</div>
                    </div>
                    <div className="journey-arrow">→</div>
                    <div className="arrival-info">
                      <div className="time">12:15</div>
                      <div className="date">{booking.travelDate || booking.date}</div>
                      <div className="location">{booking.destination || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className="ticket-summary-right">
                  <div className="price-section">
                    <div className="price-amount">{booking.amount}</div>
                    <div className="terminal-info">Terminal - 3</div>
                    <div className="booking-ref">Booking No. - {booking.txnId}</div>
                    <div className="invoice-info">Invoice No. - INV{booking.id}890</div>
                  </div>
                </div>
              </div>
            )}

            {/* Hotel Summary Section */}
            {service === "Hotels" && (
              <div className="ticket-summary hotel-summary">
                <div className="ticket-summary-left">
                  <div className="hotel-logo-section">
                    <img 
                      src="/hotels/h1.jpg" 
                      alt={booking.hotelName} 
                      className="provider-logo hotel-logo" 
                    />
                  </div>
                  <div className="hotel-details-section">
                    <div className="hotel-name">{booking.hotelName || 'Hotel'}</div>
                    <div className="hotel-location">{booking.city || 'N/A'}</div>
                    <div className="flight-number" style={{ color: '#4b5563', marginTop: '2px', fontWeight: 600 }}>
                      {primaryPassengerName}
                    </div>
                    {booking.status === "INITIATE" && (
                      <span className="refundable-badge">Refundable</span>
                    )}
                  </div>
                </div>

                <div className="ticket-summary-middle">
                  <div className="hotel-dates">
                    <div className="check-in-info">
                      <div className="label">Check-In</div>
                      <div className="date">{booking.checkIn || 'N/A'}</div>
                    </div>
                    <div className="check-out-info">
                      <div className="label">Check-Out</div>
                      <div className="date">{booking.checkOut || 'N/A'}</div>
                    </div>
                    <div className="room-info">
                      <div>{booking.rooms || 1} Room(s) - {booking.roomType || 'Standard'}</div>
                      <div>{booking.days || 1} Night(s)</div>
                    </div>
                  </div>
                </div>

                <div className="ticket-summary-right">
                  <div className="price-section">
                    <div className="price-amount">{booking.amount}</div>
                    <div className="booking-ref">Booking No. - {booking.txnId}</div>
                    <div className="invoice-info">Invoice No. - INV{booking.id}890</div>
                  </div>
                </div>
              </div>
            )}

            {/* Fare Breakdown Section */}
            <div className="cancellation-section">
              <h3 className="section-title">Fare Breakdown</h3>
              <div className="section-content fare-breakdown">
                <div className="fare-row">
                  <span className="fare-label">Total Booking Amount</span>
                  <span className="fare-value">₹ {fareBreakdown.totalAmount}</span>
                </div>
                <div className="fare-row deduction">
                  <span className="fare-label">Cancellation Charges</span>
                  <span className="fare-value">- ₹ {fareBreakdown.cancellationCharge}</span>
                </div>
                <div className="fare-row deduction">
                  <span className="fare-label">Convenience Fee</span>
                  <span className="fare-value">- ₹ {fareBreakdown.convenienceFee}</span>
                </div>
                <div className="fare-row deduction">
                  <span className="fare-label">Tax Deduction</span>
                  <span className="fare-value">- ₹ {fareBreakdown.taxDeduction}</span>
                </div>
                <div className="fare-row total">
                  <span className="fare-label">Net Refundable Amount</span>
                  <span className="fare-value">₹ {fareBreakdown.refundableAmount}</span>
                </div>
              </div>
            </div>

            {/* Refund Information Section */}
            <div className="cancellation-section">
              <h3 className="section-title">Refund Information</h3>
              <div className="section-content">
                <table className="refund-table">
                  <thead>
                    <tr>
                      <th>Refundable Amount</th>
                      <th>Non-Refundable Amount</th>
                      <th>Refund Mode</th>
                      <th>Expected Refund Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="refund-amount-cell success" data-label="Refundable Amount">₹ {fareBreakdown.refundableAmount}</td>
                      <td className="refund-amount-cell danger" data-label="Non-Refundable Amount">₹ {fareBreakdown.nonRefundableAmount}</td>
                      <td className="refund-mode-cell" data-label="Refund Mode">
                        <div className="refund-mode-options">
                          <label className="radio-option">
                            <input 
                              type="radio" 
                              name="refundMode" 
                              value="original"
                              checked={refundMode === "original"}
                              onChange={(e) => setRefundMode(e.target.value)}
                            />
                            <span>Original Payment</span>
                          </label>
                          <label className="radio-option">
                            <input 
                              type="radio" 
                              name="refundMode" 
                              value="wallet"
                              checked={refundMode === "wallet"}
                              onChange={(e) => setRefundMode(e.target.value)}
                            />
                            <span>Wallet</span>
                          </label>
                          <label className="radio-option">
                            <input 
                              type="radio" 
                              name="refundMode" 
                              value="bank"
                              checked={refundMode === "bank"}
                              onChange={(e) => setRefundMode(e.target.value)}
                            />
                            <span>Bank Account</span>
                          </label>
                        </div>
                      </td>
                      <td className="refund-time-cell" data-label="Expected Refund Time">
                        {refundMode === "wallet" ? "Instant" : refundMode === "bank" ? "5-7 Business Days" : "7-10 Business Days"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status & Confirmation Section */}
            <div className="cancellation-section">
              <h3 className="section-title">Status & Confirmation</h3>
              <div className="section-content">
                <div className="detail-row">
                  <label className="detail-label">Current Booking Status:</label>
                  <span className={`status-badge-cancel status-${booking.status.toLowerCase()}`}>
                    {booking.status === "INITIATE" ? "Confirmed" : booking.status}
                  </span>
                </div>
                <div className="detail-row">
                  <label className="detail-label">Transaction ID:</label>
                  <span className="detail-value">{booking.txnId}</span>
                </div>
                <div className="confirmation-message">
                  <div className="message-icon">ℹ️</div>
                  <div className="message-text">
                    Once cancelled, you will receive a confirmation email and SMS with the cancellation details and refund information.
                  </div>
                </div>
              </div>
            </div>

            {/* Select Passengers/Guests Section */}
            <div className="cancellation-section">
              <h3 className="section-title">
                {service === "Hotels" ? "Select Guests to Cancel" : "Select Passengers to Cancel"}
              </h3>
              <div className="section-content">
                <div className="passenger-dropdown-container">
                  <button 
                    className="passenger-dropdown-button"
                    onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                    type="button"
                  >
                    <span className="dropdown-button-text">
                      {selectedPassengers.length} {service === "Hotels" ? "Guest(s)" : "Passenger(s)"} Selected
                    </span>
                    <span className={`dropdown-arrow ${showPassengerDropdown ? 'open' : ''}`}>▼</span>
                  </button>
                  
                  {showPassengerDropdown && (
                    <div className="passenger-dropdown-list">
                      {passengersOrGuests.map((passenger) => (
                        <div key={passenger.id} className="passenger-checkbox-item">
                          <label className="passenger-checkbox-label">
                            <input 
                              type="checkbox"
                              checked={selectedPassengers.includes(passenger.id)}
                              onChange={() => togglePassengerSelection(passenger.id)}
                              className="passenger-checkbox"
                            />
                            <span className="passenger-name">
                              {passenger.name}
                              {passenger.primary && passenger.route && (
                                <span className="passenger-route"> {passenger.route}</span>
                              )}
                              {passenger.primary && passenger.room && (
                                <span className="passenger-route"> ({passenger.room})</span>
                              )}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cancellation Details Section */}
            <div className="cancellation-section">
              <div className="section-title-with-link">
                <h3 className="section-title">Cancellation Details</h3>
                <button className="policy-link" onClick={() => setShowPolicyModal(true)}>
                  View Cancellation Policy
                </button>
              </div>
              <div className="section-content">
                <div className="detail-row">
                  <label className="detail-label">Cancellation Date & Time:</label>
                  <span className="detail-value">{getCurrentDateTime()}</span>
                </div>
                <div className="detail-row">
                  <label className="detail-label">Cancellation Reason:</label>
                  <select 
                    className="reason-dropdown"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                  >
                    <option value="">Select a reason</option>
                    <option value="change-of-plans">Change of Plans</option>
                    <option value="medical-emergency">Medical Emergency</option>
                    <option value="work-commitment">Work Commitment</option>
                    <option value="found-better-option">Found Better Option</option>
                    <option value="price-issue">Price Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {cancellationReason === "other" && (
                  <div className="detail-row">
                    <label className="detail-label">Please specify:</label>
                    <textarea 
                      className="custom-reason-input"
                      placeholder="Enter your reason..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      rows="3"
                    />
                  </div>
                )}
                
                {/* Need Help Box */}
                <div className="note-box support-info" style={{marginTop: '20px'}}>
                  <h4 className="note-heading">Need Help?</h4>
                  <p className="support-text">
                    <strong>Customer Support:</strong> 1800-123-4567 (Toll Free)<br/>
                    <strong>Email:</strong> support@travel2.com<br/>
                    <strong>Working Hours:</strong> 24/7
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-section">
              <button className="btn-primary btn-cancel" onClick={handleCancelBooking}>
                Proceed to Cancel Booking
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowConfirmModal(false)}></div>
          <div className="confirmation-modal-cancel">
            <div className="modal-header">
              <h3>Confirm Cancellation</h3>
            </div>
            <div className="modal-body">
              <div className="summary-row">
                <span className="summary-label">Booking Amount:</span>
                <span className="summary-value">₹ {fareBreakdown.totalAmount}</span>
              </div>
              <div className="summary-row deduct">
                <span className="summary-label">Cancellation Charge:</span>
                <span className="summary-value">- ₹ {fareBreakdown.cancellationCharge}</span>
              </div>
              <div className="summary-row deduct">
                <span className="summary-label">Convenience Fee:</span>
                <span className="summary-value">- ₹ {fareBreakdown.convenienceFee}</span>
              </div>
              <div className="summary-row deduct">
                <span className="summary-label">Tax Deduction:</span>
                <span className="summary-value">- ₹ {fareBreakdown.taxDeduction}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span className="summary-label">Refund Amount:</span>
                <span className="summary-value">₹ {fareBreakdown.refundableAmount}</span>
              </div>
              <p className="confirm-question">Do you want to proceed with the cancellation?</p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowConfirmModal(false)}>
                No, Go Back
              </button>
              <button className="btn-modal-confirm" onClick={handleConfirmCancellation}>
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="modal-backdrop"></div>
          <div className="success-modal-cancel">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Booking Cancelled Successfully!</h3>
            <p className="success-message">
              Your booking has been cancelled. Refund of ₹{fareBreakdown.refundableAmount} will be processed within{" "}
              {refundMode === "wallet" ? "instant" : refundMode === "bank" ? "5-7 business days" : "7-10 business days"}.
            </p>
            <p className="success-note">
              Cancellation confirmation has been sent to {booking.email}
            </p>
            <div className="success-actions">
              <button className="btn-download">Download Receipt</button>
              <button className="btn-close-success" onClick={handleCloseSuccess}>
                Back to My Trips
              </button>
            </div>
          </div>
        </>
      )}

      {/* Policy Modal */}
      {showPolicyModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowPolicyModal(false)}></div>
          <div className="policy-modal">
            <div className="modal-header">
              <h3>Cancellation & Refund Policies</h3>
              <button className="modal-close-btn" onClick={() => setShowPolicyModal(false)}>×</button>
            </div>
            <div className="modal-body policy-content">
              <div className="policy-section">
                <h4 className="policy-heading">Cancellation Policy</h4>
                <ul className="policy-list">
                  <li>Cancellation charges are {booking.status === "INITIATE" ? "10%" : "30%"} of the total booking amount</li>
                  <li>Convenience fee of ₹{fareBreakdown.convenienceFee} is non-refundable</li>
                  <li>Tax deductions apply as per government regulations</li>
                  <li>Refund will be processed within {refundMode === "wallet" ? "instant" : refundMode === "bank" ? "5-7 business days" : "7-10 business days"}</li>
                  <li>Cancellation must be done at least 2 hours before departure for flights/buses</li>
                  <li>Hotel cancellations must be done 24 hours before check-in for full refund eligibility</li>
                </ul>
              </div>
              <div className="policy-section">
                <h4 className="policy-heading">Non-Refundable Policy</h4>
                <ul className="policy-list">
                  <li>Convenience fees and payment gateway charges are non-refundable</li>
                  <li>Travel insurance (if opted) may have separate cancellation terms</li>
                  <li>Peak season bookings may have additional cancellation charges</li>
                  <li>Special promotional fares may be non-refundable or have higher cancellation charges</li>
                  <li>No-show bookings will not be eligible for any refund</li>
                  <li>Cancellations made after departure/check-in time are not eligible for refunds</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CancelPage;
