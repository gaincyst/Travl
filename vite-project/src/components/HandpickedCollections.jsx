import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation} from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const collections = [
  { id: 1, title: "Top Stays in Goa",rank: "TOP 8", img: "/collections/d1.jpeg", count: "150+ Properties" },
  { id: 2, title: "Adventure in Manali",rank: "TOP 9", img: "/collections/d2.jpeg", count: "80+ Activities" },
  { id: 3, title: "Luxury Resorts",rank: "TOP 10", img: "/collections/d3.jpeg", count: "200+ Stays" },
  { id: 4, title: "Beaches of Kerala",rank: "TOP 11", img: "/collections/d4.jpeg", count: "120+ Stays" },
  { id: 5, title: "Desert Safari", rank: "TOP 8", img: "/collections/d5.jpeg", count: "50+ Tours" },
  { id: 6, title: "Beach Adventures",rank: "TOP 9", img: "/collections/d6.jpeg", count: "100+ Tours" },
  { id: 7, title: "Mountains of Himalayas", rank: "TOP 11",img: "/collections/d7.jpeg", count: "50+ Visits" },
  { id: 8, title: "Bali Beaches",rank: "TOP 11", img: "/collections/d8.jpeg", count: "300+ Tours" },
  { id: 9, title: "Resorts in Mountains",rank: "TOP 7", img: "/collections/d9.jpeg", count: "280+ stays" },
  { id: 10, title: " Roads to Ladakh", rank: "TOP 5",img: "/collections/d10.jpeg", count: "100+ Stays" },

];

function HandpickedCollections() {
  return (
    // Change <section className="collections-section"> to:
<section className="collections-section glass-card">
      <div className="collections-header">
        <h2>Handpicked Collections for You</h2>
        <div className="swiper-nav-buttons">
          <button className="nav-btn prev-btn"><FaChevronLeft /></button>
          <button className="nav-btn next-btn"><FaChevronRight /></button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={5} /* Shows partial next slide for mobile */
        navigation={{
          prevEl: '.prev-btn',
          nextEl: '.next-btn',
        }}
        
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 5 }, /* Exact 5-card view like screenshot */
        }}
        className="collections-slider"
      >
        {collections.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="collection-card">
              <img src={item.img} alt={item.title} />
              <div className="card-badge">{item.rank}</div>
              <div className="card-info">
                <h3>{item.title}</h3>
                <p>for a Weekend Getaway</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HandpickedCollections;