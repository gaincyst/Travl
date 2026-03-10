import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyTripsNavbar from "../components/MyTripsNavbar";
import { getCurrentUser, logout } from "../utils/auth";
import { FaCamera, FaPhone, FaEnvelope, FaUser, FaUsers, FaDesktop, FaSignOutAlt, FaKey } from "react-icons/fa";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <MyTripsNavbar />
      
      {/* Profile Hero Section */}
      <div className="profile-hero">
        <div className="profile-hero-content">
          <div className="breadcrumb">
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
            <span className="breadcrumb-separator">›</span>
            <span>My Account</span>
          </div>
          
          <div className="profile-hero-info">
            <div className="profile-avatar-large">
              <FaCamera className="camera-icon" />
              <span className="add-photo-text">Add Photo</span>
            </div>
            
            <div className="profile-user-info">
              <h1 className="profile-username">{currentUser?.name || 'Guest'}</h1>
              <div className="profile-contact-quick">
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <span>{currentUser?.mobile || '9236614228'}</span>
                </div>
                <button className="add-email-btn">
                  <FaEnvelope className="email-icon" />
                  Add Email Address
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="profile-main-container">
        <div className="profile-main-wrapper">
          {/* Left Sidebar */}
          <div className="profile-sidebar">
            <h3 className="sidebar-title">MY ACCOUNT</h3>
            
            <div className="sidebar-menu">
              <div 
                className={`sidebar-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser className="sidebar-icon" />
                <span>My Profile</span>
                {activeTab === 'profile' && <span className="active-dot"></span>}
              </div>
              
              <div 
                className="sidebar-menu-item"
                onClick={() => setActiveTab('cotravellers')}
              >
                <FaUsers className="sidebar-icon" />
                <span>Co-Travellers</span>
              </div>
              
              <div 
                className="sidebar-menu-item"
                onClick={() => setActiveTab('devices')}
              >
                <FaDesktop className="sidebar-icon" />
                <span>Logged In Devices</span>
              </div>
              
              <div 
                className="sidebar-menu-item"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="sidebar-icon" />
                <span>Logout</span>
              </div>
            </div>
            
            <div className="sidebar-footer">
              <div className="sidebar-menu-item">
                <FaKey className="sidebar-icon" />
                <span>Reset Password</span>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="profile-content-area">
            <div className="profile-content-header">
              <h2>My Profile</h2>
              <button className="save-btn">SAVE</button>
            </div>

            {/* Birthday Banner */}
            <div className="birthday-banner">
              <div className="birthday-icon">🎂</div>
              <div className="birthday-text">
                <h4>Planning a Birthday trip?</h4>
                <p>Please add your Date of Birth and enjoy a little surprise from us!</p>
              </div>
              <button className="add-dob-btn">Add Date of Birth</button>
            </div>

            {/* General Information */}
            <div className="profile-section">
              <h3 className="section-title">General Information</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>FIRST & MIDDLE NAME</label>
                  <input type="text" defaultValue={currentUser?.name || 'Gaincy'} />
                </div>
                
                <div className="form-group">
                  <label>LAST NAME</label>
                  <input type="text" placeholder="" />
                </div>
                
                <div className="form-group">
                  <label>GENDER</label>
                  <select>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>DATE OF BIRTH</label>
                  <select>
                    <option value="">Select Date of Birth</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>NATIONALITY</label>
                  <select>
                    <option value="">Select Nationality</option>
                    <option value="indian">Indian</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>MARITAL STATUS</label>
                  <select>
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>ANNIVERSARY</label>
                  <select>
                    <option value="">Select Anniversary</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>CITY OF RESIDENCE</label>
                  <select>
                    <option value="">Select City</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>STATE</label>
                  <select>
                    <option value="up">Uttar Pradesh</option>
                  </select>
                  <small className="form-note">Required for GST purpose on your tax invoice</small>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="profile-section">
              <h3 className="section-title">Contact Details</h3>
              <p className="section-subtitle">Add contact information to receive booking details & other alerts</p>
              
              <div className="form-grid">
                <div className="form-group verified">
                  <label>MOBILE NUMBER</label>
                  <div className="input-with-icon">
                    <input type="text" defaultValue={currentUser?.mobile || '+91-9236614228'} readOnly />
                    <span className="verified-icon">✓</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <button className="add-email-id-btn">ADD EMAIL ID</button>
                </div>
              </div>
            </div>

            {/* Documents Details */}
            <div className="profile-section">
              <h3 className="section-title">Documents Details</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>PASSPORT NO.</label>
                  <input type="text" placeholder="" />
                </div>
                
                <div className="form-group">
                  <label>EXPIRY DATE</label>
                  <select>
                    <option value="">Select Expiry Date</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>ISSUING COUNTRY</label>
                  <select>
                    <option value="">Select Country</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>PAN CARD NUMBER</label>
                  <input type="text" placeholder="" />
                </div>
              </div>
              
              <p className="documents-note">
                <strong>NOTE:</strong> Your PAN No. will only be used for international bookings as per RBI Guidelines
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
