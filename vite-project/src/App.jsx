import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FlightResults from "./components/FlightResults";
import BusResults from "./components/BusResults";
import HotelResults from "./components/HotelResults";
import HotelBooking from "./pages/HotelBooking";
import MyTrips from "./pages/MyTrips";
import CancelPage from "./pages/CancelPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

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
            
            {/* Hotel Booking page - Protected */}
            <Route path="/hotel-booking" element={
              <ProtectedRoute>
                <HotelBooking />
              </ProtectedRoute>
            } />
            
            {/* My Trips page - Protected */}
            <Route path="/my-trips" element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            } />
            
            {/* Cancel page - Blank page with logo */}
            <Route path="/cancel" element={<CancelPage />} />
            
            {/* Profile page */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;