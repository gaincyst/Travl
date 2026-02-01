import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FlightResults from "./components/FlightResults";
import BusResults from "./components/BusResults";
import HotelResults from "./components/HotelResults";
import HotelBooking from "./pages/HotelBooking";

function App() {
  return (
    <Router>
      <div className="main-layout">
        {/* Background Animated Blobs - Stays consistent across all pages */}
        <div className="bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        {/* Main Content - Changes based on the URL path */}
        <div className="content-wrapper">
          <Routes>
            {/* Landing page with the full search box */}
            <Route path="/" element={<HomePage />} />
            
            {/* Results page with minimal navbar and pre-filled data */}
            <Route path="/flight-results" element={<FlightResults />} />
            
            {/* Bus Results page */}
            <Route path="/bus-results" element={<BusResults />} />
            
            {/* Hotel Results page */}
            <Route path="/hotel-results" element={<HotelResults />} />
            
            {/* Hotel Booking page */}
            <Route path="/hotel-booking" element={<HotelBooking />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;