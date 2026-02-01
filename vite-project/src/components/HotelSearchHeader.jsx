import React, { useState, useRef, useEffect } from "react";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HotelGuestsDropdown from "./HotelGuestsDropdown";
import "../styles/HotelSearchHeader.css";

function HotelSearchHeader({ initialData, onSearch }) {
  const [city, setCity] = useState(initialData?.city || "Casa Joi, Goa");
  const [checkIn, setCheckIn] = useState(initialData?.checkInDate ? new Date(initialData.checkInDate) : new Date());
  const [checkOut, setCheckOut] = useState(initialData?.checkOutDate ? new Date(initialData.checkOutDate) : new Date(new Date().setDate(new Date().getDate() + 1)));
  const [rooms, setRooms] = useState(initialData?.rooms || 1);
  const [adults, setAdults] = useState(initialData?.adults || 2);
  const [children, setChildren] = useState(initialData?.children || 0);
  const [openGuestsDropdown, setOpenGuestsDropdown] = useState(false);
  
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const guestsDropdownRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return "";
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        city,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        rooms,
        adults,
        children
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(e.target)) {
        setOpenGuestsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hotel-search-header">
      <div className="hotel-search-header-container">
        {/* City/Property Input */}
        <div className="search-header-field city-field">
          <label className="search-header-label">CITY, AREA OR PROPERTY</label>
          <input
            type="text"
            className="search-header-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city or property"
          />
        </div>

        {/* Check-in Date */}
        <div className="search-header-field date-field" ref={checkInRef}>
          <label className="search-header-label">CHECK-IN</label>
          <div className="search-header-input" onClick={() => checkInRef.current?.querySelector('input')?.click()}>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              minDate={new Date()}
              dateFormat="EEE, d MMM yyyy"
              customInput={
                <div className="date-display">
                  {formatDate(checkIn)}
                  <FaCalendarAlt className="calendar-icon" />
                </div>
              }
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="search-header-field date-field" ref={checkOutRef}>
          <label className="search-header-label">CHECK-OUT</label>
          <div className="search-header-input" onClick={() => checkOutRef.current?.querySelector('input')?.click()}>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn || new Date()}
              dateFormat="EEE, d MMM yyyy"
              customInput={
                <div className="date-display">
                  {formatDate(checkOut)}
                  <FaCalendarAlt className="calendar-icon" />
                </div>
              }
            />
          </div>
        </div>

        {/* Rooms & Guests */}
        <div className="search-header-field guests-field" ref={guestsDropdownRef}>
          <label className="search-header-label">ROOMS & GUESTS</label>
          <div 
            className="search-header-input guests-input" 
            onClick={() => setOpenGuestsDropdown(!openGuestsDropdown)}
          >
            <div className="guests-display">
              {rooms} Room{rooms > 1 ? 's' : ''}, {adults + children} Adult{adults + children > 1 ? 's' : ''}
              <FaChevronDown className="dropdown-icon" />
            </div>
          </div>

          {openGuestsDropdown && (
            <div className="guests-dropdown-wrapper">
              <HotelGuestsDropdown
                rooms={rooms}
                adults={adults}
                children={children}
                onUpdate={(data) => {
                  setRooms(data.rooms);
                  setAdults(data.adults);
                  setChildren(data.children);
                }}
                onClose={() => setOpenGuestsDropdown(false)}
              />
            </div>
          )}
        </div>

        {/* Search Button */}
        <button className="search-header-btn" onClick={handleSearch}>
          SEARCH
        </button>
      </div>
    </div>
  );
}

export default HotelSearchHeader;
