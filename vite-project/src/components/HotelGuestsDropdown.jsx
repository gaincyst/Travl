import { useState } from "react";

function HotelGuestsDropdown({ rooms, adults, children, onUpdate, onClose }) {
  // Local state to handle changes before "Apply" is clicked
  const [temp, setTemp] = useState({
    rooms: rooms || 1,
    adults: adults || 2,
    children: children || 0
  });

  const update = (key, val) => {
    setTemp((prev) => ({
      ...prev,
      [key]: Math.max(key === 'rooms' || key === 'adults' ? 1 : 0, prev[key] + val)
    }));
  };

  const handleApply = () => {
    if (onUpdate) {
      onUpdate(temp);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="travellers-dropdown">
      {/* ROOMS */}
      <HotelRow 
        label="Rooms" 
        value={temp.rooms} 
        onInc={() => update('rooms', 1)} 
        onDec={() => update('rooms', -1)} 
      />

      {/* ADULTS */}
      <HotelRow 
        label="Adults" 
        sub="(+17 yrs)" 
        value={temp.adults} 
        onInc={() => update('adults', 1)} 
        onDec={() => update('adults', -1)} 
      />

      {/* CHILDREN */}
      <HotelRow 
        label="Children" 
        sub="(0-17 yrs)" 
        value={temp.children} 
        onInc={() => update('children', 1)} 
        onDec={() => update('children', -1)} 
      />
      
      <div className="apply-wrapper" style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <button className="apply-btn" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
}

/* REUSABLE ROW FOR HOTEL DROPDOWN */
function HotelRow({ label, sub, value, onInc, onDec }) {
  return (
    <div className="traveller-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <div>
        <strong style={{ fontSize: '14px', display: 'block' }}>{label}</strong>
        {sub && <span style={{ fontSize: '11px', color: '#666' }}>{sub}</span>}
      </div>
      <div className="counter" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={onDec} 
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
        >
          -
        </button>
        <span style={{ fontWeight: '600', minWidth: '15px', textAlign: 'center' }}>{value}</span>
        <button 
          onClick={onInc} 
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default HotelGuestsDropdown;