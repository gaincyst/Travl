import React from 'react';
import { FaHotel, FaBinoculars, FaPlane, FaHeadset, FaCreditCard, FaRupeeSign, FaLanguage } from 'react-icons/fa';

const segments = [
  { id: 1, icon: <FaHotel />, title: "2.6M+", desc: "Hotels, Resorts, & Homes" },
  { id: 2, icon: <FaBinoculars />, title: "300K+", desc: "Tours & Experiences" },
  { id: 3, icon: <FaPlane />, title: "800+", desc: "Airlines" },
  { id: 4, icon: <FaHeadset />, title: "24/7 Branded Customer Support" },
  { id: 5, icon: <FaCreditCard />, title: "126+ Different Payment Types" },
  { id: 6, icon: <FaRupeeSign />, title: "Multi currency" },
  { id: 7, icon: <FaLanguage />, title: "Multilingual" },
];

function TravelSegments() {
  return (
    <section className="segments-section">
      <div className="segments-header">
        <p className="segments-subtitle">TRAVEL SEGMENTS</p>
        <h2 className="segments-main-title">Global Travel Inventory at Your Fingertips</h2>
      </div>

      <div className="segments-container">
        {/* Top Row: 3 Cards */}
        <div className="segments-row top-row">
          {segments.slice(0, 3).map(item => (
            <div key={item.id} className="segment-card large-card">
              <div className="segment-icon">{item.icon}</div>
              <div className="segment-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row: 4 Cards */}
        <div className="segments-row bottom-row">
          {segments.slice(3).map(item => (
            <div key={item.id} className="segment-card small-card">
              <div className="segment-icon">{item.icon}</div>
              <div className="segment-content">
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TravelSegments;