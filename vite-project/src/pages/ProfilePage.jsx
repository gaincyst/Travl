import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyTripsNavbar from "../components/MyTripsNavbar";
import ProfileAvatar from "../components/ProfileAvatar";
import { logout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS, getAuthHeaders } from "../utils/api";
import { FaPhone, FaEnvelope, FaUser, FaUsers, FaSignOutAlt, FaTrash, FaPencilAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
  const [isDocumentsDetailsOpen, setIsDocumentsDetailsOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
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
  const [isCoTravellerPassportOpen, setIsCoTravellerPassportOpen] = useState(false);
  const [isCoTravellerContactOpen, setIsCoTravellerContactOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingCoTraveller, setIsSavingCoTraveller] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstMiddleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    cityOfResidence: '',
    state: '',
    countryCode: '+91',
    mobile: '',
    passportNo: '',
    passportExpiryDate: '',
    passportIssuingCountry: '',
    panCardNumber: ''
  });
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
  const [profileTouched, setProfileTouched] = useState({
    firstMiddleName: false,
    lastName: false,
    state: false,
    cityOfResidence: false,
    mobile: false
  });
  const [profileErrors, setProfileErrors] = useState({
    firstMiddleName: '',
    lastName: '',
    cityOfResidence: '',
    mobile: ''
  });
  const [coTravellerErrors, setCoTravellerErrors] = useState({
    firstName: '',
    mobile: ''
  });
  const [resetPasswordErrors, setResetPasswordErrors] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [isVerifyingOldPassword, setIsVerifyingOldPassword] = useState(false);
  const [isOldPasswordMatched, setIsOldPasswordMatched] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const mapApiCoTravellerToForm = (traveller = {}) => ({
    id: traveller.id,
    firstName: traveller.firstName || '',
    lastName: traveller.lastName || '',
    gender: traveller.gender || '',
    dob: traveller.dateOfBirth || '',
    nationality: traveller.nationality || '',
    relationship: traveller.relationship || '',
    mealPreference: traveller.mealPreference || '',
    trainBerth: traveller.trainBerthPreference || '',
    passportNo: traveller.passportNo || '',
    expiryDate: traveller.passportExpiryDate || '',
    issuingCountry: traveller.issuingCountry || '',
    mobile: traveller.mobile || '',
    email: traveller.email || ''
  });

  const mapFormCoTravellerToApiPayload = (traveller = {}) => ({
    firstName: traveller.firstName,
    lastName: traveller.lastName,
    gender: traveller.gender,
    dateOfBirth: traveller.dob,
    nationality: traveller.nationality,
    relationship: traveller.relationship,
    mealPreference: traveller.mealPreference,
    trainBerthPreference: traveller.trainBerth,
    passportNo: traveller.passportNo,
    passportExpiryDate: traveller.expiryDate,
    issuingCountry: traveller.issuingCountry,
    mobile: traveller.mobile,
    email: traveller.email
  });

  const toDateInputValue = (value) => {
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return '';
      }

      return value.toISOString().slice(0, 10);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed ? trimmed.slice(0, 10) : '';
    }

    return '';
  };

  const normalizeProfileFromApi = (profile = {}) => ({
    firstMiddleName: profile.firstMiddleName || '',
    lastName: profile.lastName || '',
    gender: profile.gender || '',
    dateOfBirth: toDateInputValue(profile.dateOfBirth),
    nationality: profile.nationality || '',
    cityOfResidence: profile.cityOfResidence || '',
    state: profile.state || '',
    countryCode: profile.countryCode || '+91',
    mobile: profile.mobile || '',
    passportNo: profile.passportNo || '',
    passportExpiryDate: toDateInputValue(profile.passportExpiryDate),
    passportIssuingCountry: profile.passportIssuingCountry || '',
    panCardNumber: profile.panCardNumber || ''
  });

  const toNameCase = (value = '') =>
    value
      .toLowerCase()
      .replace(/(^|\s)([a-z])/g, (_, prefix, char) => `${prefix}${char.toUpperCase()}`);

  const validateFirstName = (value = '') => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return 'First name is required.';
    }

    if (!/^[A-Za-z]/.test(trimmedValue) || /[^A-Za-z\s]/.test(trimmedValue)) {
      return 'It cannot start with any symbol, do not contain any number.';
    }

    return '';
  };

  const validateLastName = (value = '') => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return '';
    }

    if (!/^[A-Za-z]/.test(trimmedValue) || /[^A-Za-z.\s]/.test(trimmedValue)) {
      return 'Only alphabets are allowed and first letter should be capital. It should not start with any symbol; only (.) is allowed.';
    }

    return '';
  };

  const validateMobile = (value = '') => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return 'Contact details are required.';
    }

    if (!/^\d+$/.test(trimmedValue)) {
      return 'There should be no symbol as well as alphabet. It should only be numeric in nature.';
    }

    return '';
  };

  const getProfileValidationErrors = ({ firstMiddleName, lastName, state, cityOfResidence, mobile }) => ({
    firstMiddleName: validateFirstName(firstMiddleName),
    lastName: validateLastName(lastName),
    cityOfResidence: !state && cityOfResidence ? 'First fill the State' : '',
    mobile: validateMobile(mobile)
  });

  const handleFirstNameChange = (event) => {
    const formattedValue = toNameCase(event.target.value);

    setProfileForm((prev) => ({ ...prev, firstMiddleName: formattedValue }));

    if (profileTouched.firstMiddleName) {
      setProfileErrors((prev) => ({
        ...prev,
        firstMiddleName: validateFirstName(formattedValue)
      }));
    }
  };

  const handleFirstNameBlur = () => {
    setProfileTouched((prev) => ({ ...prev, firstMiddleName: true }));
    setProfileErrors((prev) => ({
      ...prev,
      firstMiddleName: validateFirstName(profileForm.firstMiddleName)
    }));
  };

  const handleLastNameChange = (event) => {
    const formattedValue = toNameCase(event.target.value);

    setProfileForm((prev) => ({ ...prev, lastName: formattedValue }));

    if (profileTouched.lastName) {
      setProfileErrors((prev) => ({
        ...prev,
        lastName: validateLastName(formattedValue)
      }));
    }
  };

  const handleLastNameBlur = () => {
    setProfileTouched((prev) => ({ ...prev, lastName: true }));
    setProfileErrors((prev) => ({
      ...prev,
      lastName: validateLastName(profileForm.lastName)
    }));
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;

    setProfileTouched((prev) => ({ ...prev, state: true }));
    setProfileForm((prev) => ({ ...prev, state: selectedState }));
    setProfileErrors((prev) => ({
      ...prev,
      cityOfResidence: selectedState ? '' : prev.cityOfResidence
    }));
  };

  const handleCityFocus = () => {
    setProfileTouched((prev) => ({ ...prev, cityOfResidence: true }));

    if (!profileForm.state) {
      setProfileErrors((prev) => ({
        ...prev,
        cityOfResidence: 'First fill the State'
      }));
    }
  };

  const handleCityChange = (event) => {
    if (!profileForm.state) {
      setProfileErrors((prev) => ({
        ...prev,
        cityOfResidence: 'First fill the State'
      }));
      return;
    }

    setProfileForm((prev) => ({ ...prev, cityOfResidence: event.target.value }));
    setProfileErrors((prev) => ({ ...prev, cityOfResidence: '' }));
  };

  const handleMobileChange = (event) => {
    const value = event.target.value;
    setPhoneNumber(value);

    if (profileTouched.mobile) {
      setProfileErrors((prev) => ({ ...prev, mobile: validateMobile(value) }));
    }
  };

  const handleMobileBlur = () => {
    setProfileTouched((prev) => ({ ...prev, mobile: true }));
    setProfileErrors((prev) => ({ ...prev, mobile: validateMobile(phoneNumber) }));
  };

  const verifyCurrentPassword = async (passwordValue) => {
    setIsVerifyingOldPassword(true);

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE_PASSWORD_VERIFY, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ oldPassword: passwordValue })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Password is not matched with the Current Password');
      }

      setIsOldPasswordMatched(true);
      setResetPasswordErrors((prev) => ({ ...prev, oldPassword: '' }));
      return true;
    } catch (error) {
      setIsOldPasswordMatched(false);
      setResetPasswordErrors((prev) => ({
        ...prev,
        oldPassword: 'Password is not matched with the Current Password'
      }));
      return false;
    } finally {
      setIsVerifyingOldPassword(false);
    }
  };

  const handleOldPasswordChange = (event) => {
    const enteredPassword = event.target.value;

    setOldPassword(enteredPassword);
    setIsOldPasswordMatched(false);
    setNewPassword('');
    setResetPasswordErrors((prev) => ({
      ...prev,
      oldPassword: enteredPassword.trim()
        ? 'Password is not matched with the Current Password'
        : '',
      newPassword: ''
    }));
  };

  const handleOldPasswordBlur = async () => {
    const trimmedOldPassword = oldPassword.trim();

    if (!trimmedOldPassword) {
      setResetPasswordErrors((prev) => ({ ...prev, oldPassword: '' }));
      return;
    }

    await verifyCurrentPassword(trimmedOldPassword);
  };

  const handleNewPasswordChange = (event) => {
    const enteredPassword = event.target.value;

    setNewPassword(enteredPassword);
    if (enteredPassword.trim()) {
      setResetPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
    }
  };

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
    const loadProfile = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
          method: 'GET',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          setPhoneNumber(currentUser?.mobile || '');
          return;
        }

        const result = await response.json();
        if (!result.success || !result.data) {
          setPhoneNumber(currentUser?.mobile || '');
          return;
        }

        const normalizedProfile = normalizeProfileFromApi(result.data.profile || {});
        setProfileForm(normalizedProfile);
        setPhoneNumber(normalizedProfile.mobile || currentUser?.mobile || '');
        setSavedCoTravellers((result.data.coTravellers || []).map(mapApiCoTravellerToForm));
        
        // Load avatar URL from profile
        if (result.data.profile?.avatarUrl) {
          setAvatarUrl(result.data.profile.avatarUrl);
          updateUser?.({ avatarUrl: result.data.profile.avatarUrl, avatar_url: result.data.profile.avatarUrl });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setPhoneNumber(currentUser?.mobile || '');
      }
    };

    loadProfile();
  }, [currentUser]);

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

  const handleResetPassword = async () => {
    const trimmedOldPassword = oldPassword.trim();
    const trimmedNewPassword = newPassword.trim();

    if (!trimmedOldPassword) {
      setResetPasswordErrors((prev) => ({ ...prev, oldPassword: '' }));
      return;
    }

    let isPasswordMatched = isOldPasswordMatched;
    if (!isPasswordMatched) {
      isPasswordMatched = await verifyCurrentPassword(trimmedOldPassword);
    }

    if (!isPasswordMatched) {
      return;
    }

    if (!trimmedNewPassword) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.PROFILE_PASSWORD, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ oldPassword: trimmedOldPassword, newPassword: trimmedNewPassword })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to reset password');
      }

      alert('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setShowOldPassword(false);
      setShowNewPassword(false);
      setResetPasswordErrors({ oldPassword: '', newPassword: '' });
      setIsOldPasswordMatched(false);
    } catch (error) {
      console.error('Failed to reset password:', error);

      if (/not matched|incorrect/i.test(error.message || '')) {
        setIsOldPasswordMatched(false);
        setResetPasswordErrors((prev) => ({
          ...prev,
          oldPassword: 'Password is not matched with the Current Password'
        }));
        return;
      }

      alert(error.message || 'Failed to reset password');
    }
  };

  const handleProfileSave = async () => {
    const normalizedProfile = {
      ...profileForm,
      firstMiddleName: profileForm.firstMiddleName.trim(),
      lastName: profileForm.lastName.trim(),
      cityOfResidence: profileForm.cityOfResidence,
      mobile: phoneNumber.trim()
    };

    const validationErrors = getProfileValidationErrors({
      firstMiddleName: normalizedProfile.firstMiddleName,
      lastName: normalizedProfile.lastName,
      state: normalizedProfile.state,
      cityOfResidence: normalizedProfile.cityOfResidence,
      mobile: normalizedProfile.mobile
    });

    setProfileTouched({
      firstMiddleName: true,
      lastName: true,
      state: true,
      cityOfResidence: true,
      mobile: true
    });
    setProfileErrors(validationErrors);

    if (validationErrors.mobile) {
      setIsContactDetailsOpen(true);
    }

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    setIsSavingProfile(true);

    try {
      const payload = {
        firstMiddleName: normalizedProfile.firstMiddleName,
        lastName: normalizedProfile.lastName,
        gender: profileForm.gender,
        dateOfBirth: profileForm.dateOfBirth,
        nationality: profileForm.nationality,
        cityOfResidence: profileForm.cityOfResidence,
        state: profileForm.state,
        countryCode: profileForm.countryCode,
        mobile: normalizedProfile.mobile,
        passportNo: profileForm.passportNo,
        passportExpiryDate: profileForm.passportExpiryDate,
        passportIssuingCountry: profileForm.passportIssuingCountry,
        panCardNumber: profileForm.panCardNumber
      };

      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to save profile');
      }

      if (result.data?.user) {
        const updatedUser = result.data.user;
        updateUser?.({
          userId: updatedUser.id ?? currentUser?.userId,
          name: updatedUser.name ?? currentUser?.name ?? '',
          email: updatedUser.email ?? currentUser?.email ?? '',
          avatarUrl: result.data?.profile?.avatarUrl ?? currentUser?.avatarUrl ?? avatarUrl ?? null,
          avatar_url: result.data?.profile?.avatarUrl ?? currentUser?.avatar_url ?? avatarUrl ?? null
        });
      }

      const updatedProfile = normalizeProfileFromApi(result.data?.profile || {});
      setProfileForm(updatedProfile);
      setPhoneNumber(updatedProfile.mobile || '');
      setSavedCoTravellers((result.data?.coTravellers || []).map(mapApiCoTravellerToForm));
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(error.message || 'Failed to save profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveCoTraveller = async () => {
    if (!isEditing) {
      const validationErrors = {
        firstName: validateFirstName(coTravellerForm.firstName),
        mobile: validateMobile(coTravellerForm.mobile)
      };

      setCoTravellerErrors(validationErrors);

      if (validationErrors.firstName || validationErrors.mobile) {
        if (validationErrors.mobile) {
          setIsCoTravellerContactOpen(true);
        }
        return;
      }
    }

    setIsSavingCoTraveller(true);

    const newCoTraveller = {
      ...coTravellerForm,
      relationship: selectedRelationship || coTravellerForm.relationship || ''
    };

    try {
      const payload = mapFormCoTravellerToApiPayload(newCoTraveller);

      if (isEditing) {
        const editingTraveller = savedCoTravellers[editingIndex];
        if (!editingTraveller?.id) {
          throw new Error('Co-traveller id is missing');
        }

        const response = await fetch(`${API_ENDPOINTS.PROFILE}/cotravellers/${editingTraveller.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to update co-traveller');
        }

        const updated = [...savedCoTravellers];
        updated[editingIndex] = mapApiCoTravellerToForm(result.data?.coTraveller || {});
        setSavedCoTravellers(updated);
      } else {
        const response = await fetch(`${API_ENDPOINTS.PROFILE}/cotravellers`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to create co-traveller');
        }

        setSavedCoTravellers([...savedCoTravellers, mapApiCoTravellerToForm(result.data?.coTraveller || {})]);
      }

      alert(`Co-traveller ${isEditing ? 'updated' : 'saved'} successfully!`);
    } catch (error) {
      console.error('Failed to save co-traveller:', error);
      alert(error.message || 'Failed to save co-traveller');
      return;
    } finally {
      setIsSavingCoTraveller(false);
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
    setCoTravellerErrors({
      firstName: '',
      mobile: ''
    });
    setSelectedRelationship('');
  };

  const handleEditCoTraveller = (index) => {
    const traveller = savedCoTravellers[index];
    setCoTravellerForm(traveller);
    setCoTravellerErrors({
      firstName: '',
      mobile: ''
    });
    setSelectedRelationship(traveller.relationship);
    setIsEditing(true);
    setEditingIndex(index);
    setShowAddCoTraveller(true);
  };

  const handleDeleteCoTraveller = async () => {
    const editingTraveller = savedCoTravellers[editingIndex];
    if (!editingTraveller?.id) {
      alert('Co-traveller id is missing');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.PROFILE}/cotravellers/${editingTraveller.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete co-traveller');
      }

      const updated = savedCoTravellers.filter((_, i) => i !== editingIndex);
      setSavedCoTravellers(updated);
      alert('Co-traveller deleted successfully!');
    } catch (error) {
      console.error('Failed to delete co-traveller:', error);
      alert(error.message || 'Failed to delete co-traveller');
      return;
    }

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
    setCoTravellerErrors({
      firstName: '',
      mobile: ''
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
    setCoTravellerErrors({
      firstName: '',
      mobile: ''
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
         
          
          <div className="profile-hero-info">
            <ProfileAvatar
              user={currentUser}
              avatarUrl={avatarUrl}
              displayName={currentUser?.name || 'Guest'}
              onAvatarChange={setAvatarUrl}
              size={120}
            />

            <div className="profile-user-info">
              <h1 className="profile-username">{currentUser?.name || 'Guest'}</h1>
              <div className="profile-contact-quick">
                {phoneNumber ? (
                  <div className="contact-item">
                    <FaPhone className="contact-icon" />
                    <span>{phoneNumber}</span>
                  </div>
                ) : (
                  <></>
                )}
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>{currentUser?.email || ''}</span>
                </div>
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
            
          </div>

          {/* Right Content Area */}
          <div className="profile-content-area">
            {activeTab === 'profile' && (
              <>
                <div className="profile-content-header">
                  <h2>My Profile</h2>
                  <button className="profile-save-btn" onClick={handleProfileSave} disabled={isSavingProfile}>
                    {isSavingProfile ? 'SAVING...' : 'SAVE'}
                  </button>
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
                  <label>FIRST NAME <span className="required-asterisk">*</span></label>
                  <input
                    type="text"
                    className={profileErrors.firstMiddleName ? 'field-has-error' : ''}
                    value={profileForm.firstMiddleName}
                    onChange={handleFirstNameChange}
                    onBlur={handleFirstNameBlur}
                  />
                  {profileErrors.firstMiddleName && <small className="field-error">{profileErrors.firstMiddleName}</small>}
                </div>
                
                <div className="form-group">
                  <label>LAST NAME</label>
                  <input
                    type="text"
                    className={profileErrors.lastName ? 'field-has-error' : ''}
                    value={profileForm.lastName}
                    onChange={handleLastNameChange}
                    onBlur={handleLastNameBlur}
                  />
                  {profileErrors.lastName && <small className="field-error">{profileErrors.lastName}</small>}
                </div>
                
                <div className="form-group">
                  <label>GENDER</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>DATE OF BIRTH</label>
                  <input 
                    type="date" 
                    min="1950-01-01" 
                    max={new Date().toISOString().split('T')[0]}
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                    placeholder="Select Date of Birth"
                  />
                </div>
                
                <div className="form-group">
                  <label>NATIONALITY</label>
                  <select
                    value={profileForm.nationality}
                    onChange={(e) => setProfileForm({ ...profileForm, nationality: e.target.value })}
                  >
                    <option value="">Select Nationality</option>
                    <option value="Indian">Indian</option>
                  </select>
                </div>
                
                
                
                
                
                <div className="form-group">
                  <label>CITY OF RESIDENCE</label>
                  <select
                    className={profileErrors.cityOfResidence ? 'field-has-error' : ''}
                    value={profileForm.cityOfResidence}
                    onFocus={handleCityFocus}
                    onChange={handleCityChange}
                  >
                    <option value="">Select City</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Unnao">Unnao</option>
                    <option value="Meerut">Meerut</option>
                    <option value="Mathura">Mathura</option>
                    <option value="Gorakhpur">Gorakhpur</option>
                  </select>
                  {profileErrors.cityOfResidence && <small className="field-error">{profileErrors.cityOfResidence}</small>}
                </div>
                
                <div className="form-group full-width">
                  <label>STATE</label>
                  <select
                    value={profileForm.state}
                    onChange={handleStateChange}
                  >
                    <option value="">Select State</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Assam">Assam</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                  </select>
                  <small className="form-note">Required for GST purpose on your tax invoice</small>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Contact Details</h3>
                <button
                  type="button"
                  className="section-accordion-toggle"
                  onClick={() => setIsContactDetailsOpen((prev) => !prev)}
                  aria-label="Toggle Contact Details"
                >
                  {isContactDetailsOpen ? '▾' : '▸'}
                </button>
              </div>

              {isContactDetailsOpen && (
                <>
                  <p className="section-subtitle">Add contact information to receive booking details & other alerts</p>

                  <div className="form-grid">
                    <div className="form-group verified">
                      <label>MOBILE NUMBER <span className="required-asterisk">*</span></label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          className={profileErrors.mobile ? 'field-has-error' : ''}
                          value={phoneNumber}
                          onChange={handleMobileChange}
                          onBlur={handleMobileBlur}
                        />
                        {phoneNumber && !profileErrors.mobile && <span className="verified-icon">✓</span>}
                      </div>
                      {profileErrors.mobile && <small className="field-error">{profileErrors.mobile}</small>}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Documents Details */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Documents Details</h3>
                <button
                  type="button"
                  className="section-accordion-toggle"
                  onClick={() => setIsDocumentsDetailsOpen((prev) => !prev)}
                  aria-label="Toggle Documents Details"
                >
                  {isDocumentsDetailsOpen ? '▾' : '▸'}
                </button>
              </div>

              {isDocumentsDetailsOpen && (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>PASSPORT NO.</label>
                      <input
                        type="text"
                        value={profileForm.passportNo}
                        onChange={(e) => setProfileForm({ ...profileForm, passportNo: e.target.value })}
                        placeholder=""
                      />
                    </div>

                    <div className="form-group">
                      <label>EXPIRY DATE</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 20)).toISOString().split('T')[0]}
                        value={profileForm.passportExpiryDate}
                        onChange={(e) => setProfileForm({ ...profileForm, passportExpiryDate: e.target.value })}
                        placeholder="Select Expiry Date"
                      />
                    </div>

                    <div className="form-group">
                      <label>ISSUING COUNTRY</label>
                      <select
                        value={profileForm.passportIssuingCountry}
                        onChange={(e) => setProfileForm({ ...profileForm, passportIssuingCountry: e.target.value })}
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                        <option value="North Korea">North Korea</option>
                        <option value="Russia">Russia</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>PAN CARD NUMBER</label>
                      <input
                        type="text"
                        value={profileForm.panCardNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, panCardNumber: e.target.value })}
                        placeholder=""
                      />
                    </div>
                  </div>

                  <p className="documents-note">
                    <strong>NOTE:</strong> Your PAN No. will only be used for international bookings as per RBI Guidelines
                  </p>
                </>
              )}
            </div>

            {/* Reset Password */}
            <div className="profile-section">
              <div className="section-header">
                <h3 className="section-title">Reset Password</h3>
                <button
                  type="button"
                  className="section-accordion-toggle"
                  onClick={() => setIsResetPasswordOpen((prev) => !prev)}
                  aria-label="Toggle Reset Password"
                >
                  {isResetPasswordOpen ? '▾' : '▸'}
                </button>
              </div>

              {isResetPasswordOpen && (
                <>
                  <p className="section-subtitle">
                    Your password must be at least 8 characters long and include both small and uppercase letters, numbers, and special characters (e.g., $!@%)
                  </p>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>OLD PASSWORD</label>
                      <div className="input-with-icon">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          className={resetPasswordErrors.oldPassword ? 'field-has-error' : ''}
                          placeholder="Enter old password"
                          value={oldPassword}
                          onChange={handleOldPasswordChange}
                          onBlur={() => {
                            void handleOldPasswordBlur();
                          }}
                        />
                        <button
                          className="password-toggle-icon"
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {resetPasswordErrors.oldPassword && <small className="field-error">{resetPasswordErrors.oldPassword}</small>}
                    </div>

                    <div className="form-group">
                      <label>NEW PASSWORD</label>
                      <div className="input-with-icon">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className={resetPasswordErrors.newPassword ? 'field-has-error' : ''}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={handleNewPasswordChange}
                          disabled={!isOldPasswordMatched || isVerifyingOldPassword}
                        />
                        <button
                          className="password-toggle-icon"
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {resetPasswordErrors.newPassword && <small className="field-error">{resetPasswordErrors.newPassword}</small>}
                    </div>
                  </div>

                  <button className="reset-password-save-btn" onClick={handleResetPassword}>RESET PASSWORD</button>

                  <a href="#" className="forgot-password-link">Forgot your password?</a>
                </>
              )}
            </div>
              </>
            )}

            {activeTab === 'cotravellers' && (
              <>
                {!showAddCoTraveller ? (
                  <>
                    <div className="cotravellers-header">
                      <h2 className="cotravellers-title">Co-Travellers</h2>
                      <button
                        className="add-cotraveller-btn"
                        onClick={() => {
                          setCoTravellerErrors({
                            firstName: '',
                            mobile: ''
                          });
                          setShowAddCoTraveller(true);
                        }}
                      >
                        + Add New Co-Traveller
                      </button>
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
                    
                      <div className="warning-icon">📋</div>
                      <p className="warning-text">
                        Please double check if your First and Last name, Gender & Date of Birth match your Govt. ID such as Aadhaar or Passport
                      </p>
                    

                    {/* General Information */}
                 
                      <h3 className="cotraveller-section-title">General Information</h3>
                      
                      <div className="cotraveller-form-grid">
                        <div className="cotraveller-form-group">
                          <label>FIRST & MIDDLE NAME <span className="required-asterisk">*</span></label>
                          <input 
                            type="text" 
                            placeholder="" 
                            className={coTravellerErrors.firstName ? 'field-has-error' : ''}
                            value={coTravellerForm.firstName}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCoTravellerForm({...coTravellerForm, firstName: value});
                              if (coTravellerErrors.firstName) {
                                setCoTravellerErrors((prev) => ({
                                  ...prev,
                                  firstName: validateFirstName(value)
                                }));
                              }
                            }}
                          />
                          {coTravellerErrors.firstName && (
                            <span className="field-error">{coTravellerErrors.firstName}</span>
                          )}
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

                      {/* Relationship Section
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
                      </div> */}

                    {/* Passport Details */}
                   
                      <div className="section-header">
                        <h3 className="cotraveller-section-title">Passport Details</h3>
                        <button
                          type="button"
                          className="section-accordion-toggle"
                          onClick={() => setIsCoTravellerPassportOpen((prev) => !prev)}
                          aria-label="Toggle Co-Traveller Passport Details"
                        >
                          {isCoTravellerPassportOpen ? '▾' : '▸'}
                        </button>
                      </div>

                      {isCoTravellerPassportOpen && (
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
                      )}
                   

                    {/* Contact Information */}
                    
                      <div className="section-header">
                        <h3 className="cotraveller-section-title">Add contact information to receive booking details & other alerts</h3>
                        <button
                          type="button"
                          className="section-accordion-toggle"
                          onClick={() => setIsCoTravellerContactOpen((prev) => !prev)}
                          aria-label="Toggle Co-Traveller Contact Information"
                        >
                          {isCoTravellerContactOpen ? '▾' : '▸'}
                        </button>
                      </div>

                      {isCoTravellerContactOpen && (
                        <div className="cotraveller-form-grid">
                          <div className="cotraveller-form-group phone-group">
                              <label>MOBILE NUMBER <span className="required-asterisk">*</span></label>
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
                                className={`phone-input ${coTravellerErrors.mobile ? 'field-has-error' : ''}`}
                                value={coTravellerForm.mobile}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setCoTravellerForm({...coTravellerForm, mobile: value});
                                  if (coTravellerErrors.mobile) {
                                    setCoTravellerErrors((prev) => ({
                                      ...prev,
                                      mobile: validateMobile(value)
                                    }));
                                  }
                                }}
                              />
                            </div>
                            {coTravellerErrors.mobile && (
                              <span className="field-error">{coTravellerErrors.mobile}</span>
                            )}
                          </div>
                        </div>
                      )}
                    
                  </>
                )}
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
