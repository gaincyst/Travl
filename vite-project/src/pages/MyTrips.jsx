import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyTripsNavbar from "../components/MyTripsNavbar";
import Footer from "../components/Footer";
import { FaPlane, FaBus, FaHotel, FaChevronRight } from "react-icons/fa";
import "../styles/MyTrips.css";

function MyTrips() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Upcoming");
  const [activeService, setActiveService] = useState("Flights");
  const [currentImg, setCurrentImg] = useState(0);

  // List of background images from mytrips folder
  const images = [
    "/mytrips/trip1.jpeg",
    "/mytrips/trip2.jpg",
    "/mytrips/trip3.jpeg",
    "/mytrips/trip4.jpeg",
    "/mytrips/trip5.jpeg",
    "/mytrips/trip6.jpg",
    "/mytrips/trip7.jpeg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      <MyTripsNavbar />
      
      <div className="mytrips-page">
        {/* Background Slideshow */}
        <div className="mytrips-background">
          {images.map((img, index) => (
            <div
              key={index}
              className={`mytrips-bg-image ${index === currentImg ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="mytrips-container">
          {/* Breadcrumb + Filter Row */}
          <div className="breadcrumb-filter-row">
            <div className="breadcrumb">
              <span className="breadcrumb-link" onClick={() => navigate('/')}>Home</span>
              <FaChevronRight className="breadcrumb-arrow" />
              <span className="breadcrumb-current">My Trips</span>
            </div>
            
            <div className="filter-pills">
              {["Upcoming", "Past", "Cancelled", "Failed"].map((filter) => (
                <button
                  key={filter}
                  className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Service Strip */}
          <div className="service-strip">
            <div
              className={`service-option ${activeService === "Flights" ? "active" : ""}`}
              onClick={() => setActiveService("Flights")}
            >
              <FaPlane className="service-icon" />
              <span>Flights</span>
            </div>
            <div
              className={`service-option ${activeService === "Buses" ? "active" : ""}`}
              onClick={() => setActiveService("Buses")}
            >
              <FaBus className="service-icon" />
              <span>Buses</span>
            </div>
            <div
              className={`service-option ${activeService === "Hotels" ? "active" : ""}`}
              onClick={() => setActiveService("Hotels")}
            >
              <FaHotel className="service-icon" />
              <span>Hotels</span>
            </div>
          </div>

          {/* Booking Cards Container - Empty for now */}
          <div className="booking-cards-container">
            {/* Content will be added later */}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MyTrips;
