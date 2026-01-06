import { useState, useRef, useEffect } from "react";
import { FaPlane, FaHotel, FaBus, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
// Import your separate component
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Basic styles
import TravellersDropdown from "./TravellersClassDropdown";
import HotelGuestsDropdown from "./HotelGuestsDropdown";

function SearchBox() {
  const [openTravellers, setOpenTravellers] = useState(false);
  const dropdownRef = useRef(null);
  const [activeTab, setActiveTab] = useState("flights");
  const [startDate, setStartDate] = useState(new Date());
  const datePickerRef = useRef(null);
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());

  // Function to open calendar when icon is clicked
  const openCalendar = () => {
    datePickerRef.current.setOpen(true);
  };

    // 1. Permanent State (Shown in the main grid)
  const [displayValue, setDisplayValue] = useState({
    total: 1,
    cabinClass: "Economy"
  });

  // 2. Temporary State (Updates while user clicks +/- inside dropdown)
  const [tempSelection, setTempSelection] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "Economy"
  });

  // 3. Apply Function: Transfers temp values to display values
  const handleApply = () => {
    const totalTravellers = tempSelection.adults + tempSelection.children + tempSelection.infants;
    
    setDisplayValue({
      total: totalTravellers,
      cabinClass: tempSelection.cabinClass
    });

   setOpenTravellers(false); // Close your dropdown here (e.g., setDropdownOpen(false))
  };

  // 1. Initialize state for From and To
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Bengaluru");

  // 2. Swap Function
  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  // Hotel Guest State
  const [hotelData, setHotelData] = useState({ rooms: 1, adults: 2, children: 0 });
  const [openGuests, setOpenGuests] = useState(false);

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      // If the click is NOT inside the dropdown container, close it
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenTravellers(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="search-wrapper">
      {/* TOP TABS & TRIP TYPE (Keeping your existing UI) */}
      <div className="service-tabs">
        <div
          className={`service-tab-item ${activeTab === 'flights' ? 'active' : ''}`}
          onClick={() => setActiveTab('flights')}
        >
          <FaPlane /> Flights
        </div>

        <div
          className={`service-tab-item ${activeTab === 'bus' ? 'active' : ''}`}
          onClick={() => setActiveTab('bus')}
        >
          <FaBus /> Buses
        </div>

        <div
          className={`service-tab-item ${activeTab === 'hotel' ? 'active' : ''}`}
          onClick={() => setActiveTab('hotel')}
        >
          <FaHotel /> Hotels
        </div>
      </div>

      

      <div className="trip-type">
        <label><input type="radio" name="trip" defaultChecked /> One Way</label>
        <label><input type="radio" name="trip" /> Round Trip</label>
       
      </div>

     <div className="main-search-box">
  {/* 1. PLACE / FROM SECTION */}
  <div className="box-section">
    <div className="label-row">
      <span className="label">{activeTab === 'hotel' ? 'Place' : 'From'}</span>
    </div>
    <strong className="display-date">{activeTab === 'hotel' ? 'Mumbai' : fromCity}</strong>
  </div>

  {/* SWAP ICON - Perfectly centered on the border */}
  <div 
    className="swapdiv" 
    onClick={activeTab !== 'hotel' ? handleSwap : undefined} 
    style={{ cursor: activeTab !== 'hotel' ? 'pointer' : 'default' }}
  >
    <div className="divider" />
    {activeTab !== 'hotel' && (
      <div className="swap-icon-wrapper">
        <span className="swap-icon">⇄</span>
      </div>
    )}
  </div>

  {/* 2. CHECK-IN / TO SECTION */}
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

  {/* REMOVED: <div className="divider" /> was causing the double line here */}

  {/* 3. CHECK-OUT / DEPARTURE SECTION */}
  <div className="box-section">
    <div className="label-row">
      <span className="label">
        {activeTab === 'hotel' ? 'Check-out Date' : activeTab === 'bus' ? 'Travel Date' : 'Departure'}
      </span>
      <FaCalendarAlt className="calendar-trigger-icon" onClick={openCalendar} />
    </div>
    <div className="datepicker-container">
      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()} ref={datePickerRef} className="hidden-datepicker-input" />
      <strong className="display-date">{startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</strong>
    </div>
  </div>

  {/* REMOVED: <div className="divider" /> was causing the double line here */}

  {/* 4. ROOMS/GUESTS / TRAVELLERS SECTION */}
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
            <HotelGuestsDropdown 
              data={hotelData} 
              onApply={(newData) => { setHotelData(newData); setOpenTravellers(false); }} 
            />
          ) : (
            <TravellersDropdown 
              tempSelection={tempSelection}
              setTempSelection={setTempSelection}
              onApply={handleApply} 
            />
          )}
        </div>
      )}
    </div>
  )}
</div>
      <div className="search-btn-wrapper">
        <button className="search-btn">SEARCH</button>
      </div>
  
      
    </section>
  );
}

export default SearchBox;