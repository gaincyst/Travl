function OffersSection() {
  return (
    <section className="offers">
      <div className="offers-header">
        <h2>Offers</h2>
        <span className="view-all">All Offers →</span>
      </div>

      <div className="offers-tabs">
        <span className="active">Flights</span>
        <span>Hotels</span>
        <span>Buses</span>
        <span>Holidays</span>
      </div>

      <div className="offers-grid">
        <div className="offer-card">Flight Offer Card</div>
        <div className="offer-card">Hotel Offer Card</div>
        <div className="offer-card">Bus Offer Card</div>
      </div>
    </section>
  );
}

export default OffersSection;
