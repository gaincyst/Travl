import React from 'react';

const logos = [
  { id: 1, name: "EazyPe", fileName: "l1.png" },
  { id: 2, name: "iPaymnt", fileName: "l2.png" },
  { id: 3, name: "SDT Pay", fileName: "l3.png" },
    { id: 4, name: "FreeCharge", fileName: "l4.png" },
    { id: 5, name: "Mobikwik", fileName: "l5.png" },
  
];

function LogoCarousel() {
  // We repeat the array multiple times to ensure the track is long enough to animate
  const displayLogos = [...logos, ...logos];

  return (
    <div className="logo-carousel-section">
      <div className="logo-slider">
        <div className="logo-track">
          {displayLogos.map((logo, index) => (
            <div className="logo-slide" key={index}>
              <img 
                src={`${window.location.origin}/logo/${logo.fileName}`} 
                alt={logo.name} 
                className="carousel-img"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogoCarousel;