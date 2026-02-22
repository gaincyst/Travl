import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyTripsNavbar from "../components/MyTripsNavbar";
import Footer from "../components/Footer";
import { FaPlane, FaBus, FaHotel, FaChevronRight } from "react-icons/fa";
import "../styles/MyTrips.css";

function MyTrips() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Upcoming");
  const [activeService, setActiveService] = useState("Flights");
  const [currentImg, setCurrentImg] = useState(0);

  // List of background images from mytrips folder
  const images = [
    "/mytrips/trip1.jpeg",
    "/mytrips/trip2.jpg",
    "/mytrips/trip3.jpeg",
    "/mytrips/trip4.jpeg",
    "/mytrips/trip5.jpeg",
    "/mytrips/trip6.jpg",
    "/mytrips/trip7.jpeg"
  ];

  // Sample booking data with different statuses
  const bookingData = [
    // FLIGHTS SUCCESS - Goes to Past tab
    {
      id: 1,
      date: "Jan 02, 2026 at 10:42",
      date2: "Jan 02, 2026 at 16:12",
      txnId: "TXA7C0995A8",
      mobile: "9876543211",
      email: "cs@enginify.in",
      status: "SUCCESS",
      travelDate: "16-10-2025",
      ticketNo: "FBB7CCQA",
      amount: "₹ 106.68",
      commission: "₹ 12.12",
      service: "Flights"
    },
    {
      id: 2,
      date: "Dec 30, 2025 at 09:45",
      date2: "Dec 30, 2025 at 15:15",
      txnId: "TX811B8781A",
      mobile: "9464349465",
      email: "enginifytech@gmail.com",
      status: "SUCCESS",
      travelDate: "16-10-2025",
      ticketNo: "FBB7CCQA",
      amount: "₹ 106.68",
      commission: "₹ 12.12",
      service: "Flights"
    },
    // Dummy Past entries (Flights)
    {
      id: 6,
      date: "Feb 10, 2026 at 09:00",
      date2: "Feb 10, 2026 at 17:00",
      txnId: "TXP1234567A",
      mobile: "9000000001",
      email: "dummy1@domain.com",
      status: "SUCCESS",
      travelDate: "10-02-2026",
      ticketNo: "PST1DUMMY",
      amount: "₹ 250.00",
      commission: "₹ 15.00",
      service: "Flights"
    },
    {
      id: 7,
      date: "Feb 11, 2026 at 08:30",
      date2: "Feb 11, 2026 at 16:30",
      txnId: "TXP2345678B",
      mobile: "9000000002",
      email: "dummy2@domain.com",
      status: "SUCCESS",
      travelDate: "11-02-2026",
      ticketNo: "PST2DUMMY",
      amount: "₹ 320.00",
      commission: "₹ 18.00",
      service: "Flights"
    },
    {
      id: 8,
      date: "Feb 12, 2026 at 07:45",
      date2: "Feb 12, 2026 at 15:45",
      txnId: "TXP3456789C",
      mobile: "9000000003",
      email: "dummy3@domain.com",
      status: "SUCCESS",
      travelDate: "12-02-2026",
      ticketNo: "PST3DUMMY",
      amount: "₹ 410.00",
      commission: "₹ 20.00",
      service: "Flights"
    },
    {
      id: 9,
      date: "Feb 13, 2026 at 10:15",
      date2: "Feb 13, 2026 at 18:15",
      txnId: "TXP4567890D",
      mobile: "9000000004",
      email: "dummy4@domain.com",
      status: "SUCCESS",
      travelDate: "13-02-2026",
      ticketNo: "PST4DUMMY",
      amount: "₹ 500.00",
      commission: "₹ 22.00",
      service: "Flights"
    },
    {
      id: 10,
      date: "Feb 14, 2026 at 11:30",
      date2: "Feb 14, 2026 at 19:30",
      txnId: "TXP5678901E",
      mobile: "9000000005",
      email: "dummy5@domain.com",
      status: "SUCCESS",
      travelDate: "14-02-2026",
      ticketNo: "PST5DUMMY",
      amount: "₹ 600.00",
      commission: "₹ 25.00",
      service: "Flights"
    },
    // INITIATE - Goes to Upcoming tab (Flights)
    {
      id: 3,
      date: "Jan 02, 2026 at 10:38",
      date2: "Jan 02, 2026 at 16:08",
      txnId: "TX20554A9B6",
      mobile: "9876543210",
      email: "cs@enginify.in",
      status: "INITIATE",
      travelDate: "16-10-2025",
      ticketNo: "FBB7CCQA",
      amount: "₹ 28398.00",
      commission: "₹ 24.24",
      service: "Flights"
    },
    // CANCELLED - Goes to Cancelled tab (Flights)
    {
      id: 4,
      date: "Jan 05, 2026 at 14:22",
      date2: "Jan 05, 2026 at 14:25",
      txnId: "TXC45D8921C",
      mobile: "9123456789",
      email: "customer@example.com",
      status: "CANCELLED",
      travelDate: "20-11-2025",
      ticketNo: "FCC8DDQB",
      amount: "₹ 5420.00",
      commission: "₹ 18.50",
      service: "Flights"
    },
    // FAILED - Goes to Failed tab (Flights)
    {
      id: 5,
      date: "Jan 08, 2026 at 11:15",
      date2: "Jan 08, 2026 at 11:18",
      txnId: "TXF88E7654F",
      mobile: "9988776655",
      email: "user@domain.com",
      status: "FAILED",
      travelDate: "25-12-2025",
      ticketNo: "FDD9EERC",
      amount: "₹ 12850.00",
      commission: "₹ 32.10",
      service: "Flights"
    },
    // BUS SUCCESS - Goes to Past tab (Dummy, same details)
    {
      id: 101,
      date: "Jan 02, 2026 at 10:42",
      date2: "Jan 02, 2026 at 16:12",
      txnId: "TXA7C0995A8",
      mobile: "9876543211",
      email: "cs@enginify.in",
      status: "SUCCESS",
      travelDate: "16-10-2025",
      ticketNo: "FBB7CCQA",
      amount: "₹ 106.68",
      commission: "₹ 12.12",
      service: "Buses"
    },
    {
      id: 102,
      date: "Dec 30, 2025 at 09:45",
      date2: "Dec 30, 2025 at 15:15",
      txnId: "TX811B8781A",
      mobile: "9464349465",
      email: "enginifytech@gmail.com",
      status: "SUCCESS",
      travelDate: "16-10-2025",
      ticketNo: "FBB7CCQA",
      amount: "₹ 106.68",
      commission: "₹ 12.12",
      service: "Buses"
    },
    // Dummy Past entries (Buses)
    {
      id: 106,
      date: "Feb 10, 2026 at 09:00",
      date2: "Feb 10, 2026 at 17:00",
      txnId: "TXP1234567A",
      mobile: "9000000001",
      email: "dummy1@domain.com",
      status: "SUCCESS",
      travelDate: "10-02-2026",
      ticketNo: "PST1DUMMY",
      amount: "₹ 250.00",
      commission: "₹ 15.00",
      service: "Buses"
    },
    {
      id: 107,
      date: "Feb 11, 2026 at 08:30",
      date2: "Feb 11, 2026 at 16:30",
      txnId: "TXP2345678B",
      mobile: "9000000002",
      email: "dummy2@domain.com",
      status: "SUCCESS",
      travelDate: "11-02-2026",
      ticketNo: "PST2DUMMY",
      amount: "₹ 320.00",
      commission: "₹ 18.00",
      service: "Buses"
    },
    {
      id: 108,
      date: "Feb 12, 2026 at 07:45",
      date2: "Feb 12, 2026 at 15:45",
      txnId: "TXP3456789C",
      mobile: "9000000003",
      email: "dummy3@domain.com",
      status: "SUCCESS",
      travelDate: "12-02-2026",
      ticketNo: "PST3DUMMY",
      amount: "₹ 410.00",
      commission: "₹ 20.00",
      service: "Buses"
    },
    {
      id: 109,
      date: "Feb 13, 2026 at 10:15",
      date2: "Feb 13, 2026 at 18:15",
      txnId: "TXP4567890D",
      mobile: "9000000004",
      email: "dummy4@domain.com",
      status: "SUCCESS",
      travelDate: "13-02-2026",
      ticketNo: "PST4DUMMY",
      amount: "₹ 500.00",
      commission: "₹ 22.00",
      service: "Buses"
    },
    {
      id: 110,
      date: "Feb 14, 2026 at 11:30",
      date2: "Feb 14, 2026 at 19:30",
      txnId: "TXP5678901E",
      mobile: "9000000005",
      email: "dummy5@domain.com",
      status: "SUCCESS",
      travelDate: "14-02-2026",
      ticketNo: "PST5DUMMY",
      amount: "₹ 600.00",
      commission: "₹ 25.00",
      service: "Buses"
    },
    // INITIATE - Goes to Upcoming tab (Buses)
    {
      id: 103,
      date: "Jan 02, 2026 at 10:38",
      date2: "Jan 02, 2026 at 16:08",
      txnId: "TX20554A9B6",
      mobile: "9876543210",
      email: "cs@enginify.in",
      status: "INITIATE",
      travelDate: "16-10-2025",
      ticketNo: "FBB7CCQA",
      amount: "₹ 28398.00",
      commission: "₹ 24.24",
      service: "Buses"
    },
    // CANCELLED - Goes to Cancelled tab (Buses)
    {
      id: 104,
      date: "Jan 05, 2026 at 14:22",
      date2: "Jan 05, 2026 at 14:25",
      txnId: "TXC45D8921C",
      mobile: "9123456789",
      email: "customer@example.com",
      status: "CANCELLED",
      travelDate: "20-11-2025",
      ticketNo: "FCC8DDQB",
      amount: "₹ 5420.00",
      commission: "₹ 18.50",
      service: "Buses"
    },
    // FAILED - Goes to Failed tab (Buses)
    {
      id: 105,
      date: "Jan 08, 2026 at 11:15",
      date2: "Jan 08, 2026 at 11:18",
      txnId: "TXF88E7654F",
      mobile: "9988776655",
      email: "user@domain.com",
      status: "FAILED",
      travelDate: "25-12-2025",
      ticketNo: "FDD9EERC",
      amount: "₹ 12850.00",
      commission: "₹ 32.10",
      service: "Buses"
    },
    // HOTELS DUMMY DATA
    {
      id: 201,
      date: "Jan 02, 2026",
      txnId: "TX20554A9B6",
      hotelName: "Hotel Taj Palace",
      city: "Jaipur",
      checkIn: "16 Oct 2025",
      checkOut: "18 Oct 2025",
      status: "SUCCESS",
      amount: "₹ 28398.00",
      commission: "₹ 24.24",
      service: "Hotels"
    },
    {
      id: 202,
      date: "Feb 10, 2026",
      txnId: "TXH1234567A",
      hotelName: "Hotel Grand Hyatt",
      city: "Mumbai",
      checkIn: "10 Feb 2026",
      checkOut: "12 Feb 2026",
      status: "SUCCESS",
      amount: "₹ 12000.00",
      commission: "₹ 600.00",
      service: "Hotels"
    },
    {
      id: 203,
      date: "Feb 11, 2026",
      txnId: "TXH2345678B",
      hotelName: "Hotel Oberoi",
      city: "Delhi",
      checkIn: "11 Feb 2026",
      checkOut: "13 Feb 2026",
      status: "INITIATE",
      amount: "₹ 15000.00",
      commission: "₹ 750.00",
      service: "Hotels"
    },
    {
      id: 204,
      date: "Feb 12, 2026",
      txnId: "TXH3456789C",
      hotelName: "Hotel Leela Palace",
      city: "Bangalore",
      checkIn: "12 Feb 2026",
      checkOut: "14 Feb 2026",
      status: "CANCELLED",
      amount: "₹ 9000.00",
      commission: "₹ 450.00",
      service: "Hotels"
    },
    {
      id: 205,
      date: "Feb 13, 2026",
      txnId: "TXH4567890D",
      hotelName: "Hotel ITC Rajputana",
      city: "Jaipur",
      checkIn: "13 Feb 2026",
      checkOut: "15 Feb 2026",
      status: "FAILED",
      amount: "₹ 8000.00",
      commission: "₹ 400.00",
      service: "Hotels"
    }
  ];

  // Filter data based on active filter and activeService
  const getFilteredData = () => {
    // Show data for selected service
    return bookingData.filter(
      booking => booking.service === activeService &&
        (
          (activeFilter === "Past" && booking.status === "SUCCESS") ||
          (activeFilter === "Upcoming" && booking.status === "INITIATE") ||
          (activeFilter === "Cancelled" && booking.status === "CANCELLED") ||
          (activeFilter === "Failed" && booking.status === "FAILED")
        )
    );
  };

  const filteredData = getFilteredData();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

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
              {["Upcoming", "Past", "Cancelled", "Failed"].map((filter) => (
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

          {/* Booking Cards Container - Table Format */}
          <div className="booking-cards-container">
            <table className="bookings-table">
              <thead>
                {activeService === "Hotels" ? (
                  <tr>
                    <th>Date</th>
                    <th>User ID</th>
                    <th>Hotel Details</th>
                    <th>Check-in Date / Check-out Date</th>
                    <th>Amount</th>
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
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-bookings">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((booking) => (
                    <tr key={booking.id}>
                      {activeService === "Hotels" ? (
                        <>
                          <td className="date-column">
                            <div>{booking.date}</div>
                          </td>
                          <td className="txn-column">{booking.txnId}</td>
                          <td className="hotel-details-column">
                            <div>{booking.hotelName}, {booking.city}</div>
                          </td>
                          <td className="checkinout-column">
                            <div>Check-in: {booking.checkIn}</div>
                            <div>Check-out: {booking.checkOut}</div>
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
                                <button className="action-btn-cancel">Cancel Ticket</button>
                                <span className="action-separator">|</span>
                                <button className="action-btn-print">Print Ticket</button>
                              </>
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
                                <button className="action-btn-cancel">Cancel Ticket</button>
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
                  Showing 1 to {filteredData.length} of {filteredData.length} entries
                </div>
                <div className="pagination-controls">
                  <button className="pagination-btn prev-btn">←</button>
                  <button className="pagination-btn active-page">1</button>
                  <button className="pagination-btn next-btn">→</button>
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
