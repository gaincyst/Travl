import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyTripsNavbar from "../components/MyTripsNavbar";
import { getCurrentUser, logout } from "../utils/auth";
import { FaCamera, FaPhone, FaEnvelope, FaUser, FaUsers, FaSignOutAlt, FaKey, FaTrash, FaPencilAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showAddCoTraveller, setShowAddCoTraveller] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [savedCoTravellers, setSavedCoTravellers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [coTravellerForm, setCoTravellerForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    nationality: '',
    relationship: '',
    mealPreference: '',
    trainBerth: '',
    passportNo: '',
    expiryDate: '',
    issuingCountry: '',
    mobile: '',
    email: ''
  });

  const countryCodes = [
    { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
    { code: '+355', flag: '🇦🇱', name: 'Albania' },
    { code: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇯🇪', name: 'Jersey' },
    { code: '+962', flag: '🇯🇴', name: 'Jordan' },
    { code: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+686', flag: '🇰🇮', name: 'Kiribati' },
    { code: '+82', flag: '🇰🇷', name: 'Korea, Republic of South Korea' },
    { code: '+383', flag: '🇽🇰', name: 'Kosovo' },
    { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
    { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
    { code: '+856', flag: '🇱🇦', name: 'Laos' },
    { code: '+371', flag: '🇱🇻', name: 'Latvia' },
    { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
    { code: '+356', flag: '🇲🇹', name: 'Malta' },
    { code: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
    { code: '+596', flag: '🇲🇶', name: 'Martinique' },
    { code: '+222', flag: '🇲🇷', name: 'Mauritania' },
    { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
    { code: '+262', flag: '🇾🇹', name: 'Mayotte' },
    { code: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: '+691', flag: '🇫🇲', name: 'Micronesia' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: '+7', flag: '🇷🇺', name: 'Russia' },
    { code: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' },
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: '+90', flag: '🇹🇷', name: 'Turkey' },
    { code: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+63', flag: '🇵🇭', name: 'Philippines' },
    { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  ];

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setPhoneNumber(user?.mobile || '9236614228');
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate('/');
  };

  const handleResetPassword = () => {
    if (oldPassword && newPassword) {
      alert('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setShowOldPassword(false);
      setShowNewPassword(false);
    } else {
      alert('Please fill in both password fields');
    }
  };

  const handleSaveCoTraveller = () => {
    const newCoTraveller = {
      ...coTravellerForm,
      relationship: selectedRelationship
    };

    if (isEditing) {
      const updated = [...savedCoTravellers];
      updated[editingIndex] = newCoTraveller;
      setSavedCoTravellers(updated);
    } else {
      setSavedCoTravellers([...savedCoTravellers, newCoTraveller]);
    }

    // Reset form
    setShowAddCoTraveller(false);
    setIsEditing(false);
    setEditingIndex(null);
    setCoTravellerForm({
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      nationality: '',
      relationship: '',
      mealPreference: '',
      trainBerth: '',
      passportNo: '',
      expiryDate: '',
      issuingCountry: '',
      mobile: '',
      email: ''
    });
    setSelectedRelationship('');
  };

  const handleEditCoTraveller = (index) => {
    const traveller = savedCoTravellers[index];
    setCoTravellerForm(traveller);
    setSelectedRelationship(traveller.relationship);
    setIsEditing(true);
    setEditingIndex(index);
    setShowAddCoTraveller(true);
  };

  const handleDeleteCoTraveller = () => {
    const updated = savedCoTravellers.filter((_, i) => i !== editingIndex);
    setSavedCoTravellers(updated);
    setShowAddCoTraveller(false);
    setIsEditing(false);
    setEditingIndex(null);
    setCoTravellerForm({
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      nationality: '',
      relationship: '',
      mealPreference: '',
      trainBerth: '',
      passportNo: '',
      expiryDate: '',
      issuingCountry: '',
      mobile: '',
      email: ''
    });
    setSelectedRelationship('');
  };

  const handleCancelCoTraveller = () => {
    setShowAddCoTraveller(false);
    setIsEditing(false);
    setEditingIndex(null);
    setCoTravellerForm({
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      nationality: '',
      relationship: '',
      mealPreference: '',
      trainBerth: '',
      passportNo: '',
      expiryDate: '',
      issuingCountry: '',
      mobile: '',
      email: ''
    });
    setSelectedRelationship('');
  };

  const getInitials = (firstName, lastName) => {
    return (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase();
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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
                  <span>{phoneNumber}</span>
                </div>
                {email ? (
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <span>{email}</span>
                  </div>
                ) : (
                  <button className="add-email-btn" onClick={() => setShowEmailInput(true)}>
                    <FaEnvelope className="email-icon" />
                    Add Email Address
                  </button>
                )}
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
                className={`sidebar-menu-item ${activeTab === 'cotravellers' ? 'active' : ''}`}
                onClick={() => setActiveTab('cotravellers')}
              >
                <FaUsers className="sidebar-icon" />
                <span>Co-Travellers</span>
                {activeTab === 'cotravellers' && <span className="active-dot"></span>}
              </div>
              
              <div 
                className="sidebar-menu-item"
                onClick={handleLogoutClick}
              >
                <FaSignOutAlt className="sidebar-icon" />
                <span>Logout</span>
              </div>
            </div>
            
            <div className="sidebar-footer">
              <div 
                className={`sidebar-menu-item ${activeTab === 'reset' ? 'active' : ''}`}
                onClick={() => setActiveTab('reset')}
              >
                <FaKey className="sidebar-icon" />
                <span>Reset Password</span>
                {activeTab === 'reset' && <span className="active-dot"></span>}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="profile-content-area">
            {activeTab === 'profile' && (
              <>
                <div className="profile-content-header">
                  <h2>My Profile</h2>
                  <button className="profile-save-btn">SAVE</button>
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
                  <input 
                    type="date" 
                    min="1950-01-01" 
                    max={new Date().toISOString().split('T')[0]}
                    placeholder="Select Date of Birth"
                  />
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
                  <input 
                    type="date" 
                    min="1950-01-01" 
                    max={new Date().toISOString().split('T')[0]}
                    placeholder="Select Anniversary"
                  />
                </div>
                
                <div className="form-group">
                  <label>CITY OF RESIDENCE</label>
                  <select>
                    <option value="">Select City</option>
                    <option value="kanpur">Kanpur</option>
                    <option value="lucknow">Lucknow</option>
                    <option value="unnao">Unnao</option>
                    <option value="meerut">Meerut</option>
                    <option value="mathura">Mathura</option>
                    <option value="gorakhpur">Gorakhpur</option>
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>STATE</label>
                  <select>
                    <option value="">Select State</option>
                    <option value="up">Uttar Pradesh</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="uttarakhand">Uttarakhand</option>
                    <option value="delhi">Delhi</option>
                    <option value="tamil_nadu">Tamil Nadu</option>
                    <option value="kerala">Kerala</option>
                    <option value="madhya_pradesh">Madhya Pradesh</option>
                    <option value="bihar">Bihar</option>
                    <option value="assam">Assam</option>
                    <option value="haryana">Haryana</option>
                    <option value="jammu_kashmir">Jammu & Kashmir</option>
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
                    <input 
                      type="text" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <span className="verified-icon">✓</span>
                  </div>
                </div>
                
                {showEmailInput || email ? (
                  <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <button className="add-email-id-btn" onClick={() => setShowEmailInput(true)}>ADD EMAIL ID</button>
                  </div>
                )}
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
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 20)).toISOString().split('T')[0]}
                    placeholder="Select Expiry Date"
                  />
                </div>
                
                <div className="form-group">
                  <label>ISSUING COUNTRY</label>
                  <select>
                    <option value="">Select Country</option>
                    <option value="india">India</option>
                    <option value="usa">USA</option>
                    <option value="canada">Canada</option>
                    <option value="north_korea">North Korea</option>
                    <option value="russia">Russia</option>
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
              </>
            )}

            {activeTab === 'cotravellers' && (
              <>
                {!showAddCoTraveller ? (
                  <>
                    <div className="cotravellers-header">
                      <h2 className="cotravellers-title">Co-Travellers</h2>
                      <button className="add-cotraveller-btn" onClick={() => setShowAddCoTraveller(true)}>+ Add New Co-Traveller</button>
                    </div>

                    {savedCoTravellers.length === 0 ? (
                      <div className="cotravellers-empty-state">
                        <img 
                          src="/offers/cotraveller.png" 
                          alt="No Co-travellers" 
                          className="cotraveller-illustration"
                        />
                        <h3 className="cotravellers-empty-title">No Co-travellers saved</h3>
                        <p className="cotravellers-empty-text">Make bookings faster and easier by saving your Co-traveller details</p>
                      </div>
                    ) : (
                      <div className="saved-cotravellers-list">
                        {savedCoTravellers.map((traveller, index) => (
                          <div key={index} className="cotraveller-card">
                            <div className="cotraveller-card-content">
                              <div className="cotraveller-avatar">
                                {getInitials(traveller.firstName, traveller.lastName)}
                              </div>
                              <div className="cotraveller-info">
                                <h4 className="cotraveller-name">{traveller.firstName} {traveller.lastName}</h4>
                                <p className="cotraveller-details">
                                  {traveller.gender}, {calculateAge(traveller.dob)}y, {formatDate(traveller.dob)}, ({traveller.relationship})
                                </p>
                              </div>
                            </div>
                            <button className="cotraveller-edit-btn" onClick={() => handleEditCoTraveller(index)}>
                              <FaPencilAlt /> Edit
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="add-cotraveller-header">
                      <div className="add-cotraveller-title-section">
                        <button className="back-arrow-btn" onClick={handleCancelCoTraveller}>
                          ←
                        </button>
                        <h2 className="add-cotraveller-title">{isEditing ? 'Edit Co-Traveller' : 'Add New Co-Traveller'}</h2>
                      </div>
                      <div className="add-cotraveller-actions">
                        {isEditing && (
                          <button className="delete-btn" onClick={handleDeleteCoTraveller}>
                            <FaTrash />
                          </button>
                        )}
                        <button className="cancel-btn" onClick={handleCancelCoTraveller}>CANCEL</button>
                        <button className="cotraveller-save-btn" onClick={handleSaveCoTraveller}>SAVE</button>
                      </div>
                    </div>

                    {/* Warning Banner */}
                    <div className="cotraveller-warning-banner">
                      <div className="warning-icon">📋</div>
                      <p className="warning-text">
                        Please double check if your First and Last name, Gender & Date of Birth match your Govt. ID such as Aadhaar or Passport
                      </p>
                    </div>

                    {/* General Information */}
                    <div className="cotraveller-section">
                      <h3 className="cotraveller-section-title">General Information</h3>
                      
                      <div className="cotraveller-form-grid">
                        <div className="cotraveller-form-group">
                          <label>FIRST & MIDDLE NAME</label>
                          <input 
                            type="text" 
                            placeholder="" 
                            value={coTravellerForm.firstName}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, firstName: e.target.value})}
                          />
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>LAST NAME</label>
                          <input 
                            type="text" 
                            placeholder="" 
                            value={coTravellerForm.lastName}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, lastName: e.target.value})}
                          />
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>GENDER</label>
                          <select 
                            value={coTravellerForm.gender}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, gender: e.target.value})}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>DATE OF BIRTH</label>
                          <input 
                            type="date" 
                            min="1950-01-01" 
                            max={new Date().toISOString().split('T')[0]}
                            value={coTravellerForm.dob}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, dob: e.target.value})}
                          />
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>NATIONALITY</label>
                          <select 
                            value={coTravellerForm.nationality}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, nationality: e.target.value})}
                          >
                            <option value="">Select Nationality</option>
                            <option value="India">Indian</option>
                            <option value="American">American</option>
                            <option value="Canadian">Canadian</option>
                            <option value="British">British</option>
                          </select>
                        </div>
                      </div>

                      {/* Relationship Section */}
                      <div className="relationship-section">
                        <label className="relationship-label">RELATIONSHIP WITH TRAVELLER</label>
                        <div className="relationship-buttons">
                          {['Spouse', 'Child', 'Sibling', 'GrandParent', 'Friend', 'Parent', 'Colleague', 'Relative', 'Parent in law', 'Other'].map((rel) => (
                            <button
                              key={rel}
                              className={`relationship-btn ${selectedRelationship === rel ? 'active' : ''}`}
                              onClick={() => setSelectedRelationship(rel)}
                            >
                              {rel}
                            </button>
                          ))}
                        </div>
                        <p className="relationship-helper-text">
                          This helps to give us personalised travel recommendations when travelling
                        </p>
                      </div>

                      {/* Preferences */}
                      <div className="cotraveller-form-grid">
                        <div className="cotraveller-form-group">
                          <label>MEAL PREFERENCE</label>
                          <select 
                            value={coTravellerForm.mealPreference}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, mealPreference: e.target.value})}
                          >
                            <option value="">Select Meal Preference</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                          </select>
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>TRAIN BERTH PREFERENCE</label>
                          <select 
                            value={coTravellerForm.trainBerth}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, trainBerth: e.target.value})}
                          >
                            <option value="">Select Berth Preference</option>
                            <option value="Lower">Lower</option>
                            <option value="Middle">Middle</option>
                            <option value="Upper">Upper</option>
                            <option value="Side Lower">Side Lower</option>
                            <option value="Side Upper">Side Upper</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Passport Details */}
                    <div className="cotraveller-section">
                      <h3 className="cotraveller-section-title">Passport Details</h3>
                      
                      <div className="cotraveller-form-grid">
                        <div className="cotraveller-form-group">
                          <label>PASSPORT NO.</label>
                          <input 
                            type="text" 
                            placeholder="" 
                            value={coTravellerForm.passportNo}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, passportNo: e.target.value})}
                          />
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>EXPIRY DATE</label>
                          <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            max={new Date(new Date().setFullYear(new Date().getFullYear() + 20)).toISOString().split('T')[0]}
                            value={coTravellerForm.expiryDate}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, expiryDate: e.target.value})}
                          />
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>ISSUING COUNTRY</label>
                          <select 
                            value={coTravellerForm.issuingCountry}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, issuingCountry: e.target.value})}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="Canada">Canada</option>
                            <option value="North Korea">North Korea</option>
                            <option value="Russia">Russia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="cotraveller-section">
                      <h3 className="cotraveller-section-title">Add contact information to receive booking details & other alerts</h3>
                      
                      <div className="cotraveller-form-grid">
                        <div className="cotraveller-form-group phone-group">
                          <label>MOBILE NUMBER</label>
                          <div className="phone-input-wrapper">
                            <div 
                              className="country-code-selector"
                              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            >
                              <span className="flag-icon">{selectedCountryCode.flag}</span>
                              <span>{selectedCountryCode.code}</span>
                              <span className="dropdown-arrow">▼</span>
                              
                              {showCountryDropdown && (
                                <div className="country-dropdown">
                                  {countryCodes.map((country, index) => (
                                    <div
                                      key={index}
                                      className="country-option"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCountryCode(country);
                                        setShowCountryDropdown(false);
                                      }}
                                    >
                                      <span className="flag-icon">{country.flag}</span>
                                      <span className="country-name">{country.name} ({country.code})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <input 
                              type="tel" 
                              placeholder="" 
                              className="phone-input" 
                              value={coTravellerForm.mobile}
                              onChange={(e) => setCoTravellerForm({...coTravellerForm, mobile: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="cotraveller-form-group">
                          <label>EMAIL ID</label>
                          <input 
                            type="email" 
                            placeholder="" 
                            value={coTravellerForm.email}
                            onChange={(e) => setCoTravellerForm({...coTravellerForm, email: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'reset' && (
              <>
                <div className="profile-content-header">
                  <h2>Reset Password</h2>
                </div>

                <div className="profile-section">
                  <p className="section-subtitle">
                    Your password must be at least 8 characters long and include both small and uppercase letters, numbers, and special characters (e.g., $!@%)
                  </p>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>OLD PASSWORD</label>
                      <div className="input-with-icon">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Enter old password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <button 
                          className="password-toggle-icon"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>NEW PASSWORD</label>
                      <div className="input-with-icon">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button 
                          className="password-toggle-icon"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <a href="#" className="forgot-password-link">Forgot your password?</a>
                  
                  <button className="reset-password-save-btn" onClick={handleResetPassword}>RESET PASSWORD</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={handleCancelLogout}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-icon">
              <FaSignOutAlt />
            </div>
            <h3 className="logout-modal-title">Logout Account?</h3>
            <p className="logout-modal-text">Are you sure want to logout your account?</p>
            <div className="logout-modal-actions">
              <button className="logout-cancel-btn" onClick={handleCancelLogout}>Cancel</button>
              <button className="logout-confirm-btn" onClick={handleConfirmLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfilePage;
