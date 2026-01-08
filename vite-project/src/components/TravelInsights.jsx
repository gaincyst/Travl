import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Specific Icons to match the reference
import { HiClipboardList } from "react-icons/hi";
import { MdLocalHotel } from "react-icons/md";
import { IoAirplaneSharp } from "react-icons/io5";
import { FaLocationPinLock } from "react-icons/fa6";
import { TbWorldPin } from "react-icons/tb";

import 'swiper/css';
import 'swiper/css/navigation';

const insights = [
  {
    id: 1,
    icon: <HiClipboardList />,
    title: "Last-Minute? Still Sorted",
    desc: "Spontaneous plans hit different. Quick bookings for flights, buses, and stays — no stress.",
    iconColor: "#1a73e8",
    iconBg: "#e8f0fe"
  },
  {
    id: 2,
    icon: <MdLocalHotel />,
    title: "Stays That Match Your Vibe",
    desc: "From budget to boujee.Book hotels you’ll actually love, with honest reviews.",
    iconColor: "#202124",
    iconBg: "#f8f9fa"
  },
  {
    id: 3,
    icon: <IoAirplaneSharp style={{ transform: 'rotate(-45deg)' }} />,
    title: "Flights, Minus the Drama",
    desc: "Late plans or early check-ins — we’ve got you. Find smooth flights, smart prices, and book in seconds.",
    iconColor: "#006064",
    iconBg: "#e0f2f1"
  },
   {
    id: 4,
    icon: <FaLocationPinLock />,
    title: "Travel, But Keep It Secure",
    desc: "Safe payments. Clear prices. Because peace of mind is part of the trip.",
    iconColor: "#0894beff",
    iconBg: "#d9f8f7ff"
  },
   {
    id: 5,
    icon: <TbWorldPin />,
    title: "One App. All the Travel.",
    desc: "Flights. Buses. Hotels. Everything you need, right where you are.",
    iconColor: "#340ba5ff",
    iconBg: "#dee4f8ff"
  }
];

function TravelInsights() {
  return (
    <section className="insight-section glass-card">
      <div className="insights-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={3}
          navigation={{
            prevEl: '.ins-prev',
            nextEl: '.ins-next',
          }}
          className="insights-swiper"
        >
          {insights.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="insight-card">
                <div className="insight-icon-container" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                  {item.icon}
                </div>
                <div className="insight-body">
                  <h4 className="insight-heading">{item.title}</h4>
                  {item.desc && <p className="insight-desc">{item.desc}</p>}
                  {item.link && <a href="#" className="insight-action">{item.link}</a>}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Precise Arrow Positioning */}
        <button className="ins-arrow ins-prev"><FaChevronLeft /></button>
        <button className="ins-arrow ins-next"><FaChevronRight /></button>
      </div>
    </section>
  );
}

export default TravelInsights;