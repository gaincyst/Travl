import { useState, useRef, useEffect } from "react";
import { FaPlane, FaHotel, FaBus, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TravellersDropdown from "./TravellersClassDropdown";
import HotelGuestsDropdown from "./HotelGuestsDropdown";
import { useNavigate } from "react-router-dom"; // Navigation Import

function SearchBox({ preFilledData, hideServiceTabs, activeService }) {
  const navigate = useNavigate(); // Initialize hook
  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);
  const returnDatePickerRef = useRef(null);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const [activeTab, setActiveTab] = useState(activeService || "flights");
  const [tripType, setTripType] = useState("oneWay");
  const [openTravellers, setOpenTravellers] = useState(false);
  
  const [startDate, setStartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [checkIn, setCheckIn] = useState(new Date());

  const [displayValue, setDisplayValue] = useState({ total: 1, cabinClass: "Economy" });
  const [tempSelection, setTempSelection] = useState({ adults: 1, children: 0, infants: 0, cabinClass: "Economy" });

  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Bengaluru");

  const [hotelData, setHotelData] = useState({ rooms: 1, adults: 2, children: 0 });

  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleApply = () => {
    const totalTravellers = tempSelection.adults + tempSelection.children + tempSelection.infants;
    setDisplayValue({ total: totalTravellers, cabinClass: tempSelection.cabinClass });
    setOpenTravellers(false);
  };

  // Logic to navigate on Search click
  const handleSearch = () => {
    if (activeTab === "flights") {
      navigate("/flight-results", { 
        state: { fromCity, toCity, startDate, returnDate, displayValue, tripType } 
      });
    } else if (activeTab === "bus") {
      navigate("/bus-results", { 
        state: { fromCity, toCity, startDate, returnDate, tripType } 
      });
    } else if (activeTab === "hotel") {
      navigate("/hotel-results", { 
        state: { city: fromCity, checkInDate: startDate, checkOutDate: returnDate, guests: displayValue } 
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenTravellers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isRoundTripEnabled = (activeTab === 'flights' || activeTab === 'bus') && tripType === "roundTrip";

  return (
    <section className="search-wrapper">
      {/* Conditionally render service tabs based on the prop */}
      {!hideServiceTabs && (
      <div className="service-tabs">
        <div className={`service-tab-item ${activeTab === 'flights' ? 'active' : ''}`} onClick={() => setActiveTab('flights')}>
          <FaPlane /> Flights
        </div>
        <div className={`service-tab-item ${activeTab === 'bus' ? 'active' : ''}`} onClick={() => setActiveTab('bus')}>
          <FaBus /> Buses
        </div>
        <div className={`service-tab-item ${activeTab === 'hotel' ? 'active' : ''}`} onClick={() => setActiveTab('hotel')}>
          <FaHotel /> Hotels
        </div>
      </div>
      )}

      {activeTab !== 'hotel' && (
        <div className="trip-type">
          <label>
            <input type="radio" name="trip" checked={tripType === "oneWay"} onChange={() => setTripType("oneWay")} /> One Way
          </label>
          <label>
            <input type="radio" name="trip" checked={tripType === "roundTrip"} onChange={() => setTripType("roundTrip")} /> Round Trip
          </label>
        </div>
      )}

      <div className={`main-search-box ${isRoundTripEnabled ? "round-trip-layout" : ""}`}>
        {/* FROM SECTION */}
        <div className="box-section">
          <div className="label-row">
            <span className="label">{activeTab === 'hotel' ? 'Place' : 'From'}</span>
          </div>
          <strong className="display-date">{activeTab === 'hotel' ? 'Mumbai' : fromCity}</strong>
        </div>

        <div className="swapdiv" onClick={activeTab !== 'hotel' ? handleSwap : undefined} style={{ cursor: activeTab !== 'hotel' ? 'pointer' : 'default' }}>
          <div className="divider" />
          {activeTab !== 'hotel' && (
            <div className="swap-icon-wrapper">
              <span className="swap-icon">⇄</span>
            </div>
          )}
        </div>

        {/* TO SECTION */}
        <div className="box-section">
          <div className="label-row">
            <span className="label">{activeTab === 'hotel' ? 'Check-in Date' : 'To'}</span>
            {activeTab === 'hotel' && (
              <FaCalendarAlt className="calendar-trigger-icon" onClick={() => checkInRef.current.setOpen(true)} />
            )}
          </div>
          {activeTab === 'hotel' ? (
            <div className="datepicker-container">
              <DatePicker selected={checkIn} onChange={(date) => setCheckIn(date)} minDate={new Date()} ref={checkInRef} className="hidden-datepicker-input" />
              <strong className="display-date">{checkIn.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</strong>
            </div>
          ) : (
            <strong className="display-date">{toCity}</strong>
          )}
        </div>

        {/* DEPARTURE SECTION */}
        <div className="box-section">
          <div className="label-row">
            <span className="label">
              {activeTab === 'hotel' ? 'Check-out Date' : activeTab === 'bus' ? 'Travel Date' : 'Departure'}
            </span>
            <FaCalendarAlt className="calendar-trigger-icon" onClick={() => datePickerRef.current.setOpen(true)} />
          </div>
          <div className="datepicker-container">
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} ref={datePickerRef} className="hidden-datepicker-input" />
            <strong className="display-date">{startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</strong>
          </div>
        </div>

        {/* RETURN SECTION */}
        {isRoundTripEnabled && (
          <div className="box-section return-section">
            <div className="label-row">
              <span className="label">Return</span>
              <FaCalendarAlt className="calendar-trigger-icon" onClick={() => returnDatePickerRef.current.setOpen(true)} />
            </div>
            <div className="datepicker-container">
              <DatePicker selected={returnDate} onChange={(date) => setReturnDate(date)} minDate={startDate} ref={returnDatePickerRef} className="hidden-datepicker-input" placeholderText="Select Date" />
              <strong className="display-date">{returnDate ? returnDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : "Select Date"}</strong>
            </div>
          </div>
        )}

        {/* TRAVELLERS SECTION */}
        {activeTab !== 'bus' && (
          <div className="box-section travellers-trigger" ref={dropdownRef} onClick={() => setOpenTravellers(!openTravellers)}>
            <div className="label-row">
              <span className="label">{activeTab === 'hotel' ? 'Rooms / Guests' : 'Travellers & Class'}</span>
            </div>
            <div className="display-area">
              <strong>
                {activeTab === 'hotel' 
                  ? `${hotelData.rooms} Room, ${hotelData.adults + hotelData.children} Guest`
                  : `${displayValue.total} Traveller · ${displayValue.cabinClass}`}
                <FaChevronDown className="chevron-icon" />
              </strong>
            </div>
            {openTravellers && (
              <div onClick={(e) => e.stopPropagation()}>
                {activeTab === 'hotel' ? (
                  <HotelGuestsDropdown data={hotelData} onApply={(newData) => { setHotelData(newData); setOpenTravellers(false); }} />
                ) : (
                  <TravellersDropdown tempSelection={tempSelection} setTempSelection={setTempSelection} onApply={handleApply} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="search-btn-wrapper">
        <button className="search-btn" onClick={handleSearch}>SEARCH</button>
      </div>
    </section>
  );
}

export default SearchBox;