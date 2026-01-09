import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="main-layout">
      {/* Background Animated Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        <HomePage />
      </div>
    </div>
  );
}

export default App;