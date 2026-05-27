import React, { useState, useEffect } from "react";
import "../styles/FiltersPanel.css";
import { PiSunHorizon } from "react-icons/pi";
import { PiSunLight } from "react-icons/pi";
import { IoPartlySunnyOutline } from "react-icons/io5";

const FiltersPanel = ({ onFiltersChange, fromLabel = "New Delhi", toLabel = "Bengaluru", isRoundTrip = false }) => {
  const safeFromLabel = fromLabel && String(fromLabel).trim() ? String(fromLabel).trim() : "New Delhi";
  const safeToLabel = toLabel && String(toLabel).trim() ? String(toLabel).trim() : "Bengaluru";
  const MIN_PRICE = 2000;
  const MAX_PRICE = 70000;
  // State for all filters
  const [filters, setFilters] = useState({
    popularFilters: {
      nonStop: false,
      hideNearbyAirports: false,
      refundableFares: false,
      oneStop: false,
    },
    priceRange: MAX_PRICE,
    priceTouched: false,
    onwardJourney: {
      stops: {
        nonStop: false,
        oneStop: false,
      },
      departureTime: [],
      arrivalTime: [],
      airports: {
        hindon: false,
        igi: false,
      },
    },
    returnJourney: {
      stops: {
        nonStop: false,
        oneStop: false,
      },
      departureTime: [],
      arrivalTime: [],
    },
    airlines: {
      airIndia: false,
      airIndiaExpress: false,
      akasaAir: false,
      indigo: false,
      spicejet: false,
    },
  });

  const [appliedFilters, setAppliedFilters] = useState([]);

  // Generate applied filters from state
  useEffect(() => {
    const filters_list = [];

    // Popular Filters
    if (filters.popularFilters.nonStop) filters_list.push({ id: 'popular-nonStop', label: 'Non Stop' });
    if (filters.popularFilters.hideNearbyAirports) filters_list.push({ id: 'popular-hideNearbyAirports', label: 'Hide Nearby Airports' });
    if (filters.popularFilters.refundableFares) filters_list.push({ id: 'popular-refundableFares', label: 'Refundable Fares' });
    if (filters.popularFilters.oneStop) filters_list.push({ id: 'popular-oneStop', label: '1 Stop' });

    // Onward Journey - Stops
    if (filters.onwardJourney.stops.nonStop) filters_list.push({ id: 'onward-stops-nonStop', label: 'DEL: Non Stop' });
    if (filters.onwardJourney.stops.oneStop) filters_list.push({ id: 'onward-stops-oneStop', label: 'DEL: 1 Stop' });

    // Onward Journey - Departure Time
    filters.onwardJourney.departureTime.forEach(time => {
      filters_list.push({ id: `onward-departure-${time}`, label: `DEL Departure: ${time}` });
    });

    // Onward Journey - Arrival Time
    filters.onwardJourney.arrivalTime.forEach(time => {
      filters_list.push({ id: `onward-arrival-${time}`, label: `BLR Arrival: ${time}` });
    });

    // Onward Journey - Airports
    if (filters.onwardJourney.airports.hindon) filters_list.push({ id: 'onward-airport-hindon', label: 'Hindon Airport' });
    if (filters.onwardJourney.airports.igi) filters_list.push({ id: 'onward-airport-igi', label: 'IGI Airport' });

    if (isRoundTrip) {
      // Return Journey - Stops
      if (filters.returnJourney.stops.nonStop) filters_list.push({ id: 'return-stops-nonStop', label: 'BLR: Non Stop' });
      if (filters.returnJourney.stops.oneStop) filters_list.push({ id: 'return-stops-oneStop', label: 'BLR: 1 Stop' });

      // Return Journey - Departure Time
      filters.returnJourney.departureTime.forEach(time => {
        filters_list.push({ id: `return-departure-${time}`, label: `BLR Departure: ${time}` });
      });

      // Return Journey - Arrival Time
      filters.returnJourney.arrivalTime.forEach(time => {
        filters_list.push({ id: `return-arrival-${time}`, label: `DEL Arrival: ${time}` });
      });
    }


    // Airlines
    if (filters.airlines.airIndia) filters_list.push({ id: 'airline-airIndia', label: 'Air India' });
    if (filters.airlines.airIndiaExpress) filters_list.push({ id: 'airline-airIndiaExpress', label: 'Air India Express' });
    if (filters.airlines.akasaAir) filters_list.push({ id: 'airline-akasaAir', label: 'Akasa Air' });
    if (filters.airlines.indigo) filters_list.push({ id: 'airline-indigo', label: 'IndiGo' });
    if (filters.airlines.spicejet) filters_list.push({ id: 'airline-spicejet', label: 'SpiceJet' });

    setAppliedFilters(filters_list);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, isRoundTrip]);

  // Remove individual filter
  const removeFilter = (filterId) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      // Popular Filters
      if (filterId === 'popular-nonStop') newFilters.popularFilters.nonStop = false;
      if (filterId === 'popular-hideNearbyAirports') newFilters.popularFilters.hideNearbyAirports = false;
      if (filterId === 'popular-refundableFares') newFilters.popularFilters.refundableFares = false;
      if (filterId === 'popular-oneStop') newFilters.popularFilters.oneStop = false;

      // Onward Journey - Stops
      if (filterId === 'onward-stops-nonStop') newFilters.onwardJourney.stops.nonStop = false;
      if (filterId === 'onward-stops-oneStop') newFilters.onwardJourney.stops.oneStop = false;

      // Onward Journey - Departure Time
      if (filterId.startsWith('onward-departure-')) {
        const time = filterId.replace('onward-departure-', '');
        newFilters.onwardJourney.departureTime = newFilters.onwardJourney.departureTime.filter(t => t !== time);
      }

      // Onward Journey - Arrival Time
      if (filterId.startsWith('onward-arrival-')) {
        const time = filterId.replace('onward-arrival-', '');
        newFilters.onwardJourney.arrivalTime = newFilters.onwardJourney.arrivalTime.filter(t => t !== time);
      }

      // Onward Journey - Airports
      if (filterId === 'onward-airport-hindon') newFilters.onwardJourney.airports.hindon = false;
      if (filterId === 'onward-airport-igi') newFilters.onwardJourney.airports.igi = false;

      // Return Journey - Stops
      if (filterId === 'return-stops-nonStop') newFilters.returnJourney.stops.nonStop = false;
      if (filterId === 'return-stops-oneStop') newFilters.returnJourney.stops.oneStop = false;

      // Return Journey - Departure Time
      if (filterId.startsWith('return-departure-')) {
        const time = filterId.replace('return-departure-', '');
        newFilters.returnJourney.departureTime = newFilters.returnJourney.departureTime.filter(t => t !== time);
      }

      // Return Journey - Arrival Time
      if (filterId.startsWith('return-arrival-')) {
        const time = filterId.replace('return-arrival-', '');
        newFilters.returnJourney.arrivalTime = newFilters.returnJourney.arrivalTime.filter(t => t !== time);
      }

      // Airlines
      if (filterId === 'airline-airIndia') newFilters.airlines.airIndia = false;
      if (filterId === 'airline-airIndiaExpress') newFilters.airlines.airIndiaExpress = false;
      if (filterId === 'airline-akasaAir') newFilters.airlines.akasaAir = false;
      if (filterId === 'airline-indigo') newFilters.airlines.indigo = false;
      if (filterId === 'airline-spicejet') newFilters.airlines.spicejet = false;

      return newFilters;
    });
  };

  // Clear all filters
  const clearAll = () => {
    setFilters({
      popularFilters: {
        nonStop: false,
        hideNearbyAirports: false,
        refundableFares: false,
        oneStop: false,
      },
      priceRange: MAX_PRICE,
      priceTouched: false,
      onwardJourney: {
        stops: {
          nonStop: false,
          oneStop: false,
        },
        departureTime: [],
        arrivalTime: [],
        airports: {
          hindon: false,
          igi: false,
        },
      },
      returnJourney: {
        stops: {
          nonStop: false,
          oneStop: false,
        },
        departureTime: [],
        arrivalTime: [],
      },
      airlines: {
        airIndia: false,
        airIndiaExpress: false,
        akasaAir: false,
        indigo: false,
        spicejet: false,
      },
    });
  };

  // Handle time slot toggle
  const toggleTimeSlot = (journey, type, time) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      const timeArray = newFilters[journey][type];
      if (timeArray.includes(time)) {
        newFilters[journey][type] = timeArray.filter(t => t !== time);
      } else {
        newFilters[journey][type] = [...timeArray, time];
      }
      return newFilters;
    });
  };

  const handlePriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      priceRange: Number(e.target.value),
      priceTouched: true
    }));
  };

  const calculateSliderPosition = () => {
    const range = MAX_PRICE - MIN_PRICE;
    const percentage = range > 0 ? ((filters.priceRange - MIN_PRICE) / range) * 100 : 0;
    return percentage;
  };

  const getSliderBackground = () => {
    const percentage = calculateSliderPosition();
    return `linear-gradient(to right, #f63333 0%, #f63333 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
  };

  return (
    <div className="filters-container" >
      {/* Applied Filters */}
      <div className="filter-card">
        <div className="card-header">
          <h3>Applied Filters</h3>
          <button className="clear-all" onClick={clearAll}>CLEAR ALL</button>
        </div>
        <div className="applied-pills">
          {appliedFilters.map(filter => (
            <div key={filter.id} className="applied-pill">
              {filter.label} 
              <span className="close-x" onClick={() => removeFilter(filter.id)}>×</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Filters */}
      <div className="filter-card">
        <h3>Popular Filters</h3>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.popularFilters.nonStop}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                popularFilters: { ...prev.popularFilters, nonStop: e.target.checked }
              }))}
            /> 
            <span>Non Stop</span>
          </div>
          <span className="price">₹ 13,976</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.popularFilters.hideNearbyAirports}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                popularFilters: { ...prev.popularFilters, hideNearbyAirports: e.target.checked }
              }))}
            /> 
            <span>Hide Nearby Airports</span>
          </div>
          <span className="price">₹ 6,478</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.popularFilters.refundableFares}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                popularFilters: { ...prev.popularFilters, refundableFares: e.target.checked }
              }))}
            /> 
            <span>Refundable Fares</span>
          </div>
          <span className="price">₹ 13,573</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.popularFilters.oneStop}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                popularFilters: { ...prev.popularFilters, oneStop: e.target.checked }
              }))}
            /> 
            <span>1 Stop</span>
          </div>
          <span className="price">₹ 13,576</span>
        </label>
        <span className="plus-more">+ 4 more</span>
        
        {/* <div className="divider"></div> */}
        
        <h3>Price Range</h3>
        <div className="slider-container">
          <div 
            className="price-tooltip" 
            style={{ left: `${calculateSliderPosition()}%` }}
          >
            ₹ {Number(filters.priceRange).toLocaleString()}
          </div>
          <input 
            type="range" 
            className="price-slider"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={filters.priceRange} 
            onChange={handlePriceChange}
            style={{ background: getSliderBackground() }}
          />
        </div>
        <div className="price-labels">
          <span>₹ 2,000</span>
          <span>₹ 70,000</span>
        </div>
      </div>

      {/* Onward Journey */}
      <div className="filter-card">
        <h3 className="section-title-with-bar">Onward Journey</h3>
        
        <h4 className="subsection-title">Stops From {safeFromLabel}</h4>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.onwardJourney.stops.nonStop}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                onwardJourney: { 
                  ...prev.onwardJourney, 
                  stops: { ...prev.onwardJourney.stops, nonStop: e.target.checked }
                }
              }))}
            /> 
            <span>Non Stop</span>
          </div>
          <span className="price">₹ 6,989</span>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.onwardJourney.stops.oneStop}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                onwardJourney: { 
                  ...prev.onwardJourney, 
                  stops: { ...prev.onwardJourney.stops, oneStop: e.target.checked }
                }
              }))}
            /> 
            <span>1 Stop</span>
          </div>
          <span className="price">₹ 6,694</span>
        </label>

        <h4 className="subsection-title">Departure From {safeFromLabel}</h4>
        <div className="time-slots-grid">
          <div 
            className={`time-slot-box ${filters.onwardJourney.departureTime.includes('Before 6 AM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'departureTime', 'Before 6 AM')}
          >
            <PiSunHorizon className="time-icon" />
            
            <span className="time-label">Before<br/>6 AM</span>
          </div>
          <div 
            className={`time-slot-box ${filters.onwardJourney.departureTime.includes('6 AM - 12 PM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'departureTime', '6 AM - 12 PM')}
          >
            <PiSunLight className="time-icon" />

            <span className="time-label">6 AM to<br/>12 PM</span>
          </div>
          <div 
            className={`time-slot-box ${filters.onwardJourney.departureTime.includes('12 PM - 6 PM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'departureTime', '12 PM - 6 PM')}
          >
            <IoPartlySunnyOutline className="time-icon"/>
            
            <span className="time-label">12 PM to<br/>6 PM</span>
          </div>
          <div 
            className={`time-slot-box ${filters.onwardJourney.departureTime.includes('After 6 PM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'departureTime', 'After 6 PM')}
          >
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="time-label">After<br/>6 PM</span>
          </div>
        </div>

        <h4 className="subsection-title">Arrival at {safeToLabel}</h4>
        <div className="time-slots-grid">
          <div 
            className={`time-slot-box ${filters.onwardJourney.arrivalTime.includes('Before 6 AM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'arrivalTime', 'Before 6 AM')}
          >
            <PiSunHorizon className="time-icon" />
        
            <span className="time-label">Before<br/>6 AM</span>
          </div>
          <div 
            className={`time-slot-box ${filters.onwardJourney.arrivalTime.includes('6 AM - 12 PM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'arrivalTime', '6 AM - 12 PM')}
          >
            <PiSunLight className="time-icon" />
            
            <span className="time-label">6 AM to<br/>12 PM</span>
          </div>
          <div 
            className={`time-slot-box ${filters.onwardJourney.arrivalTime.includes('12 PM - 6 PM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'arrivalTime', '12 PM - 6 PM')}
          >
            <IoPartlySunnyOutline className="time-icon"/>
             
            <span className="time-label">12 PM to<br/>6 PM</span>
          </div>
          <div 
            className={`time-slot-box ${filters.onwardJourney.arrivalTime.includes('After 6 PM') ? 'active' : ''}`}
            onClick={() => toggleTimeSlot('onwardJourney', 'arrivalTime', 'After 6 PM')}
          >
            <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <span className="time-label">After<br/>6 PM</span>
          </div>
        </div>

        <h4 className="subsection-title">Departure Airports</h4>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.onwardJourney.airports.hindon}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                onwardJourney: { 
                  ...prev.onwardJourney, 
                  airports: { ...prev.onwardJourney.airports, hindon: e.target.checked }
                }
              }))}
            /> 
            <span>Hindon Airport (32Km)</span>
          </div>
        </label>
        <label className="checkbox-row">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filters.onwardJourney.airports.igi}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                onwardJourney: { 
                  ...prev.onwardJourney, 
                  airports: { ...prev.onwardJourney.airports, igi: e.target.checked }
                }
              }))}
            /> 
            <span>Indira Gandhi International Airport</span>
          </div>
        </label>
      </div>

      {isRoundTrip && (
        <div className="filter-card">
          <h3 className="section-title-with-bar">Return Journey</h3>
          
          <h4 className="subsection-title">Stops From {safeToLabel}</h4>
          <label className="checkbox-row">
            <div className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.returnJourney.stops.nonStop}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  returnJourney: { 
                    ...prev.returnJourney, 
                    stops: { ...prev.returnJourney.stops, nonStop: e.target.checked }
                  }
                }))}
              /> 
              <span>Non Stop</span>
            </div>
            <span className="price">₹ 7,095</span>
          </label>
          <label className="checkbox-row">
            <div className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.returnJourney.stops.oneStop}
                onChange={(e) => setFilters((prev) => ({
                  ...prev,
                  returnJourney: { 
                    ...prev.returnJourney, 
                    stops: { ...prev.returnJourney.stops, oneStop: e.target.checked }
                  }
                }))}
              /> 
              <span>1 Stop</span>
            </div>
            <span className="price">₹ 7,098</span>
          </label>

          <h4 className="subsection-title">Departure From {safeToLabel}</h4>
          <div className="time-slots-grid">
            <div 
              className={`time-slot-box ${filters.returnJourney.departureTime.includes('Before 6 AM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'departureTime', 'Before 6 AM')}
            >
              <PiSunHorizon className="time-icon" />
              
              <span className="time-label">Before<br/>6 AM</span>
            </div>
            <div 
              className={`time-slot-box ${filters.returnJourney.departureTime.includes('6 AM - 12 PM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'departureTime', '6 AM - 12 PM')}
            >
              <PiSunLight className="time-icon" />
              
              <span className="time-label">6 AM to<br/>12 PM</span>
            </div>
            <div 
              className={`time-slot-box ${filters.returnJourney.departureTime.includes('12 PM - 6 PM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'departureTime', '12 PM - 6 PM')}
            >
                <IoPartlySunnyOutline className="time-icon"/>
              <span className="time-label">12 PM to<br/>6 PM</span>
            </div>
            <div 
              className={`time-slot-box ${filters.returnJourney.departureTime.includes('After 6 PM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'departureTime', 'After 6 PM')}
            >
              <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span className="time-label">After<br/>6 PM</span>
            </div>
          </div>

          <h4 className="subsection-title">Arrival at {safeFromLabel}</h4>
          <div className="time-slots-grid">
            <div 
              className={`time-slot-box ${filters.returnJourney.arrivalTime.includes('Before 6 AM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'arrivalTime', 'Before 6 AM')}
            >
              <PiSunHorizon className="time-icon" />
              
              <span className="time-label">Before<br/>6 AM</span>
            </div>
            <div 
              className={`time-slot-box ${filters.returnJourney.arrivalTime.includes('6 AM - 12 PM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'arrivalTime', '6 AM - 12 PM')}
            >
              <PiSunLight className="time-icon" />
             
              <span className="time-label">6 AM to<br/>12 PM</span>
            </div>
            <div 
              className={`time-slot-box ${filters.returnJourney.arrivalTime.includes('12 PM - 6 PM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'arrivalTime', '12 PM - 6 PM')}
            >
              <IoPartlySunnyOutline className="time-icon"/>
              <span className="time-label">12 PM to<br/>6 PM</span>
            </div>
            <div 
              className={`time-slot-box ${filters.returnJourney.arrivalTime.includes('After 6 PM') ? 'active' : ''}`}
              onClick={() => toggleTimeSlot('returnJourney', 'arrivalTime', 'After 6 PM')}
            >
              <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span className="time-label">After<br/>6 PM</span>
            </div>
          </div>

        </div>
      )}

      {/* Airlines */}
      <div className="filter-card">
        <h3>Airlines</h3>
        
        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input 
              type="checkbox" 
              checked={filters.airlines.airIndia}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                airlines: { ...prev.airlines, airIndia: e.target.checked }
              }))}
            />
            <div className="airline-logo-container">
              <img src="/airlines/a1.png" alt="Air India" className="airline-logo" />
            </div>
            <span>Air India</span>
          </div>
          <span className="price">₹ 14,705</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input 
              type="checkbox" 
              checked={filters.airlines.airIndiaExpress}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                airlines: { ...prev.airlines, airIndiaExpress: e.target.checked }
              }))}
            />
            <div className="airline-logo-container">
              <img src="/airlines/a2.png" alt="Air India Express" className="airline-logo" />
            </div>
            <span>Air India Express</span>
          </div>
          <span className="price">₹ 14,720</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input 
              type="checkbox" 
              checked={filters.airlines.akasaAir}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                airlines: { ...prev.airlines, akasaAir: e.target.checked }
              }))}
            />
            <div className="airline-logo-container">
              <img src="/airlines/a3.png" alt="Akasa Air" className="airline-logo" />
            </div>
            <span>Akasa Air</span>
          </div>
          <span className="price">₹ 14,570</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input 
              type="checkbox" 
              checked={filters.airlines.indigo}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                airlines: { ...prev.airlines, indigo: e.target.checked }
              }))}
            />
            <div className="airline-logo-container">
              <img src="/airlines/a4.png" alt="IndiGo" className="airline-logo" />
            </div>
            <span>IndiGo</span>
          </div>
          <span className="price">₹ 13,792</span>
        </label>

        <label className="checkbox-row airline-row">
          <div className="checkbox-label-with-logo">
            <input 
              type="checkbox" 
              checked={filters.airlines.spicejet}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                airlines: { ...prev.airlines, spicejet: e.target.checked }
              }))}
            />
            <div className="airline-logo-container">
              <img src="/airlines/a5.png" alt="SpiceJet" className="airline-logo" />
            </div>
            <span>SpiceJet</span>
          </div>
          <span className="price">₹ 14,605</span>
        </label>

      </div>
    </div>
  );
};

export default FiltersPanel;