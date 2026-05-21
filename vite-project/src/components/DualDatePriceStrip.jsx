import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/DualDatePriceStrip.css";

const DualDatePriceStrip = ({ 
  departureCity = "DEL", 
  arrivalCity = "BOM",
  selectedDepartureDate = null,
  selectedReturnDate = null,
  departureDates: providedDepartureDates,
  returnDates: providedReturnDates,
  onDepartureSelect,
  onReturnSelect
}) => {
  const departureScrollRef = useRef(null);
  const returnScrollRef = useRef(null);
  
  // Generate dates for one month from current date (February 18, 2026) - only once
  const [fallbackDepartureDates] = useState(() => {
    const dates = [];
    const startDate = new Date(2026, 1, 18); // February 18, 2026 (current date)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 31; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayName = daysOfWeek[currentDate.getDay()];
      const date = currentDate.getDate();
      const month = monthNames[currentDate.getMonth()];
      
      // Generate random prices between ₹5,000 and ₹8,000
      const price = `₹${(Math.floor(Math.random() * 3000) + 5000).toLocaleString()}`;
      
      dates.push({
        day: `${dayName}, ${date} ${month}`,
        price: price,
        dateObj: currentDate
      });
    }
    
    return dates;
  });

  const [fallbackReturnDates] = useState(() => {
    const dates = [];
    const startDate = new Date(2026, 1, 18); // February 18, 2026 (current date)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 31; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayName = daysOfWeek[currentDate.getDay()];
      const date = currentDate.getDate();
      const month = monthNames[currentDate.getMonth()];
      
      // Generate random prices between ₹5,000 and ₹8,000
      const price = `₹${(Math.floor(Math.random() * 3000) + 5000).toLocaleString()}`;
      
      dates.push({
        day: `${dayName}, ${date} ${month}`,
        price: price,
        dateObj: currentDate
      });
    }
    
    return dates;
  });

  const departureDates = Array.isArray(providedDepartureDates) ? providedDepartureDates : fallbackDepartureDates;
  const returnDates = Array.isArray(providedReturnDates) ? providedReturnDates : fallbackReturnDates;

  // Format date for matching
  const formatDateForMatch = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize with selected dates or defaults
  const initialDepartureDate = formatDateForMatch(selectedDepartureDate) || departureDates[0]?.key || departureDates[0]?.day;
  const initialReturnDate = formatDateForMatch(selectedReturnDate) || returnDates[3]?.key || returnDates[3]?.day;
  
  const [activeDepartureDate, setActiveDepartureDate] = useState(initialDepartureDate);
  const [activeReturnDate, setActiveReturnDate] = useState(initialReturnDate);
  const [showLeftArrowDep, setShowLeftArrowDep] = useState(false);
  const [showRightArrowDep, setShowRightArrowDep] = useState(true);
  const [showLeftArrowRet, setShowLeftArrowRet] = useState(false);
  const [showRightArrowRet, setShowRightArrowRet] = useState(true);

  const checkArrows = (scrollRef, setShowLeft, setShowRight) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scroll = (scrollRef, direction, checkArrowsCallback) => {
    if (scrollRef.current) {
      const scrollAmount = 300; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkArrowsCallback, 300);
    }
  };

  // Scroll to show selected date
  const scrollToDate = (scrollRef, dateString, dates) => {
    if (scrollRef.current && dateString) {
      const index = dates.findIndex(d => (d.key || d.day) === dateString);
      if (index !== -1) {
        const cardWidth = 150; // Width of each date card
        scrollRef.current.scrollLeft = index * cardWidth;
      }
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      checkArrows(departureScrollRef, setShowLeftArrowDep, setShowRightArrowDep);
      checkArrows(returnScrollRef, setShowLeftArrowRet, setShowRightArrowRet);
      
      // Scroll to selected dates
      if (activeDepartureDate) {
        scrollToDate(departureScrollRef, activeDepartureDate, departureDates);
      }
      if (activeReturnDate) {
        scrollToDate(returnScrollRef, activeReturnDate, returnDates);
      }
    }, 0);
  }, []);

  useEffect(() => {
    const nextDeparture = formatDateForMatch(selectedDepartureDate);
    if (nextDeparture && nextDeparture !== activeDepartureDate) {
      setActiveDepartureDate(nextDeparture);
    }
  }, [selectedDepartureDate, activeDepartureDate]);

  useEffect(() => {
    const nextReturn = formatDateForMatch(selectedReturnDate);
    if (nextReturn && nextReturn !== activeReturnDate) {
      setActiveReturnDate(nextReturn);
    }
  }, [selectedReturnDate, activeReturnDate]);

  return (
    <div className="dual-date-strip-wrapper">
      {/* Departure Date Strip */}
      <div className="single-strip-section">
        <div className="strip-header">
          <span className="strip-label">{departureCity} → {arrivalCity}</span>
          <span className="flights-count">125 Flights Available</span>
        </div>
        <div className="date-strip-container">
          {showLeftArrowDep && (
            <button 
              className="date-arrow left" 
              onClick={() => scroll(departureScrollRef, "left", () => checkArrows(departureScrollRef, setShowLeftArrowDep, setShowRightArrowDep))}
            >
              <FaChevronLeft />
            </button>
          )}

          <div 
            className="date-scroll-wrapper" 
            ref={departureScrollRef} 
            onScroll={() => checkArrows(departureScrollRef, setShowLeftArrowDep, setShowRightArrowDep)}
          >
            {departureDates.map((item, index) => {
              const itemKey = item.key || item.day || index;
              const label = item.label || item.day;
              const priceValue = typeof item.price === 'number' ? `₹ ${item.price.toLocaleString('en-IN')}` : item.price;

              return (
              <div
                key={itemKey}
                className={`date-card ${activeDepartureDate === itemKey ? "active" : ""}`}
                onClick={() => {
                  setActiveDepartureDate(itemKey);
                  onDepartureSelect?.(itemKey, item);
                }}
              >
                <span className="date-text">{label}</span>
                {priceValue && <span className="price-text">{priceValue}</span>}
              </div>
            );
            })}
          </div>

          {showRightArrowDep && (
            <button 
              className="date-arrow right" 
              onClick={() => scroll(departureScrollRef, "right", () => checkArrows(departureScrollRef, setShowLeftArrowDep, setShowRightArrowDep))}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>

      {/* Return Date Strip */}
      <div className="single-strip-section">
        <div className="strip-header">
          <span className="strip-label">{arrivalCity} → {departureCity}</span>
          <span className="flights-count">128 Flights Available</span>
        </div>
        <div className="date-strip-container">
          {showLeftArrowRet && (
            <button 
              className="date-arrow left" 
              onClick={() => scroll(returnScrollRef, "left", () => checkArrows(returnScrollRef, setShowLeftArrowRet, setShowRightArrowRet))}
            >
              <FaChevronLeft />
            </button>
          )}

          <div 
            className="date-scroll-wrapper" 
            ref={returnScrollRef} 
            onScroll={() => checkArrows(returnScrollRef, setShowLeftArrowRet, setShowRightArrowRet)}
          >
            {returnDates.map((item, index) => {
              const itemKey = item.key || item.day || index;
              const label = item.label || item.day;
              const priceValue = typeof item.price === 'number' ? `₹ ${item.price.toLocaleString('en-IN')}` : item.price;

              return (
              <div
                key={itemKey}
                className={`date-card ${activeReturnDate === itemKey ? "active" : ""}`}
                onClick={() => {
                  setActiveReturnDate(itemKey);
                  onReturnSelect?.(itemKey, item);
                }}
              >
                <span className="date-text">{label}</span>
                {priceValue && <span className="price-text">{priceValue}</span>}
              </div>
            );
            })}
          </div>

          {showRightArrowRet && (
            <button 
              className="date-arrow right" 
              onClick={() => scroll(returnScrollRef, "right", () => checkArrows(returnScrollRef, setShowLeftArrowRet, setShowRightArrowRet))}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DualDatePriceStrip;
