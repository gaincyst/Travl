import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { getCurrentUser } from "../utils/auth";
import { FaPlane, FaBus, FaHotel, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "../styles/DashboardPage.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  const [stats, setStats] = useState({
    flightBookings: { total: 12, successful: 10, failed: 1, cancelled: 1, totalAmount: 52500, successAmount: 45300 },
    hotelBookings: { total: 8, successful: 7, failed: 0, cancelled: 1, totalAmount: 28900, successAmount: 28900 },
    busBookings: { total: 15, successful: 13, failed: 1, cancelled: 1, totalAmount: 8450, successAmount: 7250 }
  });

  // Chart Data
  const chartData = [
    { month: 'Jan', flights: 4, hotels: 2, buses: 5 },
    { month: 'Feb', flights: 8, hotels: 3, buses: 6 },
    { month: 'Mar', flights: 6, hotels: 5, buses: 4 },
    { month: 'Apr', flights: 9, hotels: 4, buses: 8 },
    { month: 'May', flights: 12, hotels: 7, buses: 5 },
    { month: 'Jun', flights: 10, hotels: 8, buses: 9 },
    { month: 'Jul', flights: 15, hotels: 6, buses: 10 },
  ];

  const [recentBookings] = useState([
    { 
      id: 'BK-000076', 
      service: 'Flight', 
      passenger: 'Rajesh Kumar',
      totalPassengers: 2,
      amount: '₹25,500', 
      status: 'Completed', 
      date: '17 Apr, 2026', 
      payment: 'Online Mode',
      icon: FaPlane 
    },
    { 
      id: 'BK-000075', 
      service: 'Hotel', 
      passenger: 'Priya Sharma',
      totalPassengers: 3,
      amount: '₹32,750', 
      status: 'Pending', 
      date: '15 Apr, 2026', 
      payment: 'Card',
      icon: FaHotel 
    },
    { 
      id: 'BK-000074', 
      service: 'Flight', 
      passenger: 'Amit Singh',
      totalPassengers: 1,
      amount: '₹40,200', 
      status: 'Completed', 
      date: '15 Apr, 2026', 
      payment: 'My Wallet',
      icon: FaPlane 
    },
    { 
      id: 'BK-000073', 
      service: 'Bus', 
      passenger: 'Sneha Patel',
      totalPassengers: 4,
      amount: '₹8,450', 
      status: 'In Progress', 
      date: '14 Apr, 2026', 
      payment: 'Online Mode',
      icon: FaBus 
    },
    { 
      id: 'BK-000072', 
      service: 'Flight', 
      passenger: 'Vikram Desai',
      totalPassengers: 2,
      amount: '₹15,900', 
      status: 'Completed', 
      date: '10 Apr, 2026', 
      payment: 'Card',
      icon: FaPlane 
    },
    { 
      id: 'BK-000071', 
      service: 'Bus', 
      passenger: 'Ananya Gupta',
      totalPassengers: 5,
      amount: '₹8,450', 
      status: 'Completed', 
      date: '08 Apr, 2026', 
      payment: 'My Wallet',
      icon: FaBus 
    },
    { 
      id: 'BK-000070', 
      service: 'Hotel', 
      passenger: 'Rohit Verma',
      totalPassengers: 2,
      amount: '₹18,900', 
      status: 'Pending', 
      date: '05 Apr, 2026', 
      payment: 'Online Mode',
      icon: FaHotel 
    },
    { 
      id: 'BK-000069', 
      service: 'Flight', 
      passenger: 'Neha Singh',
      totalPassengers: 3,
      amount: '₹35,600', 
      status: 'Completed', 
      date: '02 Apr, 2026', 
      payment: 'Card',
      icon: FaPlane 
    },
  ]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const getTotalStats = () => {
    const totalBookings = stats.flightBookings.total + stats.hotelBookings.total + stats.busBookings.total;
    const totalSuccessful = stats.flightBookings.successful + stats.hotelBookings.successful + stats.busBookings.successful;
    const totalFailed = stats.flightBookings.failed + stats.hotelBookings.failed + stats.busBookings.failed;
    const totalCancelled = stats.flightBookings.cancelled + stats.hotelBookings.cancelled + stats.busBookings.cancelled;
    const totalAmount = stats.flightBookings.totalAmount + stats.hotelBookings.totalAmount + stats.busBookings.totalAmount;
    const totalSuccessAmount = stats.flightBookings.successAmount + stats.hotelBookings.successAmount + stats.busBookings.successAmount;

    return { totalBookings, totalSuccessful, totalFailed, totalCancelled, totalAmount, totalSuccessAmount };
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'status-completed';
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <FaCheckCircle />;
      case 'Pending':
        return <FaClock />;
      case 'In Progress':
        return <FaClock />;
      default:
        return null;
    }
  };

  const totals = getTotalStats();
  const successRate = ((totals.totalSuccessful / totals.totalBookings) * 100).toFixed(1);
  const failureRate = ((totals.totalFailed / totals.totalBookings) * 100).toFixed(1);
  const cancelledRate = ((totals.totalCancelled / totals.totalBookings) * 100).toFixed(1);

  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-greeting">
            <div className="header-blob header-blob-1"></div>
            <div className="header-blob header-blob-2"></div>
            <div className="header-blob header-blob-3"></div>
            <div className="header-text">
              <div className="header-badge">✈ Travel Dashboard</div>
              <h1>Good morning, {currentUser?.name?.split(' ')[0] || 'User'} 👋</h1>
              <p>Stay on top of your tasks, monitor progress, and track status.</p>
              <div className="header-tags">
                <span className="header-tag">📊 Analytics</span>
                <span className="header-tag">🏨 Bookings</span>
                <span className="header-tag">🚀 Insights</span>
              </div>
            </div>
            <div className="header-image-wrap">
              <img src="/offers/dash1.png" alt="Dashboard" className="header-dash-img" />
            </div>
          </div>
        </div>

        {/* Main Stats Row */}
        <div className="stats-container">
          {/* Total Bookings Card */}
          <div className="stat-card large">
            <div className="card-background"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Total Bookings</h3>
                <span className="stat-percentage profit">↑ 8%</span>
              </div>
              <div className="stat-value">{totals.totalBookings}</div>
              <p className="stat-subtext">across all services</p>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="stat-card large">
            <div className="card-background"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Total Amount</h3>
                <span className="stat-percentage">↓ 5%</span>
              </div>
              <div className="stat-value">₹{(totals.totalAmount / 1000).toFixed(1)}K</div>
              <p className="stat-subtext">This month</p>
            </div>
          </div>

          {/* Successful Bookings Card */}
          <div className="stat-card success-card">
            <div className="card-background success-bg"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Successful</h3>
                <FaCheckCircle className="status-icon" />
              </div>
              <div className="stat-value">{totals.totalSuccessful}</div>
              <p className="stat-amount">₹{(totals.totalSuccessAmount / 1000).toFixed(1)}K</p>
            </div>
          </div>

          {/* Failed Bookings Card */}
          <div className="stat-card failed-card">
            <div className="card-background failed-bg"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Failed</h3>
                <FaTimesCircle className="status-icon" />
              </div>
              <div className="stat-value">{totals.totalFailed}</div>
              <p className="stat-subtext">{failureRate}% of total</p>
            </div>
          </div>

          {/* Cancelled Bookings Card */}
          <div className="stat-card cancelled-card">
            <div className="card-background cancelled-bg"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Cancelled</h3>
                <FaClock className="status-icon" />
              </div>
              <div className="stat-value">{totals.totalCancelled}</div>
              <p className="stat-subtext">{cancelledRate}% of total</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* All Bookings Chart */}
          <div className="chart-card full-width">
            <h3 className="chart-title">Booking Trends - All Services</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorFlights" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHotels" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3498db" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBuses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f39c12" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f39c12" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e74c3c', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="flights" stroke="#e74c3c" strokeWidth={3} dot={{ fill: '#e74c3c', r: 5 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="hotels" stroke="#3498db" strokeWidth={3} dot={{ fill: '#3498db', r: 5 }} activeDot={{ r: 7 }} />
                <Line type="monotone" dataKey="buses" stroke="#f39c12" strokeWidth={3} dot={{ fill: '#f39c12', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Stats Detail Cards */}
        <div className="service-stats-detail-container">
          <div className="service-stat-card">
            <div className="service-header flights">
              <FaPlane />
              <h3>Flights</h3>
            </div>
            <div className="service-stats">
              <div className="stat-item">
                <span className="stat-label">Total Bookings</span>
                <span className="stat-number">{stats.flightBookings.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Successful</span>
                <span className="stat-number success">{stats.flightBookings.successful}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Failed</span>
                <span className="stat-number failed">{stats.flightBookings.failed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Cancelled</span>
                <span className="stat-number cancelled">{stats.flightBookings.cancelled}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Amount</span>
                <span className="stat-number">₹{stats.flightBookings.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="service-stat-card">
            <div className="service-header hotels">
              <FaHotel />
              <h3>Hotels</h3>
            </div>
            <div className="service-stats">
              <div className="stat-item">
                <span className="stat-label">Total Bookings</span>
                <span className="stat-number">{stats.hotelBookings.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Successful</span>
                <span className="stat-number success">{stats.hotelBookings.successful}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Failed</span>
                <span className="stat-number failed">{stats.hotelBookings.failed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Cancelled</span>
                <span className="stat-number cancelled">{stats.hotelBookings.cancelled}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Amount</span>
                <span className="stat-number">₹{stats.hotelBookings.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="service-stat-card">
            <div className="service-header buses">
              <FaBus />
              <h3>Buses</h3>
            </div>
            <div className="service-stats">
              <div className="stat-item">
                <span className="stat-label">Total Bookings</span>
                <span className="stat-number">{stats.busBookings.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Successful</span>
                <span className="stat-number success">{stats.busBookings.successful}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Failed</span>
                <span className="stat-number failed">{stats.busBookings.failed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Cancelled</span>
                <span className="stat-number cancelled">{stats.busBookings.cancelled}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Amount</span>
                <span className="stat-number">₹{stats.busBookings.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities-section">
          <div className="section-header">
            <h2>Recent Bookings</h2>
            <div className="header-actions">
              <input type="text" placeholder="Search" className="search-input" />
              <button className="filter-btn">Filter</button>
            </div>
          </div>

          <div className="activities-table">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Activity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr key={index}>
                    <td><span className="booking-id">{booking.id}</span></td>
                    <td>
                      <div className="activity-name">
                        <booking.icon className="activity-icon" />
                        <span className="activity-text">
                          {booking.service} 
                          <span className="passenger-info">
                            {booking.passenger}
                            <sup>+{booking.totalPassengers}</sup>
                          </span>
                        </span>
                      </div>
                    </td>
                    <td><span className="amount">{booking.amount}</span></td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </td>
                    <td><span className="date">{booking.date}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
