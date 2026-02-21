import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/DatePriceStrip.css";

const DatePriceStrip = ({ showPrice = true }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Generate dates for one month from current date (Jan 21, 2026 to Feb 21, 2026)
  const [dates] = useState(() => {
    const datesList = [];
    const startDate = new Date(2026, 0, 21); // January 21, 2026
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 31; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dayName = daysOfWeek[currentDate.getDay()];
      const date = currentDate.getDate();
      const month = monthNames[currentDate.getMonth()];
      
      // Generate random prices between ₹5,000 and ₹8,000
      const price = `₹ ${(Math.floor(Math.random() * 3000) + 5000).toLocaleString()}`;
      
      datesList.push({
        day: `${dayName}, ${date} ${month}`,
        price: price,
        dateObj: currentDate
      });
    }
    
    return datesList;
  });

  const [activeDate, setActiveDate] = useState(dates[0]?.day || null);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkArrows();
  }, []);

  return (
    <div className="date-strip-container">
      {showLeftArrow && (
        <button className="date-arrow left" onClick={() => scroll("left")}>
          <FaChevronLeft />
        </button>
      )}

      <div className="date-scroll-wrapper" ref={scrollRef} onScroll={checkArrows}>
        {dates.map((item, index) => (
          <div
            key={index}
            className={`date-card ${activeDate === item.day ? "active" : ""} ${!showPrice ? "date-only" : ""}`}
            onClick={() => setActiveDate(item.day)}
          >
            <span className="date-text">{item.day}</span>
            {showPrice && <span className="price-text">{item.price}</span>}
          </div>
        ))}
      </div>

      {showRightArrow && (
        <button className="date-arrow right" onClick={() => scroll("right")}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default DatePriceStrip;