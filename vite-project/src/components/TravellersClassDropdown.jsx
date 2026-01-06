function TravellersDropdown({
  tempSelection,
  setTempSelection,
  onApply,
}) {
  const updateCount = (key, value) => {
    setTempSelection((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  return (
    <div className="travellers-dropdown">
      <h4>Travellers</h4>

      {/* ADULTS */}
      <div className="traveller-row">
        <span>Adults (12+ yrs)</span>
        <div className="counter">
          <button
            type="button"
            onClick={() =>
              updateCount("adults", tempSelection.adults - 1)
            }
          >
            −
          </button>
          <span>{tempSelection.adults}</span>
          <button
            type="button"
            onClick={() =>
              updateCount("adults", tempSelection.adults + 1)
            }
          >
            +
          </button>
        </div>
      </div>

      {/* CHILDREN */}
      <div className="traveller-row">
        <span>Children (2–12 yrs)</span>
        <div className="counter">
          <button
            type="button"
            onClick={() =>
              updateCount("children", tempSelection.children - 1)
            }
          >
            −
          </button>
          <span>{tempSelection.children}</span>
          <button
            type="button"
            onClick={() =>
              updateCount("children", tempSelection.children + 1)
            }
          >
            +
          </button>
        </div>
      </div>

      {/* INFANTS */}
      <div className="traveller-row">
        <span>Infants (0–2 yrs)</span>
        <div className="counter">
          <button
            type="button"
            onClick={() =>
              updateCount("infants", tempSelection.infants - 1)
            }
          >
            −
          </button>
          <span>{tempSelection.infants}</span>
          <button
            type="button"
            onClick={() =>
              updateCount("infants", tempSelection.infants + 1)
            }
          >
            +
          </button>
        </div>
      </div>

      <hr />

      {/* FARE CLASS */}
      <h4>Fare Class</h4>
      <div className="fare-grid">
        {["Economy", "Premium", "Business", "First"].map((cls) => (
          <label key={cls}>
            <input
              type="radio"
              name="cabin"
              checked={tempSelection.cabinClass === cls}
              onChange={() =>
                setTempSelection((prev) => ({
                  ...prev,
                  cabinClass: cls,
                }))
              }
            />
            {cls}
          </label>
        ))}
      </div>

      {/* APPLY */}
      <button
        className="apply-btn"
        type="button"
        onClick={onApply}
      >
        Apply
      </button>
    </div>
  );
}

export default TravellersDropdown;
