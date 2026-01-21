import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FlightResults from "./components/FlightResults";

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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;