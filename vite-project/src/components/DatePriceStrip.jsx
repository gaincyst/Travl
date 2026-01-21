import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/DatePriceStrip.css";

const DatePriceStrip = () => {
  const scrollRef = useRef(null);
  const [activeDate, setActiveDate] = useState("Wed, 21 Jan");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const dates = [
    { day: "Tue, 20 Jan", price: "₹ 5,744" },
    { day: "Wed, 21 Jan", price: "₹ 5,744" },
    { day: "Thu, 22 Jan", price: "₹ 5,744" },
    { day: "Fri, 23 Jan", price: "₹ 5,796" },
    { day: "Sat, 24 Jan", price: "₹ 5,692" },
    { day: "Sun, 25 Jan", price: "₹ 5,094" },
    { day: "Mon, 26 Jan", price: "₹ 5,392" },
    { day: "Tue, 27 Jan", price: "₹ 5,392" },
  ];

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
            className={`date-card ${activeDate === item.day ? "active" : ""}`}
            onClick={() => setActiveDate(item.day)}
          >
            <span className="date-text">{item.day}</span>
            <span className="price-text">{item.price}</span>
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