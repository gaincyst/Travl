import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyTripsNavbar from "../components/MyTripsNavbar";
import Footer from "../components/Footer";
import { FaPlane, FaBus, FaHotel, FaChevronRight } from "react-icons/fa";
import "../styles/MyTrips.css";

function MyTrips() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeService, setActiveService] = useState("Flights");
  const [currentImg, setCurrentImg] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search filter states
  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const ITEMS_PER_PAGE = 10;

  // List of background images from mytrips folder
  const images = [
    
   
    "/mytrips/trip6.jpg"
   
  ];

  // Sample booking data with different statuses
  const bookingData = [
    // FLIGHTS SUCCESS - Goes to Confirmed tab
    {
      id: 1,
      date: "02 Jan 2026",
      time: "10:42 AM",
      txnId: "TXA7C095",
      passengerName: "Rajesh Kumar",
      additionalPassengers: 0,
      mobile: "9876543211",
      email: "cs@enginify.in",
      status: "SUCCESS",
      travelDate: "16 Oct 2025",
      travelTime: "06:30 AM",
      origin: "Delhi",
      destination: "Mumbai",
      amount: "₹ 5,106.68",
      service: "Flights"
    },
    {
      id: 2,
      date: "30 Dec 2025",
      time: "09:45 AM",
      txnId: "TX811B87",
      passengerName: "Priya Sharma",
      additionalPassengers: 1,
      mobile: "9464349465",
      email: "enginifytech@gmail.com",
      status: "SUCCESS",
      travelDate: "16 Oct 2025",
      travelTime: "09:15 AM",
      origin: "Bangalore",
      destination: "Chennai",
      amount: "₹ 3,106.68",
      service: "Flights"
    },
    // Dummy Confirmed entries (Flights)
    {
      id: 6,
      date: "10 Feb 2026",
      time: "09:00 AM",
      txnId: "TXP12345",
      passengerName: "Amit Singh",
      additionalPassengers: 2,
      mobile: "9000000001",
      email: "dummy1@domain.com",
      status: "SUCCESS",
      travelDate: "10 Feb 2026",
      travelTime: "11:00 AM",
      origin: "Mumbai",
      destination: "Goa",
      amount: "₹ 8,250.00",
      service: "Flights"
    },
    {
      id: 7,
      date: "11 Feb 2026",
      time: "08:30 AM",
      txnId: "TXP23456",
      passengerName: "Sneha Patel",
      additionalPassengers: 0,
      mobile: "9000000002",
      email: "dummy2@domain.com",
      status: "SUCCESS",
      travelDate: "11 Feb 2026",
      travelTime: "02:45 PM",
      origin: "Ahmedabad",
      destination: "Delhi",
      amount: "₹ 6,320.00",
      service: "Flights"
    },
    {
      id: 8,
      date: "12 Feb 2026",
      time: "07:45 AM",
      txnId: "TXP34567",
      passengerName: "Vikram Reddy",
      additionalPassengers: 3,
      mobile: "9000000003",
      email: "dummy3@domain.com",
      status: "SUCCESS",
      travelDate: "12 Feb 2026",
      travelTime: "05:30 PM",
      origin: "Hyderabad",
      destination: "Kolkata",
      amount: "₹ 12,410.00",
      service: "Flights"
    },
    {
      id: 9,
      date: "13 Feb 2026",
      time: "10:15 AM",
      txnId: "TXP45678",
      passengerName: "Meera Joshi",
      additionalPassengers: 1,
      mobile: "9000000004",
      email: "dummy4@domain.com",
      status: "SUCCESS",
      travelDate: "13 Feb 2026",
      travelTime: "07:20 AM",
      origin: "Pune",
      destination: "Jaipur",
      amount: "₹ 7,500.00",
      service: "Flights"
    },
    {
      id: 10,
      date: "14 Feb 2026",
      time: "11:30 AM",
      txnId: "TXP56789",
      passengerName: "Arjun Mehta",
      additionalPassengers: 0,
      mobile: "9000000005",
      email: "dummy5@domain.com",
      status: "SUCCESS",
      travelDate: "14 Feb 2026",
      travelTime: "10:00 AM",
      origin: "Chennai",
      destination: "Bangalore",
      amount: "₹ 4,600.00",
      service: "Flights"
    },
    // INITIATE - Goes to Upcoming tab (Flights)
    {
      id: 3,
      date: "02 Jan 2026",
      time: "10:38 AM",
      txnId: "TX205549",
      passengerName: "Karan Malhotra",
      additionalPassengers: 2,
      mobile: "9876543210",
      email: "cs@enginify.in",
      status: "INITIATE",
      travelDate: "25 Mar 2026",
      travelTime: "08:45 AM",
      origin: "Delhi",
      destination: "Dubai",
      amount: "₹ 28,398.00",
      service: "Flights"
    },
    // CANCELLED - Goes to Cancelled tab (Flights)
    {
      id: 4,
      date: "05 Jan 2026",
      time: "02:22 PM",
      txnId: "TXC45D89",
      passengerName: "Sanjay Gupta",
      additionalPassengers: 0,
      mobile: "9123456789",
      email: "customer@example.com",
      status: "CANCELLED",
      travelDate: "20 Nov 2025",
      travelTime: "03:30 PM",
      origin: "Mumbai",
      destination: "Goa",
      amount: "₹ 5,420.00",
      service: "Flights"
    },
    // FAILED - Goes to Failed tab (Flights)
    {
      id: 5,
      date: "08 Jan 2026",
      time: "11:15 AM",
      txnId: "TXF88E76",
      passengerName: "Deepa Nair",
      additionalPassengers: 1,
      mobile: "9988776655",
      email: "user@domain.com",
      status: "FAILED",
      travelDate: "25 Dec 2025",
      travelTime: "06:00 AM",
      origin: "Kochi",
      destination: "Bangalore",
      amount: "₹ 12,850.00",
      service: "Flights"
    },
    // Additional 5 dummy flight entries to make 15 total
    {
      id: 11,
      date: "15 Feb 2026",
      time: "12:45 PM",
      txnId: "TXP67890",
      passengerName: "Ravi Shankar",
      additionalPassengers: 0,
      mobile: "9000000006",
      email: "dummy6@domain.com",
      status: "SUCCESS",
      travelDate: "15 Feb 2026",
      travelTime: "04:15 PM",
      origin: "Kolkata",
      destination: "Mumbai",
      amount: "₹ 9,700.00",
      service: "Flights"
    },
    {
      id: 12,
      date: "16 Feb 2026",
      time: "02:00 PM",
      txnId: "TXP78901",
      passengerName: "Anjali Desai",
      additionalPassengers: 2,
      mobile: "9000000007",
      email: "dummy7@domain.com",
      status: "SUCCESS",
      travelDate: "16 Feb 2026",
      travelTime: "09:30 AM",
      origin: "Jaipur",
      destination: "Delhi",
      amount: "₹ 5,800.00",
      service: "Flights"
    },
    {
      id: 13,
      date: "17 Feb 2026",
      time: "03:15 PM",
      txnId: "TXP89012",
      passengerName: "Rohit Verma",
      additionalPassengers: 0,
      mobile: "9000000008",
      email: "dummy8@domain.com",
      status: "SUCCESS",
      travelDate: "17 Feb 2026",
      travelTime: "12:00 PM",
      origin: "Surat",
      destination: "Bangalore",
      amount: "₹ 8,900.00",
      service: "Flights"
    },
    {
      id: 14,
      date: "18 Feb 2026",
      time: "04:30 PM",
      txnId: "TXP90123",
      passengerName: "Pooja Iyer",
      additionalPassengers: 1,
      mobile: "9000000009",
      email: "dummy9@domain.com",
      status: "SUCCESS",
      travelDate: "18 Feb 2026",
      travelTime: "06:45 AM",
      origin: "Chennai",
      destination: "Hyderabad",
      amount: "₹ 6,000.00",
      service: "Flights"
    },
    {
      id: 15,
      date: "19 Feb 2026",
      time: "05:45 PM",
      txnId: "TXP01234",
      passengerName: "Suresh Kapoor",
      additionalPassengers: 3,
      mobile: "9000000010",
      email: "dummy10@domain.com",
      status: "SUCCESS",
      travelDate: "19 Feb 2026",
      travelTime: "08:00 PM",
      origin: "Ahmedabad",
      destination: "Mumbai",
      amount: "₹ 11,100.00",
      service: "Flights"
    },
    // BUS SUCCESS - Goes to Confirmed tab
    {
      id: 101,
      date: "02 Jan 2026",
      time: "10:42 AM",
      txnId: "BXA7C095",
      passengerName: "Anita Desai",
      additionalPassengers: 1,
      mobile: "9876543211",
      email: "cs@enginify.in",
      status: "SUCCESS",
      travelDate: "16 Oct 2025",
      travelTime: "06:30 AM",
      origin: "Delhi",
      destination: "Jaipur",
      amount: "₹ 1,500.68",
      service: "Buses"
    },
    {
      id: 102,
      date: "30 Dec 2025",
      time: "09:45 AM",
      txnId: "BX811B87",
      passengerName: "Ramesh Gupta",
      additionalPassengers: 0,
      mobile: "9464349465",
      email: "enginifytech@gmail.com",
      status: "SUCCESS",
      travelDate: "16 Oct 2025",
      travelTime: "09:15 PM",
      origin: "Mumbai",
      destination: "Pune",
      amount: "₹ 850.00",
      service: "Buses"
    },
    // Dummy Confirmed entries (Buses)
    {
      id: 106,
      date: "10 Feb 2026",
      time: "09:00 AM",
      txnId: "BXP12345",
      passengerName: "Kavita Sharma",
      additionalPassengers: 2,
      mobile: "9000000001",
      email: "dummy1@domain.com",
      status: "SUCCESS",
      travelDate: "10 Feb 2026",
      travelTime: "11:00 PM",
      origin: "Bangalore",
      destination: "Hyderabad",
      amount: "₹ 2,250.00",
      service: "Buses"
    },
    {
      id: 107,
      date: "11 Feb 2026",
      time: "08:30 AM",
      txnId: "BXP23456",
      passengerName: "Sunil Yadav",
      additionalPassengers: 0,
      mobile: "9000000002",
      email: "dummy2@domain.com",
      status: "SUCCESS",
      travelDate: "11 Feb 2026",
      travelTime: "02:45 AM",
      origin: "Ahmedabad",
      destination: "Udaipur",
      amount: "₹ 1,320.00",
      service: "Buses"
    },
    {
      id: 108,
      date: "12 Feb 2026",
      time: "07:45 AM",
      txnId: "BXP34567",
      passengerName: "Neha Kapoor",
      additionalPassengers: 1,
      mobile: "9000000003",
      email: "dummy3@domain.com",
      status: "SUCCESS",
      travelDate: "12 Feb 2026",
      travelTime: "05:30 PM",
      origin: "Chennai",
      destination: "Coimbatore",
      amount: "₹ 1,410.00",
      service: "Buses"
    },
    {
      id: 109,
      date: "13 Feb 2026",
      time: "10:15 AM",
      txnId: "BXP45678",
      passengerName: "Manoj Singh",
      additionalPassengers: 3,
      mobile: "9000000004",
      email: "dummy4@domain.com",
      status: "SUCCESS",
      travelDate: "13 Feb 2026",
      travelTime: "07:20 AM",
      origin: "Pune",
      destination: "Goa",
      amount: "₹ 3,500.00",
      service: "Buses"
    },
    {
      id: 110,
      date: "14 Feb 2026",
      time: "11:30 AM",
      txnId: "BXP56789",
      passengerName: "Priyanka Jain",
      additionalPassengers: 0,
      mobile: "9000000005",
      email: "dummy5@domain.com",
      status: "SUCCESS",
      travelDate: "14 Feb 2026",
      travelTime: "10:00 PM",
      origin: "Jaipur",
      destination: "Delhi",
      amount: "₹ 900.00",
      service: "Buses"
    },
    // INITIATE - Goes to Upcoming tab (Buses)
    {
      id: 103,
      date: "02 Jan 2026",
      time: "10:38 AM",
      txnId: "BX205549",
      passengerName: "Vikas Mehta",
      additionalPassengers: 2,
      mobile: "9876543210",
      email: "cs@enginify.in",
      status: "INITIATE",
      travelDate: "25 Mar 2026",
      travelTime: "08:45 PM",
      origin: "Mumbai",
      destination: "Shirdi",
      amount: "₹ 2,398.00",
      service: "Buses"
    },
    // CANCELLED - Goes to Cancelled tab (Buses)
    {
      id: 104,
      date: "05 Jan 2026",
      time: "02:22 PM",
      txnId: "BXC45D89",
      passengerName: "Rakesh Verma",
      additionalPassengers: 1,
      mobile: "9123456789",
      email: "customer@example.com",
      status: "CANCELLED",
      travelDate: "20 Nov 2025",
      travelTime: "03:30 AM",
      origin: "Delhi",
      destination: "Chandigarh",
      amount: "₹ 1,420.00",
      service: "Buses"
    },
    // FAILED - Goes to Failed tab (Buses)
    {
      id: 105,
      date: "08 Jan 2026",
      time: "11:15 AM",
      txnId: "BXF88E76",
      passengerName: "Seema Nair",
      additionalPassengers: 0,
      mobile: "9988776655",
      email: "user@domain.com",
      status: "FAILED",
      travelDate: "25 Dec 2025",
      travelTime: "06:00 PM",
      origin: "Kochi",
      destination: "Trivandrum",
      amount: "₹ 850.00",
      service: "Buses"
    },
    // HOTELS DUMMY DATA
    {
      id: 201,
      date: "02 Jan 2026",
      time: "10:42 AM",
      txnId: "HX205549",
      guestName: "Rajiv Malhotra",
      additionalGuests: 1,
      mobile: "9876543211",
      email: "rajiv@example.com",
      hotelName: "Hotel Taj Palace",
      city: "Jaipur",
      checkIn: "16 Oct 2025",
      checkOut: "18 Oct 2025",
      rooms: 2,
      roomType: "Deluxe",
      days: 2,
      status: "SUCCESS",
      amount: "₹ 28,398.00",
      service: "Hotels"
    },
    {
      id: 202,
      date: "10 Feb 2026",
      time: "09:30 AM",
      txnId: "HXH12345",
      guestName: "Ananya Sharma",
      additionalGuests: 2,
      mobile: "9123456789",
      email: "ananya@example.com",
      hotelName: "Hotel Grand Hyatt",
      city: "Mumbai",
      checkIn: "10 Feb 2026",
      checkOut: "12 Feb 2026",
      rooms: 1,
      roomType: "Suite",
      days: 2,
      status: "SUCCESS",
      amount: "₹ 12,000.00",
      service: "Hotels"
    },
    {
      id: 203,
      date: "11 Feb 2026",
      time: "02:15 PM",
      txnId: "HXH23456",
      guestName: "Vikram Singh",
      additionalGuests: 0,
      mobile: "9988776655",
      email: "vikram@example.com",
      hotelName: "Hotel Oberoi",
      city: "Delhi",
      checkIn: "11 Feb 2026",
      checkOut: "13 Feb 2026",
      rooms: 1,
      roomType: "Executive",
      days: 2,
      status: "INITIATE",
      amount: "₹ 15,000.00",
      service: "Hotels"
    },
    {
      id: 204,
      date: "12 Feb 2026",
      time: "11:20 AM",
      txnId: "HXH34567",
      guestName: "Priya Reddy",
      additionalGuests: 3,
      mobile: "9765432100",
      email: "priya@example.com",
      hotelName: "Hotel Leela Palace",
      city: "Bangalore",
      checkIn: "12 Feb 2026",
      checkOut: "14 Feb 2026",
      rooms: 2,
      roomType: "Prime",
      days: 2,
      status: "CANCELLED",
      amount: "₹ 9,000.00",
      service: "Hotels"
    },
    {
      id: 205,
      date: "13 Feb 2026",
      time: "03:45 PM",
      txnId: "HXH45678",
      guestName: "Arjun Kapoor",
      additionalGuests: 1,
      mobile: "9876501234",
      email: "arjun@example.com",
      hotelName: "Hotel ITC Rajputana",
      city: "Jaipur",
      checkIn: "13 Feb 2026",
      checkOut: "15 Feb 2026",
      rooms: 1,
      roomType: "Standard",
      days: 2,
      status: "FAILED",
      amount: "₹ 8,000.00",
      service: "Hotels"
    },
     {
      id: 206,
      date: "19 Aug 2026",
      time: "10:00 AM",
      txnId: "HXH49678",
      guestName: "Kavita Verma",
      additionalGuests: 0,
      mobile: "9123405678",
      email: "kavita@example.com",
      hotelName: "Hotel ITC Rajputana",
      city: "Kanpur",
      checkIn: "19 Sept 2026",
      checkOut: "15 Oct 2026",
      rooms: 3,
      roomType: "Deluxe",
      days: 26,
      status: "FAILED",
      amount: "₹ 8,780.00",
      service: "Hotels"
    },
  ];

  // Filter data based on active filter and activeService
  const getFilteredData = () => {
    // Show data for selected service
    let filtered = bookingData.filter(
      booking => booking.service === activeService &&
        (
          activeFilter === "All" ||
          (activeFilter === "Confirmed" && booking.status === "SUCCESS") ||
          (activeFilter === "Upcoming" && booking.status === "INITIATE") ||
          (activeFilter === "Cancelled" && booking.status === "CANCELLED") ||
          (activeFilter === "Failed" && booking.status === "FAILED")
        )
    );

    // Apply search filters
    if (searchFromDate) {
      filtered = filtered.filter(booking => {
        // Parse the date directly (format: "02 Jan 2026")
        const bookingDate = new Date(booking.date);
        const fromDate = new Date(searchFromDate);
        fromDate.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate >= fromDate;
      });
    }

    if (searchToDate) {
      filtered = filtered.filter(booking => {
        // Parse the date directly (format: "02 Jan 2026")
        const bookingDate = new Date(booking.date);
        const toDate = new Date(searchToDate);
        toDate.setHours(23, 59, 59, 999);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate <= toDate;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.txnId?.toLowerCase().includes(query) ||
        booking.mobile?.includes(query) ||
        booking.email?.toLowerCase().includes(query) ||
        booking.ticketNo?.toLowerCase().includes(query) ||
        booking.hotelName?.toLowerCase().includes(query) ||
        booking.passengerName?.toLowerCase().includes(query) ||
        booking.guestName?.toLowerCase().includes(query)
      );
    }

    // Sort by status: Upcoming -> Confirmed -> Cancelled -> Failed
    const statusOrder = {
      'INITIATE': 1,
      'SUCCESS': 2,
      'CANCELLED': 3,
      'FAILED': 4
    };

    filtered.sort((a, b) => {
      return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
    });

    return filtered;
  };

  const filteredData = getFilteredData();
  
  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, activeService, searchFromDate, searchToDate, searchQuery]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);
  
  const handlePrevPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleNextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <MyTripsNavbar />
      
      <div className="mytrips-page">
        {/* Background Slideshow */}
        <div className="mytrips-background">
          {images.map((img, index) => (
            <div
              key={index}
              className={`mytrips-bg-image ${index === currentImg ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="mytrips-container">
          {/* Breadcrumb + Filter Row */}
          <div className="breadcrumb-filter-row">
            <div className="breadcrumb">
              <span className="breadcrumb-link" onClick={() => navigate('/')}>Home</span>
              <FaChevronRight className="breadcrumb-arrow" />
              <span className="breadcrumb-current">My Trips</span>
            </div>
            
            <div className="filter-pills">
              {["All", "Upcoming", "Completed", "Cancelled", "Failed"].map((filter) => (
                <button
                  key={filter}
                  className={`filter-pill ${activeFilter === filter ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Combined Service Strip and Search Filter Section */}
          <div className="combined-section">
            {/* Service Strip */}
            <div className="service-strip">
              <div
                className={`service-option ${activeService === "Flights" ? "active" : ""}`}
                onClick={() => setActiveService("Flights")}
              >
                <FaPlane className="service-icon" />
                <span>Flights</span>
              </div>
              <div
                className={`service-option ${activeService === "Buses" ? "active" : ""}`}
                onClick={() => setActiveService("Buses")}
              >
                <FaBus className="service-icon" />
                <span>Buses</span>
              </div>
              <div
                className={`service-option ${activeService === "Hotels" ? "active" : ""}`}
                onClick={() => setActiveService("Hotels")}
              >
                <FaHotel className="service-icon" />
                <span>Hotels</span>
              </div>
            </div>

            {/* Search Filter Section */}
            <div className="search-filter-section">
              <div className="search-filter-group">
                <label className="search-filter-label">From Date</label>
                <input 
                  type="date" 
                  className="search-filter-input"
                  placeholder="YYYY-MM-DD"
                  value={searchFromDate}
                  onChange={(e) => setSearchFromDate(e.target.value)}
                />
              </div>
              <div className="search-filter-group">
                <label className="search-filter-label">To Date</label>
                <input 
                  type="date" 
                  className="search-filter-input"
                  placeholder="YYYY-MM-DD"
                  value={searchToDate}
                  onChange={(e) => setSearchToDate(e.target.value)}
                />
              </div>
              <div className="search-filter-group search-filter-wide">
                <label className="search-filter-label">Search</label>
                <input 
                  type="text" 
                  className="search-filter-input"
                  placeholder="Booking ID, Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Booking Cards Container - Table Format */}
          <div className="booking-cards-container">
            <table className="bookings-table">
              <thead>
                {activeService === "Hotels" ? (
                  <tr>
                    <th>Date</th>
                    <th>Booking Ref.</th>
                    <th>Guest Details</th>
                    <th>Hotel Details</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                ) : (activeService === "Flights" || activeService === "Buses") ? (
                  <tr>
                    <th>Date</th>
                    <th>Booking Ref.</th>
                    <th>Passenger Details</th>
                    <th>Travelling Details</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th>DATE</th>
                    <th>TXN ID</th>
                    <th>TRAVEL DETAILS</th>
                    <th>OTHER DETAILS</th>
                    <th>AMOUNT</th>
                    <th>ACTION</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-bookings">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((booking) => (
                    <tr key={booking.id}>
                      {activeService === "Hotels" ? (
                        <>
                          <td className="date-column">
                            <div className="booking-date">{booking.date}</div>
                            <div className="booking-time">{booking.time}</div>
                          </td>
                          <td className="booking-ref-column">{booking.txnId}</td>
                          <td className="guest-details-column">
                            <div className="guest-name">
                              {booking.guestName}
                              {booking.additionalGuests > 0 && (
                                <span className="additional-passengers">
                                  {" "}+{booking.additionalGuests}
                                </span>
                              )}
                            </div>
                            <div className="guest-mobile">Mob No. - {booking.mobile}</div>
                            <div className="guest-email">E-Mail- {booking.email}</div>
                          </td>
                          <td className="hotel-details-column">
                            <div className="hotel-name">{booking.hotelName}, {booking.city}</div>
                            <div>Rooms - {booking.rooms}, {booking.roomType}</div>
                            <div>Check-In - {booking.checkIn}</div>
                            <div>Check-Out - {booking.checkOut}</div>
                            <div>{booking.days === 1 ? 'Day' : 'Days'} - {booking.days}</div>
                          </td>
                          <td className="amount-column">
                            <div className="amount-value">{booking.amount}</div>
                          </td>
                          <td className="status-column">
                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                              <span className="status-dot"></span>
                              {booking.status === "INITIATE" ? "Upcoming" : booking.status === "SUCCESS" ? "Completed" : booking.status}
                            </span>
                          </td>
                          <td className="action-column">
                            {(booking.status === "SUCCESS" || booking.status === "INITIATE") && (
                              <div className="action-buttons-group">
                                <button className="action-btn-styled action-btn-print-styled">Print</button>
                                <button 
                                  className="action-btn-styled action-btn-cancel-styled"
                                  onClick={() => navigate('/cancel', { state: { booking, service: activeService } })}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            {(booking.status === "CANCELLED" || booking.status === "FAILED") && (
                              <button className="action-btn-styled action-btn-refund-styled">Refund Status</button>
                            )}
                          </td>
                        </>
                      ) : (activeService === "Flights" || activeService === "Buses") ? (
                        <>
                          <td className="date-column">
                            <div className="booking-date">{booking.date}</div>
                            <div className="booking-time">{booking.time}</div>
                          </td>
                          <td className="booking-ref-column">{booking.txnId}</td>
                          <td className="passenger-details-column">
                            <div className="passenger-name">
                              {booking.passengerName}
                              {booking.additionalPassengers > 0 && (
                                <span className="additional-passengers">
                                  {" "}+{booking.additionalPassengers}
                                </span>
                              )}
                            </div>
                            <div className="passenger-mobile">Mob No. - {booking.mobile}</div>
                            <div className="passenger-email">E-Mail- {booking.email}</div>
                          </td>
                          <td className="travelling-details-column">
                            <div className="travel-date">{booking.travelDate}</div>
                            <div className="travel-time">{booking.travelTime}</div>
                            <div>Origin- {booking.origin}</div>
                            <div>Destination- {booking.destination}</div>
                          </td>
                          <td className="amount-column">
                            <div className="amount-value">{booking.amount}</div>
                          </td>
                          <td className="status-column">
                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                              <span className="status-dot"></span>
                              {booking.status === "INITIATE" ? "Upcoming" : booking.status === "SUCCESS" ? "Completed" : booking.status}
                            </span>
                          </td>
                          <td className="action-column">
                            {(booking.status === "SUCCESS" || booking.status === "INITIATE") && (
                              <div className="action-buttons-group">
                                <button className="action-btn-styled action-btn-print-styled">Print</button>
                                <button 
                                  className="action-btn-styled action-btn-cancel-styled"
                                  onClick={() => navigate('/cancel', { state: { booking, service: activeService } })}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            {(booking.status === "CANCELLED" || booking.status === "FAILED") && (
                              <button className="action-btn-styled action-btn-refund-styled">Refund Status</button>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="date-column">
                            <div>{booking.date}</div>
                            {booking.date2 && <div>{booking.date2}</div>}
                          </td>
                          <td className="txn-column">{booking.txnId}</td>
                          <td className="travel-details-column">
                            {booking.mobile && <div>Mobile - {booking.mobile}</div>}
                            {booking.email && <div>Email - {booking.email}</div>}
                          </td>
                          <td className="other-details-column">
                            {booking.travelDate && <div>Travel Date : {booking.travelDate}</div>}
                            {booking.ticketNo && <div>Ticket No - {booking.ticketNo}</div>}
                          </td>
                          <td className="amount-column">
                            <div>Amount: {booking.amount}</div>
                            <div>Commission: {booking.commission}</div>
                          </td>
                          <td className="action-column">
                            {booking.status === "SUCCESS" && (
                              <button className="action-btn-print">Print Ticket</button>
                            )}
                            {booking.status === "INITIATE" && (
                              <>
                                <button 
                                  className="action-btn-cancel"
                                  onClick={() => navigate('/cancel', { state: { booking, service: activeService } })}
                                >
                                  Cancel Ticket
                                </button>
                                <span className="action-separator">|</span>
                                <button className="action-btn-print">Print Ticket</button>
                              </>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {filteredData.length > 0 && (
              <div className="pagination-section">
                <div className="pagination-info">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn prev-btn" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    type="button"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="pagination-btn active-page"
                  >
                    {currentPage}
                  </button>
                  <button 
                    className="pagination-btn next-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    type="button"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MyTrips;
