import { useState, useRef, useEffect } from "react";
import { FaPlane, FaHotel, FaBus, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TravellersDropdown from "./TravellersClassDropdown";
import HotelGuestsDropdown from "./HotelGuestsDropdown";
import { useNavigate } from "react-router-dom"; // Navigation Import
import { API_ENDPOINTS } from "../utils/api";

function SearchBox({ preFilledData, hideServiceTabs, activeService, hideTripType }) {
  const navigate = useNavigate(); // Initialize hook
  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);
  const returnDatePickerRef = useRef(null);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromBoxRef = useRef(null);
  const toBoxRef = useRef(null);

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
  const [fromInput, setFromInput] = useState("Delhi");
  const [toInput, setToInput] = useState("Bengaluru");
  const [fromAirport, setFromAirport] = useState(null);
  const [toAirport, setToAirport] = useState(null);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [activeAirportField, setActiveAirportField] = useState(null);
  const [airportResults, setAirportResults] = useState([]);
  const [popularAirports, setPopularAirports] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [airportLoading, setAirportLoading] = useState(false);

  const [hotelData, setHotelData] = useState({ rooms: 1, adults: 2, children: 0 });

  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
    setFromInput(toInput);
    setToInput(fromInput);
    setFromAirport(toAirport);
    setToAirport(fromAirport);
  };

  const handleApply = () => {
    const totalTravellers = tempSelection.adults + tempSelection.children + tempSelection.infants;
    setDisplayValue({ total: totalTravellers, cabinClass: tempSelection.cabinClass });
    setOpenTravellers(false);
  };

  const formatAirportInput = (airport) => {
    if (!airport) return "";
    return `${airport.code} - ${airport.city}`;
  };

  const openAirportDropdown = (field) => {
    setActiveAirportField(field);
    if (field === 'from') {
      setFromDropdownOpen(true);
      setToDropdownOpen(false);
      setTimeout(() => fromInputRef.current?.focus(), 0);
    } else {
      setToDropdownOpen(true);
      setFromDropdownOpen(false);
      setTimeout(() => toInputRef.current?.focus(), 0);
    }
  };

  const closeAirportDropdowns = () => {
    setFromDropdownOpen(false);
    setToDropdownOpen(false);
    setActiveAirportField(null);
  };

  const handleAirportSelect = (airport, field) => {
    if (!airport) return;
    if (field === 'from') {
      setFromAirport(airport);
      setFromCity(airport.city);
      setFromInput(formatAirportInput(airport));
      setFromDropdownOpen(false);
    } else {
      setToAirport(airport);
      setToCity(airport.city);
      setToInput(formatAirportInput(airport));
      setToDropdownOpen(false);
    }
  };

  const handleRecentSelect = (search) => {
    if (!search) return;
    const from = {
      code: search.from_airport,
      city: search.from_city,
      country: search.from_country,
      airport_name: search.from_airport_name
    };
    const to = {
      code: search.to_airport,
      city: search.to_city,
      country: search.to_country,
      airport_name: search.to_airport_name
    };
    setFromAirport(from);
    setToAirport(to);
    setFromCity(from.city);
    setToCity(to.city);
    setFromInput(formatAirportInput(from));
    setToInput(formatAirportInput(to));
    closeAirportDropdowns();
  };

  // Logic to navigate on Search click
  const resolveAirportByInput = async (inputValue) => {
    if (!inputValue || !inputValue.trim()) return null;
    try {
      const response = await fetch(
        `${API_ENDPOINTS.AIRPORTS_SEARCH}?query=${encodeURIComponent(inputValue)}&limit=5`
      );
      const data = await response.json();
      return data?.data?.airports?.[0] || null;
    } catch (error) {
      console.error("Airport resolve error:", error);
      return null;
    }
  };

  const saveRecentSearch = async (fromCode, toCode) => {
    try {
      await fetch(API_ENDPOINTS.RECENT_SEARCH_SAVE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromAirport: fromCode, toAirport: toCode })
      });
      const recentResponse = await fetch(`${API_ENDPOINTS.AIRPORTS_RECENT}?limit=6`);
      const recentData = await recentResponse.json();
      setRecentSearches(recentData?.data?.searches || []);
    } catch (error) {
      console.error("Recent search save error:", error);
    }
  };

  const handleSearch = async () => {
    console.log("Active Tab:", activeTab); // Debug log
    if (activeTab === "flights") {
      // If round trip is selected but no return date, redirect to one-way
      let effectiveTripType = tripType;
      let effectiveReturnDate = returnDate;

      if (tripType === "roundTrip" && !returnDate) {
        effectiveTripType = "oneWay";
        effectiveReturnDate = null;
      }

      let resolvedFrom = fromAirport;
      let resolvedTo = toAirport;

      if (!resolvedFrom) {
        resolvedFrom = await resolveAirportByInput(fromInput);
      }

      if (!resolvedTo) {
        resolvedTo = await resolveAirportByInput(toInput);
      }

      if (!resolvedFrom || !resolvedTo) {
        alert("Please select valid From and To airports.");
        return;
      }

      setFromAirport(resolvedFrom);
      setToAirport(resolvedTo);
      setFromCity(resolvedFrom.city);
      setToCity(resolvedTo.city);
      setFromInput(formatAirportInput(resolvedFrom));
      setToInput(formatAirportInput(resolvedTo));

      await saveRecentSearch(resolvedFrom.code, resolvedTo.code);

      navigate("/flights", {
        state: {
          fromCity: resolvedFrom.city,
          toCity: resolvedTo.city,
          fromCode: resolvedFrom.code,
          toCode: resolvedTo.code,
          fromAirport: resolvedFrom,
          toAirport: resolvedTo,
          startDate,
          returnDate: effectiveReturnDate,
          displayValue,
          tripType: effectiveTripType,
          adults: tempSelection.adults,
          children: tempSelection.children,
          infants: tempSelection.infants
        }
      });
    } else if (activeTab === "bus") {
      navigate("/bus-results", {
        state: { fromCity, toCity, startDate, returnDate, tripType }
      });
    } else if (activeTab === "hotel") {
      navigate("/hotel-results", {
        state: { city: fromCity, checkInDate: startDate, checkOutDate: returnDate, guests: displayValue }
      });
    } else {
      // Fallback in case activeTab doesn't match
      console.warn("Unknown activeTab:", activeTab);
    }
  };

  // Update activeTab when activeService prop changes
  useEffect(() => {
    if (activeService) {
      setActiveTab(activeService);
    }
  }, [activeService]);

  // Populate form fields from preFilledData
  useEffect(() => {
    if (preFilledData) {
      // Set trip type
      if (preFilledData.tripType) {
        setTripType(preFilledData.tripType);
      }
      
      // Set cities and airports
      if (preFilledData.fromAirport) {
        setFromAirport(preFilledData.fromAirport);
        setFromCity(preFilledData.fromAirport.city || preFilledData.fromCity || "");
        setFromInput(formatAirportInput(preFilledData.fromAirport));
      } else if (preFilledData.fromCode || preFilledData.fromCity) {
        const fromCandidate = {
          code: preFilledData.fromCode || "",
          city: preFilledData.fromCity || "",
          country: preFilledData.fromAirport?.country || "",
          airport_name: preFilledData.fromAirport?.airport_name || ""
        };
        setFromAirport(preFilledData.fromCode ? fromCandidate : null);
        setFromCity(preFilledData.fromCity || "");
        setFromInput(preFilledData.fromCode ? formatAirportInput(fromCandidate) : (preFilledData.fromCity || ""));
      }

      if (preFilledData.toAirport) {
        setToAirport(preFilledData.toAirport);
        setToCity(preFilledData.toAirport.city || preFilledData.toCity || "");
        setToInput(formatAirportInput(preFilledData.toAirport));
      } else if (preFilledData.toCode || preFilledData.toCity) {
        const toCandidate = {
          code: preFilledData.toCode || "",
          city: preFilledData.toCity || "",
          country: preFilledData.toAirport?.country || "",
          airport_name: preFilledData.toAirport?.airport_name || ""
        };
        setToAirport(preFilledData.toCode ? toCandidate : null);
        setToCity(preFilledData.toCity || "");
        setToInput(preFilledData.toCode ? formatAirportInput(toCandidate) : (preFilledData.toCity || ""));
      }
      
      // Set dates
      if (preFilledData.startDate) {
        setStartDate(new Date(preFilledData.startDate));
      }
      if (preFilledData.returnDate) {
        setReturnDate(new Date(preFilledData.returnDate));
      }
      
      // Set traveller data
      if (preFilledData.adults !== undefined || preFilledData.children !== undefined || preFilledData.infants !== undefined) {
        const adults = preFilledData.adults || 1;
        const children = preFilledData.children || 0;
        const infants = preFilledData.infants || 0;
        const cabinClass = preFilledData.displayValue?.cabinClass || "Economy";
        
        setTempSelection({ adults, children, infants, cabinClass });
        setDisplayValue({ total: adults + children + infants, cabinClass });
      }
    }
  }, [preFilledData]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenTravellers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleAirportClickOutside = (e) => {
      const clickedFrom = fromBoxRef.current && fromBoxRef.current.contains(e.target);
      const clickedTo = toBoxRef.current && toBoxRef.current.contains(e.target);

      if (!clickedFrom && !clickedTo) {
        closeAirportDropdowns();
      }
    };

    document.addEventListener("mousedown", handleAirportClickOutside);
    return () => document.removeEventListener("mousedown", handleAirportClickOutside);
  }, []);

  useEffect(() => {
    const loadAirportSections = async () => {
      try {
        const [popularResponse, recentResponse] = await Promise.all([
          fetch(`${API_ENDPOINTS.AIRPORTS_POPULAR}?limit=8`),
          fetch(`${API_ENDPOINTS.AIRPORTS_RECENT}?limit=6`)
        ]);

        const popularData = await popularResponse.json();
        const recentData = await recentResponse.json();

        setPopularAirports(popularData?.data?.airports || []);
        setRecentSearches(recentData?.data?.searches || []);
      } catch (error) {
        console.error("Airport sections load error:", error);
      }
    };

    loadAirportSections();
  }, []);

  useEffect(() => {
    const query = activeAirportField === 'from' ? fromInput : toInput;
    if (!activeAirportField || !query || !query.trim()) {
      setAirportResults([]);
      setAirportLoading(false);
      return undefined;
    }

    setAirportLoading(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.AIRPORTS_SEARCH}?query=${encodeURIComponent(query)}&limit=10`
        );
        const data = await response.json();
        setAirportResults(data?.data?.airports || []);
      } catch (error) {
        console.error("Airport search error:", error);
        setAirportResults([]);
      } finally {
        setAirportLoading(false);
      }
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [activeAirportField, fromInput, toInput]);

  const isRoundTripEnabled = (activeTab === 'flights' || activeTab === 'bus') && tripType === "roundTrip";

  const renderAirportOption = (airport, field) => (
    <button
      key={`${field}-${airport.code}`}
      type="button"
      className="airport-option"
      onClick={() => handleAirportSelect(airport, field)}
    >
      <div className="airport-code">{airport.code}</div>
      <div className="airport-info">
        <div className="airport-city">{airport.city}, {airport.country}</div>
        <div className="airport-name">{airport.airport_name}</div>
      </div>
    </button>
  );

  const renderAirportDropdown = (field) => {
    const isOpen = field === 'from' ? fromDropdownOpen : toDropdownOpen;
    const query = field === 'from' ? fromInput : toInput;
    const hasQuery = Boolean(query && query.trim());

    if (!isOpen) return null;

    const recentSection = recentSearches.length > 0 ? (
      <div className="airport-section">
        <div className="airport-section-title">Recent Searches</div>
        {recentSearches.map((search) => (
          <button
            key={search.id}
            type="button"
            className="recent-search-option"
            onClick={() => handleRecentSelect(search)}
          >
            <div className="recent-route">
              <span className="recent-code">{search.from_airport}</span>
              <span className="recent-arrow">→</span>
              <span className="recent-code">{search.to_airport}</span>
            </div>
            <div className="recent-city">{search.from_city} to {search.to_city}</div>
          </button>
        ))}
      </div>
    ) : null;

    const popularSection = popularAirports.length > 0 ? (
      <div className="airport-section">
        <div className="airport-section-title">Popular Searches</div>
        <div className="airport-options">
          {popularAirports.map((airport) => renderAirportOption(airport, field))}
        </div>
      </div>
    ) : null;

    const searchSection = (
      <div className="airport-section">
        <div className="airport-section-title">Search Results</div>
        {airportLoading && <div className="airport-loading">Searching airports...</div>}
        {!airportLoading && !hasQuery && (
          <div className="airport-empty">Start typing to search airports</div>
        )}
        {!airportLoading && hasQuery && airportResults.length === 0 && (
          <div className="airport-empty">No airports found</div>
        )}
        {!airportLoading && airportResults.length > 0 && (
          <div className="airport-options">
            {airportResults.map((airport) => renderAirportOption(airport, field))}
          </div>
        )}
      </div>
    );

    return (
      <div className="airport-dropdown">
        {hasQuery ? (
          <>
            {searchSection}
            {recentSection}
            {popularSection}
          </>
        ) : (
          <>
            {recentSection}
            {popularSection}
            {searchSection}
          </>
        )}
      </div>
    );
  };

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

      {activeTab === 'flights' && !hideTripType && (
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
        <div
          className="box-section"
          ref={fromBoxRef}
          onClick={() => (activeTab === 'flights' ? openAirportDropdown('from') : undefined)}
        >
          <div className="label-row">
            <span className="label">{activeTab === 'hotel' ? 'Place' : 'From'}</span>
          </div>
          {activeTab === 'hotel' ? (
            <strong className="display-date">Mumbai</strong>
          ) : activeTab === 'flights' ? (
            <div className="airport-input-wrapper">
              <input
                ref={fromInputRef}
                type="text"
                className="airport-input"
                placeholder="From"
                value={fromInput}
                onChange={(e) => {
                  setFromInput(e.target.value);
                  setFromAirport(null);
                  setActiveAirportField('from');
                  setFromDropdownOpen(true);
                }}
                onFocus={() => openAirportDropdown('from')}
                autoComplete="off"
              />
              {renderAirportDropdown('from')}
            </div>
          ) : (
            <strong className="display-date">{fromCity}</strong>
          )}
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
        <div
          className="box-section"
          ref={toBoxRef}
          onClick={() => (activeTab === 'flights' ? openAirportDropdown('to') : undefined)}
        >
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
          ) : activeTab === 'flights' ? (
            <div className="airport-input-wrapper">
              <input
                ref={toInputRef}
                type="text"
                className="airport-input"
                placeholder="To"
                value={toInput}
                onChange={(e) => {
                  setToInput(e.target.value);
                  setToAirport(null);
                  setActiveAirportField('to');
                  setToDropdownOpen(true);
                }}
                onFocus={() => openAirportDropdown('to')}
                autoComplete="off"
              />
              {renderAirportDropdown('to')}
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