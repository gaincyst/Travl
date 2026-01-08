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
  return (
    <>
      
      <Navbar />
      
      <section className="hero">
        {/* Background Image */}
        <div className="hero-bg"></div>

        {/* Hero Text and SearchBox */}
        <div className="hero-content">
          <h1>Welcome to Travel2</h1>
          <p>Book flights, hotels, and buses at the best prices</p>
          <SearchBox />
        </div>

        {/* THE EDGE WRAPPER: Contains Explore More and Quick Links */}
        <div className="hero-bottom-edge">
          {/* Explore More - Centered above the white bar */}
          <div className="explore-more">
            <FaChevronDown className="small-chevron" />
            <span>Explore More</span>
            <FaChevronDown className="small-chevron" />
          </div>

          {/* QUICK LINKS BAR - Floats half-on, half-off the hero edge */}
          <div className="quick-links-container">
            {/* WHERE TO GO */}
            <div className="quick-link-item">
              <div className="quick-link-icon-circle">
                <FaCompass />
              </div>
              <div className="quick-link-text">
                <span className="quick-link-title">Where2Go</span>
                <span className="quick-link-desc">Find your next destination</span>
              </div>
            </div>

            {/* HOW TO GO */}
            <div className="quick-link-item">
              <div className="quick-link-icon-circle">
                <FaMapMarkedAlt />
              </div>
              <div className="quick-link-text">
                <span className="quick-link-title">
                  How2Go 
                </span>
                <span className="quick-link-desc">Find routes to anywhere</span>
              </div>
            </div>

            {/* GIFT CARDS */}
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

      {/* Spacer to prevent OffersSection from overlapping the floating bar */}
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