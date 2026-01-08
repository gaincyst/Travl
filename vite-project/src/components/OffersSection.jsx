import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const offersData = [
  { id: 1, type: "DOM HOTELS", title: "FOR 26-28 JAN LONG WEEKEND GETAWAYS:", desc: "Grab up to 40% OFF* on entire villas & homestays!", img: "/offers/offer1.jpg" },
  { id: 2, type: "INTL FLIGHTS", title: "Travel All Around the World with Up to 25% OFF*", desc: "on Flights and Hotels.", img: "/offers/offer2.jpg" },
  { id: 3, type: "DOM HOTELS", title: "MAKE TIMELESS MEMORIES ON YOUR STAY:", desc: "Book Club Mahindra Resorts with Up to 30% OFF*", img: "/offers/offer3.jpg" },
  { id: 3, type: "AIRINDIA FLIGHTS", title: "FLIGHT HIGH IN THE SKY : 20% OFF", desc: "On Flights of Business Class up to 20% off", img: "/offers/offer4.jpg" },
  // Add more offer objects here...
];

function OffersSection() {
  const scrollRef = useRef(null);

  // Scroll function for the category tabs
  const scrollTabs = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 150 : scrollLeft + 150;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    // Change your section tag to include the class:
<section className="offers-section glass-card">
      <div className="offers-header">
        <div className="offers-nav-wrapper">
          <h2 className="offers-main-title">Offers</h2>
          
          

           <div className="offers-tabs">
              <span className="active">All Offers</span>
              <span>Bank Offers</span>
              <span>Flights</span>
              <span>Bus</span>
              <span>Hotels</span>
              <span>Holidays</span>
            </div>
            
        </div>

        <div className="view-all-link">
          <span>VIEW ALL</span>
          <FaChevronRight className="view-all-arrow" />
        </div>
      </div>

      <div className="offers-grid">
        {offersData.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-img-box">
             <img src={offer.img} alt={offer.title} />
            </div>
            <div className="offer-details">
              <div className="offer-meta">
                <span className="offer-type">{offer.type}</span>
                <span className="offer-tc">T&C'S APPLY</span>
              </div>
              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-desc">{offer.desc}</p>
              <div className="offer-action">
                {offer.type.includes("HOTELS") ? "VIEW DETAILS" : "BOOK NOW"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OffersSection;