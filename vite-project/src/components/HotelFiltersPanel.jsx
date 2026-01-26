import React, { useState } from "react";
import "../styles/HotelFiltersPanel.css";
import { FaSearch } from "react-icons/fa";

const HotelFiltersPanel = () => {
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [amenitySearch, setAmenitySearch] = useState("");
  const [showMoreSuggested, setShowMoreSuggested] = useState(false);
  const [showMorePropertyType, setShowMorePropertyType] = useState(false);
  const [showMoreChains, setShowMoreChains] = useState(false);
  
  // Filter states
  const [selectedSuggested, setSelectedSuggested] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedRoomViews, setSelectedRoomViews] = useState([]);
  const [selectedChains, setSelectedChains] = useState([]);
  const [selectedLuxe, setSelectedLuxe] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedBookingPref, setSelectedBookingPref] = useState([]);
  const [selectedHouseRules, setSelectedHouseRules] = useState([]);
  const [selectedDeals, setSelectedDeals] = useState([]);

  // Data from screenshots
  const suggestedOptions = [
    { name: "Rush Deal", count: 232 },
    { name: "Last Minute Deals", count: null },
    { name: "5 Star", count: 155 },
    { name: "North Goa", count: null },
    { name: "Resorts", count: 301 }
  ];

  const priceRanges = [
    { label: "₹ 0 - ₹ 3000", count: 804 },
    { label: "₹ 3000 - ₹ 6000", count: 612 },
    { label: "₹ 6000 - ₹ 9000", count: 219 },
    { label: "₹ 9000 - ₹ 12000", count: 138 },
    { label: "₹ 12000 - ₹ 15000", count: 97 },
    { label: "₹ 15000 - ₹ 30000", count: 251 },
    { label: "₹ 30000+", count: 126 }
  ];

  const starCategories = [
    { label: "3 Star", count: 571 },
    { label: "4 Star", count: 276 },
    { label: "5 Star", count: 155 }
  ];

  const userRatings = [
    { label: "Excellent: 4.2+", count: 553 },
    { label: "Very Good: 3.5+", count: 1282 },
    { label: "Good: 3+", count: 656 }
  ];

  const propertyTypes = [
    { name: "Apartment", count: 552 },
    { name: "Hotel", count: 532 },
    { name: "Villa", count: 532 },
    { name: "Resort", count: 313 },
    { name: "Homestay", count: 135 }
  ];

  const topLocations = [
    "North Goa", "South Goa", "Baga Beach", "Calangute Beach", 
    "Panjim", "Candolim Beach", "Vagator", "Palolem Beach", 
    "Anjuna Beach", "Candolim"
  ];

  const roomViews = [
    { name: "Garden View", count: 468 },
    { name: "City View", count: 308 },
    { name: "Sea View", count: 131 },
    { name: "Pool View", count: 356 }
  ];

  const chains = [
    { name: "1022", count: 0 },
    { name: "7 Apple Hotel & Resorts", count: 1 },
    { name: "AM Kollection - Larisa Hotels", count: 3 },
    { name: "Accor - Novotel & ibis", count: 8 },
    { name: "Ama Stays & Trails", count: 10 }
  ];

  const amenitiesGuestsLove = [
    { name: "Swimming Pool", count: 1440 },
    { name: "Wi-Fi", count: 2177 },
    { name: "Spa", count: 177 }
  ];

  const amenitiesGeneral = [
    { name: "Restaurant", count: 872 },
    { name: "Parking", count: 1855 },
    { name: "Bonfire", count: 144 },
    { name: "Bar", count: 647 },
    { name: "Barbeque", count: 369 },
    { name: "Kitchen Available", count: 969 },
    { name: "Room Service", count: 1442 },
    { name: "EV Charging Station", count: 0 },
    { name: "Caretaker", count: 397 },
    { name: "Elevator/Lift", count: 527 },
    { name: "Balcony/Terrace", count: 894 },
    { name: "Cafe", count: 4 }
  ];

  const bookingPreferences = [
    { name: "Caretaker", count: 397 },
    { name: "Instant Book", count: 2128 },
    { name: "Entire Villas & Apartments", count: 957 },
    { name: "Homestays", count: 1298 }
  ];

  const houseRules = [
    { name: "Smoking Allowed", count: 1584 },
    { name: "Unmarried Couples Allowed", count: 2123 },
    { name: "Alcohol Allowed", count: 1359 },
    { name: "Pets Allowed", count: 402 }
  ];

  const dealsOffers = [
    { name: "Travel ka Muhurat Sale", count: 744 },
    { name: "Lightning Drops", count: 45 }
  ];

  const removeFilter = (filter) => {
    setAppliedFilters(appliedFilters.filter(item => item !== filter));
    
    // Remove from corresponding state arrays
    setSelectedSuggested(selectedSuggested.filter(f => f !== filter));
    setSelectedPriceRanges(selectedPriceRanges.filter(f => f !== filter));
    setSelectedStars(selectedStars.filter(f => f !== filter));
    setSelectedRatings(selectedRatings.filter(f => f !== filter));
    setSelectedPropertyTypes(selectedPropertyTypes.filter(f => f !== filter));
    setSelectedLocations(selectedLocations.filter(f => f !== filter));
    setSelectedRoomViews(selectedRoomViews.filter(f => f !== filter));
    setSelectedChains(selectedChains.filter(f => f !== filter));
    setSelectedAmenities(selectedAmenities.filter(f => f !== filter));
    setSelectedBookingPref(selectedBookingPref.filter(f => f !== filter));
    setSelectedHouseRules(selectedHouseRules.filter(f => f !== filter));
    setSelectedDeals(selectedDeals.filter(f => f !== filter));
    
    if (filter === "MMT Luxe Selections") {
      setSelectedLuxe(false);
    }
  };

  const clearAll = () => {
    setAppliedFilters([]);
    setSelectedSuggested([]);
    setSelectedPriceRanges([]);
    setBudgetMin("");
    setBudgetMax("");
    setSelectedStars([]);
    setSelectedRatings([]);
    setSelectedPropertyTypes([]);
    setSelectedLocations([]);
    setSelectedRoomViews([]);
    setSelectedChains([]);
    setSelectedLuxe(false);
    setSelectedAmenities([]);
    setSelectedBookingPref([]);
    setSelectedHouseRules([]);
    setSelectedDeals([]);
  };

  const handleCheckboxToggle = (item, stateArray, setStateArray) => {
    if (stateArray.includes(item)) {
      setStateArray(stateArray.filter(i => i !== item));
      setAppliedFilters(appliedFilters.filter(f => f !== item));
    } else {
      setStateArray([...stateArray, item]);
      setAppliedFilters([...appliedFilters, item]);
    }
  };

  const handleBudgetApply = () => {
    if (budgetMin || budgetMax) {
      const budgetLabel = `Budget: ₹${budgetMin || '0'} - ₹${budgetMax || '∞'}`;
      if (!appliedFilters.includes(budgetLabel)) {
        setAppliedFilters([...appliedFilters, budgetLabel]);
      }
    }
  };

  return (
    <div className="hotel-filters-container">
      {/* Applied Filters */}
      <div className="hotel-filter-card">
        <div className="hotel-card-header">
          <h3 className="hotel-section-title-with-bar">Applied Filters</h3>
          <button className="hotel-clear-all" onClick={clearAll}>CLEAR ALL</button>
        </div>
        {appliedFilters.length > 0 && (
          <div className="hotel-applied-pills">
            {appliedFilters.map((filter, index) => (
              <div key={index} className="hotel-applied-pill">
                {filter}
                <span className="hotel-close-x" onClick={() => removeFilter(filter)}>×</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Field & Suggested For You - Combined */}
      <div className="hotel-filter-card">
        <div className="hotel-search-input-wrapper">
          <FaSearch className="hotel-search-icon" />
          <input 
            type="text" 
            placeholder="Search for" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hotel-search-input"
          />
        </div>
        
        <h3 className="hotel-section-title-with-bar">Suggested For You</h3>
        {suggestedOptions.slice(0, showMoreSuggested ? suggestedOptions.length : 5).map((option) => (
          <div key={option.name} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox" 
                checked={selectedSuggested.includes(option.name)}
                onChange={() => handleCheckboxToggle(option.name, selectedSuggested, setSelectedSuggested)}
              />
              <span>{option.name}</span>
            </label>
            {option.count && <span className="hotel-count">({option.count})</span>}
          </div>
        ))}
        <div className="hotel-plus-more" onClick={() => setShowMoreSuggested(!showMoreSuggested)}>
          {showMoreSuggested ? "Show less" : "Show 8 more"}
        </div>
      </div>

      {/* Price Per Night */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Price Per Night</h3>
        {priceRanges.map((range) => (
          <div key={range.label} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedPriceRanges.includes(range.label)}
                onChange={() => handleCheckboxToggle(range.label, selectedPriceRanges, setSelectedPriceRanges)}
              />
              <span>{range.label}</span>
            </label>
            <span className="hotel-count">({range.count})</span>
          </div>
        ))}
      </div>

      {/* Star Category */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Star Category</h3>
        {starCategories.map((star) => (
          <div key={star.label} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedStars.includes(star.label)}
                onChange={() => handleCheckboxToggle(star.label, selectedStars, setSelectedStars)}
              />
              <span>{star.label}</span>
            </label>
            <span className="hotel-count">({star.count})</span>
          </div>
        ))}
      </div>

      {/* User Rating */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">User Rating</h3>
        {userRatings.map((rating) => (
          <div key={rating.label} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedRatings.includes(rating.label)}
                onChange={() => handleCheckboxToggle(rating.label, selectedRatings, setSelectedRatings)}
              />
              <span>{rating.label}</span>
            </label>
            <span className="hotel-count">({rating.count})</span>
          </div>
        ))}
      </div>

      {/* Property Type */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Property Type</h3>
        {propertyTypes.slice(0, showMorePropertyType ? propertyTypes.length : 5).map((type) => (
          <div key={type.name} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedPropertyTypes.includes(type.name)}
                onChange={() => handleCheckboxToggle(type.name, selectedPropertyTypes, setSelectedPropertyTypes)}
              />
              <span>{type.name}</span>
            </label>
            <span className="hotel-count">({type.count})</span>
          </div>
        ))}
        <div className="hotel-plus-more" onClick={() => setShowMorePropertyType(!showMorePropertyType)}>
          {showMorePropertyType ? "Show less" : "Show 4 more"}
        </div>
      </div>

      {/* Top Locations */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Top locations</h3>
        {topLocations.map((location) => (
          <div key={location} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() => handleCheckboxToggle(location, selectedLocations, setSelectedLocations)}
              />
              <span>{location}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Room Views */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Room Views</h3>
        {roomViews.map((view) => (
          <div key={view.name} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedRoomViews.includes(view.name)}
                onChange={() => handleCheckboxToggle(view.name, selectedRoomViews, setSelectedRoomViews)}
              />
              <span>{view.name}</span>
            </label>
            <span className="hotel-count">({view.count})</span>
          </div>
        ))}
      </div>

      {/* Chains */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Chains</h3>
        {chains.slice(0, showMoreChains ? chains.length : 5).map((chain) => (
          <div key={chain.name} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedChains.includes(chain.name)}
                onChange={() => handleCheckboxToggle(chain.name, selectedChains, setSelectedChains)}
              />
              <span>{chain.name}</span>
            </label>
            <span className="hotel-count">({chain.count})</span>
          </div>
        ))}
        <div className="hotel-plus-more" onClick={() => setShowMoreChains(!showMoreChains)}>
          {showMoreChains ? "Show less" : "Show 45 more"}
        </div>
      </div>

      {/* MMT Luxe Selections */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">MMT Luxe Selections</h3>
        <div className="hotel-checkbox-row">
          <label className="hotel-checkbox-label">
            <input 
              type="checkbox"
              checked={selectedLuxe}
              onChange={() => {
                setSelectedLuxe(!selectedLuxe);
                if (selectedLuxe) {
                  setAppliedFilters(appliedFilters.filter(f => f !== "MMT Luxe Selections"));
                } else {
                  setAppliedFilters([...appliedFilters, "MMT Luxe Selections"]);
                }
              }}
            />
            <span>MMT Luxe Selections</span>
          </label>
          <span className="hotel-count">(67)</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Amenities</h3>
        <div className="hotel-search-input-wrapper">
          <FaSearch className="hotel-search-icon" />
          <input 
            type="text" 
            placeholder="Search amenities" 
            value={amenitySearch}
            onChange={(e) => setAmenitySearch(e.target.value)}
            className="hotel-search-input"
          />
        </div>
        
        <div className="hotel-amenities-subsection">
          <h4 className="hotel-subsection-title">Guests Love</h4>
          {amenitiesGuestsLove.map((amenity) => (
            <div key={amenity.name} className="hotel-checkbox-row">
              <label className="hotel-checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.name)}
                  onChange={() => handleCheckboxToggle(amenity.name, selectedAmenities, setSelectedAmenities)}
                />
                <span>{amenity.name}</span>
              </label>
              <span className="hotel-count">({amenity.count})</span>
            </div>
          ))}
        </div>

        <div className="hotel-amenities-subsection">
          <h4 className="hotel-subsection-title">General</h4>
          {amenitiesGeneral.map((amenity) => (
            <div key={amenity.name} className="hotel-checkbox-row">
              <label className="hotel-checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.name)}
                  onChange={() => handleCheckboxToggle(amenity.name, selectedAmenities, setSelectedAmenities)}
                />
                <span>{amenity.name}</span>
              </label>
              <span className="hotel-count">({amenity.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Preference */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Booking Preference</h3>
        {bookingPreferences.map((pref) => (
          <div key={pref.name} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedBookingPref.includes(pref.name)}
                onChange={() => handleCheckboxToggle(pref.name, selectedBookingPref, setSelectedBookingPref)}
              />
              <span>{pref.name}</span>
            </label>
            <span className="hotel-count">({pref.count})</span>
          </div>
        ))}
      </div>

      {/* House Rules */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">House Rules</h3>
        {houseRules.map((rule) => (
          <div key={rule.name} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedHouseRules.includes(rule.name)}
                onChange={() => handleCheckboxToggle(rule.name, selectedHouseRules, setSelectedHouseRules)}
              />
              <span>{rule.name}</span>
            </label>
            <span className="hotel-count">({rule.count})</span>
          </div>
        ))}
      </div>

      {/* Deals & Offers */}
      <div className="hotel-filter-card">
        <h3 className="hotel-section-title-with-bar">Deals & Offers</h3>
        {dealsOffers.map((deal) => (
          <div key={deal.name} className="hotel-checkbox-row">
            <label className="hotel-checkbox-label">
              <input 
                type="checkbox"
                checked={selectedDeals.includes(deal.name)}
                onChange={() => handleCheckboxToggle(deal.name, selectedDeals, setSelectedDeals)}
              />
              <span>{deal.name}</span>
            </label>
            <span className="hotel-count">({deal.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelFiltersPanel;
