import React, { useState } from "react";
import "../styles/FiltersPanel.css";

const FiltersPanel = () => {
  const [appliedFilters, setAppliedFilters] = useState(["DEL : NON STOP", "BLR : NON STOP"]);
  const [price, setPrice] = useState(18800);

  const removeFilter = (filter) => {
    setAppliedFilters(appliedFilters.filter(item => item !== filter));
  };

  const clearAll = () => setAppliedFilters([]);
  
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const calculateSliderPosition = () => {
    const percentage = ((price - 6478) / (29600 - 6478)) * 100;
    return percentage;
  };

  const getSliderBackground = () => {
    const percentage = calculateSliderPosition();
    return `linear-gradient(to right, #008cff 0%, #008cff ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
  };

  return (
    <div className="filters-container">
      {/* Applied Filters */}
      <div className="filter-card">
        <div className="card-header">
          <h3>Applied Filters</h3>
          <button className="clear-all" onClick={clearAll}>CLEAR ALL</button>
        </div>
        <div className="applied-pills">
          {appliedFilters.map(filter => (
            <div key={filter} className="applied-pill">
              {filter} 
              <span className="close-x" onClick={() => removeFilter(filter)}>×</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Filters */}
      <div className="filter-card">
        <h3>Popular Filters</h3>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" defaultChecked /> 
            <span>Non Stop</span>
          </div>
          <span className="price">₹ 13,976</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>Hide Nearby Airports</span>
          </div>
          <span className="price">₹ 6,478</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>Refundable Fares</span>
          </div>
          <span className="price">₹ 13,573</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>1 Stop</span>
          </div>
          <span className="price">₹ 13,576</span>
        </label>
        <span className="plus-more">+ 4 more</span>
        
        <div className="divider"></div>
        
        <h3>Price Range</h3>
        <div className="slider-container">
          <div 
            className="price-tooltip" 
            style={{ left: `${calculateSliderPosition()}%` }}
          >
            ₹ {Number(price).toLocaleString()}
          </div>
          <input 
            type="range" 
            className="price-slider"
            min="6478" 
            max="29600" 
            value={price} 
            onChange={handlePriceChange}
            style={{ background: getSliderBackground() }}
          />
        </div>
        <div className="price-labels">
          <span>₹ 6,478</span>
          <span>₹ 29,600</span>
        </div>
      </div>

      {/* Onward Journey */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Onward Journey</h3>
        
        <h4 className="subsection-title">Stops From New Delhi</h4>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" defaultChecked /> 
            <span>Non Stop</span>
          </div>
          <span className="price">₹ 6,989</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>1 Stop</span>
          </div>
          <span className="price">₹ 6,694</span>
        </label>

        <h4 className="subsection-title">Departure From New Delhi</h4>
        <div className="time-slots-grid">
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
            </svg>
            <span className="time-label">Before<br/>6 AM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            </svg>
            <span className="time-label">6 AM to<br/>12 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
            </svg>
            <span className="time-label">12 PM to<br/>6 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="time-label">After<br/>6 PM</span>
          </div>
        </div>

        <h4 className="subsection-title">Arrival at Bengaluru</h4>
        <div className="time-slots-grid">
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
            </svg>
            <span className="time-label">Before<br/>6 AM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            </svg>
            <span className="time-label">6 AM to<br/>12 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
            </svg>
            <span className="time-label">12 PM to<br/>6 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="time-label">After<br/>6 PM</span>
          </div>
        </div>

        <h4 className="subsection-title">Departure Airports</h4>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>Hindon Airport (32Km)</span>
          </div>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>Indira Gandhi International Airport</span>
          </div>
        </label>
      </div>

      {/* Return Journey */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Return Journey</h3>
        
        <h4 className="subsection-title">Stops From Bengaluru</h4>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" defaultChecked /> 
            <span>Non Stop</span>
          </div>
          <span className="price">₹ 7,095</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>1 Stop</span>
          </div>
          <span className="price">₹ 7,098</span>
        </label>

        <h4 className="subsection-title">Departure From Bengaluru</h4>
        <div className="time-slots-grid">
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
            </svg>
            <span className="time-label">Before<br/>6 AM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            </svg>
            <span className="time-label">6 AM to<br/>12 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
            </svg>
            <span className="time-label">12 PM to<br/>6 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="time-label">After<br/>6 PM</span>
          </div>
        </div>

        <h4 className="subsection-title">Arrival at New Delhi</h4>
        <div className="time-slots-grid">
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
            </svg>
            <span className="time-label">Before<br/>6 AM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            </svg>
            <span className="time-label">6 AM to<br/>12 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
            </svg>
            <span className="time-label">12 PM to<br/>6 PM</span>
          </div>
          <div className="time-slot-box">
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="time-label">After<br/>6 PM</span>
          </div>
        </div>

        <h4 className="subsection-title">Arrival Airports</h4>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>Hindon Airport (32Km)</span>
          </div>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" /> 
            <span>Indira Gandhi International Airport</span>
          </div>
        </label>
      </div>

      {/* Airlines and Aircraft Size */}
      <div className="filter-card">
        <h3>Airlines</h3>
        
        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input type="checkbox" />
            <div className="airline-logo-container">
              <img src="/public/airlines/a1.png" alt="Air India" className="airline-logo" />
            </div>
            <span>Air India</span>
          </div>
          <span className="price">₹ 14,705</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input type="checkbox" />
            <div className="airline-logo-container">
              <img src="/public/airlines/a2.png" alt="Air India Express" className="airline-logo" />
            </div>
            <span>Air India Express</span>
          </div>
          <span className="price">₹ 14,720</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input type="checkbox" />
            <div className="airline-logo-container">
              <img src="/public/airlines/a3.png" alt="Akasa Air" className="airline-logo" />
            </div>
            <span>Akasa Air</span>
          </div>
          <span className="price">₹ 14,570</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input type="checkbox" />
            <div className="airline-logo-container">
              <img src="/public/airlines/a4.png " alt="IndiGo" className="airline-logo" />
            </div>
            <span>IndiGo</span>
          </div>
          <span className="price">₹ 13,792</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input type="checkbox" />
            <div className="airline-logo-container">
              <img src="/public/airlines/a5.png" alt="SpiceJet" className="airline-logo" />
            </div>
            <span>SpiceJet</span>
          </div>
          <span className="price">₹ 14,605</span>
        </label>

        <h3 className="aircraft-size-title">Aircraft Size</h3>
        
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" />
            <span>Small / Mid-size aircraft</span>
          </div>
          <span className="price">₹ 13,792</span>
        </label>

        <label className="checkbox-row">
          <div className="checkbox-label">
            <input type="checkbox" />
            <span>Large Aircraft</span>
          </div>
          <span className="price">₹ 14,705</span>
        </label>
      </div>
    </div>
  );
};

export default FiltersPanel;