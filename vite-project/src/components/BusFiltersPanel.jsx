import React, { useState } from "react";
import "../styles/BusFiltersPanel.css";
import { FaSearch } from "react-icons/fa";
import { TbSnowflake } from "react-icons/tb";
import { TbSnowflakeOff } from "react-icons/tb";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { MdAirlineSeatIndividualSuite } from "react-icons/md";
import { PiSunHorizon } from "react-icons/pi";
import { PiSunLight } from "react-icons/pi";
import { IoPartlySunnyOutline } from "react-icons/io5";

const BusFiltersPanel = () => {
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [selectedAC, setSelectedAC] = useState(null);
  const [selectedSeatType, setSelectedSeatType] = useState(null);
  const [singleSeats, setSingleSeats] = useState(false);
  const [selectedPickupTimes, setSelectedPickupTimes] = useState([]);
  const [selectedDropTimes, setSelectedDropTimes] = useState([]);
  const [selectedPickupPoints, setSelectedPickupPoints] = useState([]);
  const [selectedDropPoints, setSelectedDropPoints] = useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);

  const timeSlots = [
    { id: 'pickup-12am-6am', label: '12 AM - 6 AM', type: 'pickup' },
    { id: 'pickup-6am-12pm', label: '6 AM - 12 PM', type: 'pickup' },
    { id: 'pickup-12pm-6pm', label: '12 PM - 6 PM', type: 'pickup' },
    { id: 'pickup-6pm-12am', label: '6 PM - 12 AM', type: 'pickup' },
    { id: 'drop-12am-6am', label: '12 AM - 6 AM', type: 'drop' },
    { id: 'drop-6am-12pm', label: '6 AM - 12 PM', type: 'drop' },
    { id: 'drop-12pm-6pm', label: '12 PM - 6 PM', type: 'drop' },
    { id: 'drop-6pm-12am', label: '6 PM - 12 AM', type: 'drop' }
  ];
  
  const [pickupSearch, setPickupSearch] = useState("");
  const [dropSearch, setDropSearch] = useState("");
  const [operatorSearch, setOperatorSearch] = useState("");

  const pickupPoints = [
    "ISBT Kashmiri Gate",
    "Akshardham Metro Station",
    "Chilla Border",
    "Advent Navis Business Park"
  ];

  const dropPoints = [
    "Bhatia Hotel",
    "Faizalganj",
    "FAZALGANJ CHURAHA",
    "Rama Devi Chowraha"
  ];

  const operators = [
    "IntrCity SmartBus",
    "Laxmi holidays",
    "zingbus plus",
    "Safar Express"
  ];

  const removeFilter = (filter) => {
    setAppliedFilters(appliedFilters.filter(item => item !== filter));
    
    // Remove corresponding selections
    if (filter === "AC" || filter === "Non-AC") setSelectedAC(null);
    if (filter === "Seater" || filter === "Sleeper") setSelectedSeatType(null);
    if (filter === "Single Seats") setSingleSeats(false);
  };

  const clearAll = () => {
    setAppliedFilters([]);
    setSelectedAC(null);
    setSelectedSeatType(null);
    setSingleSeats(false);
    setSelectedPickupTimes([]);
    setSelectedDropTimes([]);
    setSelectedPickupPoints([]);
    setSelectedDropPoints([]);
    setSelectedOperators([]);
  };

  const handleACSelect = (type) => {
    if (selectedAC === type) {
      setSelectedAC(null);
      setAppliedFilters(appliedFilters.filter(f => f !== type));
    } else {
      if (selectedAC) {
        setAppliedFilters(appliedFilters.filter(f => f !== selectedAC).concat(type));
      } else {
        setAppliedFilters([...appliedFilters, type]);
      }
      setSelectedAC(type);
    }
  };

  const handleSeatTypeSelect = (type) => {
    if (selectedSeatType === type) {
      setSelectedSeatType(null);
      setAppliedFilters(appliedFilters.filter(f => f !== type));
    } else {
      if (selectedSeatType) {
        setAppliedFilters(appliedFilters.filter(f => f !== selectedSeatType).concat(type));
      } else {
        setAppliedFilters([...appliedFilters, type]);
      }
      setSelectedSeatType(type);
    }
  };

  const handleSingleSeatsToggle = () => {
    if (singleSeats) {
      setSingleSeats(false);
      setAppliedFilters(appliedFilters.filter(f => f !== "Single Seats"));
    } else {
      setSingleSeats(true);
      setAppliedFilters([...appliedFilters, "Single Seats"]);
    }
  };

  const handleTimeSlotToggle = (slotId, slotLabel, type) => {
    if (type === 'pickup') {
      if (selectedPickupTimes.includes(slotId)) {
        setSelectedPickupTimes(selectedPickupTimes.filter(id => id !== slotId));
        setAppliedFilters(appliedFilters.filter(f => f !== `Pickup: ${slotLabel}`));
      } else {
        setSelectedPickupTimes([...selectedPickupTimes, slotId]);
        setAppliedFilters([...appliedFilters, `Pickup: ${slotLabel}`]);
      }
    } else {
      if (selectedDropTimes.includes(slotId)) {
        setSelectedDropTimes(selectedDropTimes.filter(id => id !== slotId));
        setAppliedFilters(appliedFilters.filter(f => f !== `Drop: ${slotLabel}`));
      } else {
        setSelectedDropTimes([...selectedDropTimes, slotId]);
        setAppliedFilters([...appliedFilters, `Drop: ${slotLabel}`]);
      }
    }
  };

  return (
    <div className="filters-container">
      {/* Applied Filters */}
      <div className="filter-card">
        <div className="card-header">
          <h3 className="section-title-with-bar">Applied Filters</h3>
          <button className="bus-clear-all" onClick={clearAll}>CLEAR ALL</button>
        </div>
        {appliedFilters.length > 0 && (
          <div className="applied-pills">
            {appliedFilters.map(filter => (
              <div key={filter} className="applied-pill">
                {filter}
                <span className="close-x" onClick={() => removeFilter(filter)}>×</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AC Filter */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">AC</h3>
        <div className="bus-type-buttons">
       <button 
  className={`bus-type-btn ${selectedAC === 'AC' ? 'active' : ''}`}
  onClick={() => handleACSelect('AC')}
>
  <TbSnowflake className="bus-type-icon" />
  AC
</button>

          <button 
            className={`bus-type-btn ${selectedAC === 'Non-AC' ? 'active' : ''}`}
            onClick={() => handleACSelect('Non-AC')}
          >
            <TbSnowflakeOff className="bus-type-icon" />
            Non-AC
          </button>
        </div>
      </div>

      {/* Seat Type */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Seat type</h3>
        <div className="bus-type-buttons">
          <button 
            className={`bus-type-btn ${selectedSeatType === 'Seater' ? 'active' : ''}`}
            onClick={() => handleSeatTypeSelect('Seater')}
          >
            <MdAirlineSeatReclineNormal className="bus-type-icon" />
            
            Seater
          </button>
          <button 
            className={`bus-type-btn ${selectedSeatType === 'Sleeper' ? 'active' : ''}`}
            onClick={() => handleSeatTypeSelect('Sleeper')}
          >
            <MdAirlineSeatIndividualSuite className="bus-type-icon" />
            Sleeper
          </button>
        </div>
      </div>

      {/* Single Seater/Sleeper */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Single Seater/Sleeper</h3>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={singleSeats}
              onChange={handleSingleSeatsToggle}
            />
            <div>
              <span style={{ display: 'block', marginBottom: '2px' }}>Single Seats</span>
              <span style={{ fontSize: '12px', color: '#666' }}>Separate single window seats</span>
            </div>
          </div>
        </label>
      </div>

      {/* Pick up point */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Pick up point - Delhi, Delhi</h3>
        
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search"
            className="filter-search-input"
            value={pickupSearch}
            onChange={(e) => setPickupSearch(e.target.value)}
          />
        </div>

        <div className="location-list">
          {pickupPoints.map((point, idx) => (
            <label key={idx} className="checkbox-row">
              <div className="checkbox-label">
                <input type="checkbox" />
                <span>{point}</span>
              </div>
            </label>
          ))}
        </div>

        <h4 className="subsection-title">Pick up time</h4>
        <div className="bus-time-slots-grid">
          <div 
            className={`bus-time-slot-box ${selectedPickupTimes.includes('pickup-12am-6am') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('pickup-12am-6am', '12 AM - 6 AM', 'pickup')}
          >
            <PiSunHorizon className="bus-time-icon" />
            
            <span className="bus-time-label">12 AM -<br/>6 AM</span>
          </div>
          <div 
            className={`bus-time-slot-box ${selectedPickupTimes.includes('pickup-6am-12pm') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('pickup-6am-12pm', '6 AM - 12 PM', 'pickup')}
          >
            <PiSunLight className="bus-time-icon" />
            
            <span className="bus-time-label">6 AM -<br/>12 PM</span>
          </div>
          <div 
            className={`bus-time-slot-box ${selectedPickupTimes.includes('pickup-12pm-6pm') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('pickup-12pm-6pm', '12 PM - 6 PM', 'pickup')}
          >
            <IoPartlySunnyOutline className="bus-time-icon" />
       
            <span className="bus-time-label">12 PM -<br/>6 PM</span>
          </div>
          <div 
            className={`bus-time-slot-box ${selectedPickupTimes.includes('pickup-6pm-12am') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('pickup-6pm-12am', '6 PM - 12 AM', 'pickup')}
          >
            <svg className="bus-time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="bus-time-label">6 PM -<br/>12 AM</span>
          </div>
        </div>
      </div>

      {/* Operators */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Operators</h3>
        
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search"
            className="filter-search-input"
            value={operatorSearch}
            onChange={(e) => setOperatorSearch(e.target.value)}
          />
        </div>

        <div className="location-list">
          {operators.map((operator, idx) => (
            <label key={idx} className="checkbox-row">
              <div className="checkbox-label">
                <input type="checkbox" />
                <span>{operator}</span>
              </div>
            </label>
          ))}
        </div>

        <span className="plus-more">Show all (47) ↓</span>
      </div>

      {/* Drop point */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Drop point - Kanpur, Uttar Pradesh</h3>
        
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search"
            className="filter-search-input"
            value={dropSearch}
            onChange={(e) => setDropSearch(e.target.value)}
          />
        </div>

        <div className="location-list">
          {dropPoints.map((point, idx) => (
            <label key={idx} className="checkbox-row">
              <div className="checkbox-label">
                <input type="checkbox" />
                <span>{point}</span>
              </div>
            </label>
          ))}
        </div>

        <span className="plus-more">Show all (14) ↓</span>

        <h4 className="subsection-title">Drop time</h4>
        <div className="bus-time-slots-grid">
          <div 
            className={`bus-time-slot-box ${selectedDropTimes.includes('drop-12am-6am') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('drop-12am-6am', '12 AM - 6 AM', 'drop')}
          >
            <PiSunHorizon className="bus-time-icon" />
            
            <span className="bus-time-label">12 AM -<br/>6 AM</span>
          </div>
          <div 
            className={`bus-time-slot-box ${selectedDropTimes.includes('drop-6am-12pm') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('drop-6am-12pm', '6 AM - 12 PM', 'drop')}
          >
            <PiSunLight className="bus-time-icon"/>
           
            <span className="bus-time-label">6 AM -<br/>12 PM</span>
          </div>
          <div 
            className={`bus-time-slot-box ${selectedDropTimes.includes('drop-12pm-6pm') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('drop-12pm-6pm', '12 PM - 6 PM', 'drop')}
          >
            <IoPartlySunnyOutline className="bus-time-icon" />
            <span className="bus-time-label">12 PM -<br/>6 PM</span>
          </div>
          <div 
            className={`bus-time-slot-box ${selectedDropTimes.includes('drop-6pm-12am') ? 'active' : ''}`}
            onClick={() => handleTimeSlotToggle('drop-6pm-12am', '6 PM - 12 AM', 'drop')}
          >
            <svg className="bus-time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="bus-time-label">6 PM -<br/>12 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusFiltersPanel;
