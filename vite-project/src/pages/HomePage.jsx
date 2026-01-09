import { useState, useEffect } from "react"; // Added hooks
import Navbar from "../components/Navbar";
import SearchBox from "../components/SearchBox";
import OffersSection from "../components/OffersSection";
import TravelSegments from "../components/TravelSegments";
import LogoCarousel from "../components/LogoCarousel";
import HandpickedCollections from "../components/HandpickedCollections";
import TravelInsights from "../components/TravelInsights";
import Footer from "../components/Footer";

import { FaCompass, FaMapMarkedAlt, FaGift, FaChevronDown } from "react-icons/fa";

function HomePage() {
  const [currentImg, setCurrentImg] = useState(0);

  // List your 5 JPG images here (ensure they are in public/images/)
  const images = [
    "/images/i1.jpg",
    "/images/i2.jpg",
    "/images/i3.jpg",
     "/images/i6.jpg",
    "/images/i7.jpg",
      "/images/i8.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000); // Transitions every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      <Navbar />
      
      <section className="hero">
        {/* UPDATED: Background Image Slider */}
        <div className="hero-slider">
          {images.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentImg ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          {/* Dark Overlay to make the text pop */}
          <div className="hero-overlay"></div>
        </div>

        {/* Hero Text and SearchBox - Now z-indexed to stay on top */}
        <div className="hero-content">
          <h1>Welcome to Travel2</h1>
          <p>Book flights, hotels, and buses at the best prices</p>
          <SearchBox />
        </div>

        {/* THE EDGE WRAPPER */}
        <div className="hero-bottom-edge">
          <div className="explore-more">
            <FaChevronDown className="small-chevron" />
            <span>Explore More</span>
            <FaChevronDown className="small-chevron" />
          </div>

          <div className="quick-links-container">
            <div className="quick-link-item">
              <div className="quick-link-icon-circle">
                <FaCompass />
              </div>
              <div className="quick-link-text">
                <span className="quick-link-title">Where2Go</span>
                <span className="quick-link-desc">Find your next destination</span>
              </div>
            </div>

            <div className="quick-link-item">
              <div className="quick-link-icon-circle">
                <FaMapMarkedAlt />
              </div>
              <div className="quick-link-text">
                <span className="quick-link-title">How2Go</span>
                <span className="quick-link-desc">Find routes to anywhere</span>
              </div>
            </div>

            <div className="quick-link-item">
              <div className="quick-link-icon-circle">
                <FaGift />
              </div>
              <div className="quick-link-text">
                <span className="quick-link-title">Gift Cards</span>
                <span className="quick-link-desc">Share the joy of travel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: "60px" }}></div>
      <OffersSection />
      <TravelSegments />
      <LogoCarousel />
      <HandpickedCollections />
      <TravelInsights />
      <Footer />
    </>
  );
}

export default HomePage;