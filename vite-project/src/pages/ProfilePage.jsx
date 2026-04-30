import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import MyTripsNavbar from "../components/MyTripsNavbar";
import ProfileAvatar from "../components/ProfileAvatar";
import { logout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS, getAuthHeaders } from "../utils/api";
import { FaPhone, FaEnvelope, FaUser, FaUsers, FaSignOutAlt, FaTrash, FaPencilAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/ProfilePage.css";

const allCountries = Country.getAllCountries();
const countryOptions = allCountries.map((country) => ({
  isoCode: country.isoCode,
  name: country.name,
  phonecode: country.phonecode
}));

const normalizePhoneValue = (value = "") => String(value).replace(/\D/g, "");

const normalizeCountryCodeForForm = (value = "") => {
  const trimmedValue = String(value).trim();

  if (!trimmedValue) {
    return "";
  }

  const upperValue = trimmedValue.toUpperCase();
  if (allCountries.some((country) => country.isoCode === upperValue)) {
    return upperValue;
  }

  const dialCode = trimmedValue.replace(/^\+/, "");
  const byPhoneCode = allCountries.find((country) => country.phonecode === dialCode);
  if (byPhoneCode) {
    return byPhoneCode.isoCode;
  }

  const byName = allCountries.find((country) => country.name.toLowerCase() === trimmedValue.toLowerCase());
  return byName?.isoCode || "";
};

const normalizeStateCodeForForm = (value = "", countryCode = "") => {
  const trimmedValue = String(value).trim();

  if (!trimmedValue || !countryCode) {
    return "";
  }

  const states = State.getStatesOfCountry(countryCode);
  const upperValue = trimmedValue.toUpperCase();

  if (states.some((state) => state.isoCode === upperValue)) {
    return upperValue;
  }

  const byName = states.find((state) => state.name.toLowerCase() === trimmedValue.toLowerCase());
  return byName?.isoCode || "";
};

const getFilteredCityOptions = (cities = [], searchText = "") => {
  if (!searchText.trim()) {
    return cities.slice(0, 10);
  }

  const lowerSearch = searchText.toLowerCase();
  return cities.filter((city) => city.name.toLowerCase().includes(lowerSearch)).slice(0, 10);
};

function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const cityAutocompleteWrapperRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
  const [isDocumentsDetailsOpen, setIsDocumentsDetailsOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [showAddCoTraveller, setShowAddCoTraveller] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState('');
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
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstMiddleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    cityOfResidence: '',
    state: '',
    countryCode: '',
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
    countryCode: false,
    state: false,
    cityOfResidence: false,
    mobile: false
  });
  const [profileErrors, setProfileErrors] = useState({
    firstMiddleName: '',
    lastName: '',
    countryCode: '',
    state: '',
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
    mobile: normalizePhoneValue(traveller.mobile || ''),
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
    mobile: traveller.mobile ? `+${normalizePhoneValue(traveller.mobile)}` : '',
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

  const normalizeProfileFromApi = (profile = {}) => {
    const countryCode = normalizeCountryCodeForForm(profile.countryCode || profile.country || '');

    return {
      firstMiddleName: profile.firstMiddleName || '',
      lastName: profile.lastName || '',
      gender: profile.gender || '',
      dateOfBirth: toDateInputValue(profile.dateOfBirth),
      nationality: profile.nationality || '',
      cityOfResidence: profile.cityOfResidence || '',
      state: normalizeStateCodeForForm(profile.state || profile.stateName || '', countryCode),
      countryCode,
      mobile: normalizePhoneValue(profile.mobile || ''),
      passportNo: profile.passportNo || '',
      passportExpiryDate: toDateInputValue(profile.passportExpiryDate),
      passportIssuingCountry: profile.passportIssuingCountry || '',
      panCardNumber: profile.panCardNumber || ''
    };
  };

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

  const getProfileValidationErrors = ({ firstMiddleName, lastName, countryCode, state, cityOfResidence, isCitySelected, mobile }) => ({
    firstMiddleName: validateFirstName(firstMiddleName),
    lastName: validateLastName(lastName),
    countryCode: countryCode ? '' : 'Select Country',
    state: countryCode && !state ? 'Select State' : '',
    cityOfResidence: countryCode && state && (!cityOfResidence || !isCitySelected) ? 'Select a city from the list' : '',
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

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;

    setProfileTouched((prev) => ({
      ...prev,
      countryCode: true,
      state: false,
      cityOfResidence: false
    }));
    setProfileForm((prev) => ({
      ...prev,
      countryCode: selectedCountry,
      state: '',
      cityOfResidence: ''
    }));
    setCities([]);
    setFilteredCities([]);
    setCityInput('');
    setSelectedCity('');
    setShowCityDropdown(false);
    setIsCitySelected(false);
    setProfileErrors((prev) => ({
      ...prev,
      countryCode: selectedCountry ? '' : prev.countryCode,
      state: '',
      cityOfResidence: ''
    }));
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;

    setProfileTouched((prev) => ({ ...prev, state: true, cityOfResidence: false }));
    setProfileForm((prev) => ({ ...prev, state: selectedState, cityOfResidence: '' }));
    setCityInput('');
    setSelectedCity('');
    setShowCityDropdown(false);
    setIsCitySelected(false);
    setProfileErrors((prev) => ({
      ...prev,
      state: selectedState ? '' : prev.state,
      cityOfResidence: ''
    }));
  };

  const handleCityFocus = () => {
    setProfileTouched((prev) => ({ ...prev, cityOfResidence: true }));

    if (!profileForm.countryCode) {
      setProfileErrors((prev) => ({
        ...prev,
        cityOfResidence: 'Select Country first'
      }));
      return;
    }

    if (!profileForm.state) {
      setProfileErrors((prev) => ({
        ...prev,
        cityOfResidence: 'Select State first'
      }));
      return;
    }

    if (filteredCities.length > 0) {
      setShowCityDropdown(true);
    }
  };

  const handleCityChange = (event) => {
    if (!profileForm.countryCode) {
      setProfileErrors((prev) => ({
        ...prev,
        cityOfResidence: 'Select Country first'
      }));
      return;
    }

    const typedValue = event.target.value;

    setCityInput(typedValue);
    setProfileForm((prev) => ({ ...prev, cityOfResidence: typedValue }));
    setSelectedCity('');
    setIsCitySelected(false);
    setFilteredCities(getFilteredCityOptions(cities, typedValue));
    setShowCityDropdown(Boolean(typedValue.trim()));

    if (profileTouched.cityOfResidence) {
      setProfileErrors((prev) => ({
        ...prev,
        cityOfResidence: profileForm.state ? 'Select a city from the list' : 'Select State first'
      }));
    }
  };

  const handleCitySelect = (cityName) => {
    setCityInput(cityName);
    setSelectedCity(cityName);
    setProfileForm((prev) => ({ ...prev, cityOfResidence: cityName }));
    setIsCitySelected(true);
    setShowCityDropdown(false);
    setProfileErrors((prev) => ({
      ...prev,
      cityOfResidence: ''
    }));
  };

  const handleCityBlur = () => {
    window.setTimeout(() => {
      setShowCityDropdown(false);
      setProfileTouched((prev) => ({ ...prev, cityOfResidence: true }));

      if (!profileForm.countryCode) {
        setProfileErrors((prev) => ({
          ...prev,
          cityOfResidence: 'Select Country first'
        }));
        return;
      }

      if (!profileForm.state) {
        setProfileErrors((prev) => ({
          ...prev,
          cityOfResidence: 'Select State first'
        }));
        return;
      }

      setProfileErrors((prev) => ({
        ...prev,
        cityOfResidence: selectedCity && cityInput === selectedCity ? '' : 'Select a city from the list'
      }));
    }, 120);
  };

  const handleMobileChange = (value) => {
    const normalizedValue = normalizePhoneValue(value);
    setPhoneNumber(normalizedValue);

    if (profileTouched.mobile) {
      setProfileErrors((prev) => ({ ...prev, mobile: validateMobile(normalizedValue) }));
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
          method: 'GET',
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          setPhoneNumber(normalizePhoneValue(currentUser?.mobile || ''));
          return;
        }

        const result = await response.json();
        if (!result.success || !result.data) {
          setPhoneNumber(normalizePhoneValue(currentUser?.mobile || ''));
          return;
        }

        const normalizedProfile = normalizeProfileFromApi(result.data.profile || {});
        setProfileForm(normalizedProfile);
        setPhoneNumber(normalizePhoneValue(normalizedProfile.mobile || currentUser?.mobile || ''));
        setCityInput(normalizedProfile.cityOfResidence || '');
        setSelectedCity(normalizedProfile.cityOfResidence || '');
        setIsCitySelected(Boolean(normalizedProfile.cityOfResidence));
        setSavedCoTravellers((result.data.coTravellers || []).map(mapApiCoTravellerToForm));
        
        // Load avatar URL from profile
        if (result.data.profile?.avatarUrl) {
          setAvatarUrl(result.data.profile.avatarUrl);
          updateUser?.({ avatarUrl: result.data.profile.avatarUrl, avatar_url: result.data.profile.avatarUrl });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setPhoneNumber(normalizePhoneValue(currentUser?.mobile || ''));
      }
    };

    loadProfile();
  }, [currentUser]);

  useEffect(() => {
    if (!profileForm.countryCode || !profileForm.state) {
      setCities([]);
      setFilteredCities([]);
      setShowCityDropdown(false);
      return;
    }

    const stateCities = City.getCitiesOfState(profileForm.countryCode, profileForm.state) || [];
    setCities(stateCities);
    setFilteredCities(getFilteredCityOptions(stateCities, cityInput));
  }, [profileForm.countryCode, profileForm.state, cityInput]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!cityAutocompleteWrapperRef.current?.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
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
    const normalizedMobile = normalizePhoneValue(phoneNumber);
    const normalizedProfile = {
      ...profileForm,
      firstMiddleName: profileForm.firstMiddleName.trim(),
      lastName: profileForm.lastName.trim(),
      cityOfResidence: selectedCity,
      mobile: normalizedMobile
    };

    const validationErrors = getProfileValidationErrors({
      firstMiddleName: normalizedProfile.firstMiddleName,
      lastName: normalizedProfile.lastName,
      countryCode: normalizedProfile.countryCode,
      state: normalizedProfile.state,
      cityOfResidence: normalizedProfile.cityOfResidence,
      isCitySelected,
      mobile: normalizedProfile.mobile
    });

    setProfileTouched({
      firstMiddleName: true,
      lastName: true,
      countryCode: true,
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
        cityOfResidence: normalizedProfile.cityOfResidence,
        state: profileForm.state,
        country: normalizedProfile.countryCode,
        countryCode: profileForm.countryCode,
        phone: normalizedMobile ? `+${normalizedMobile}` : '',
        mobile: normalizedMobile ? `+${normalizedMobile}` : '',
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
      setPhoneNumber(normalizePhoneValue(updatedProfile.mobile || ''));
      setCityInput(updatedProfile.cityOfResidence || '');
      setSelectedCity(updatedProfile.cityOfResidence || '');
      setIsCitySelected(Boolean(updatedProfile.cityOfResidence));
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
                    {countryOptions.map((country) => (
                      <option key={country.isoCode} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                
                
                
                
                <div className="form-group" ref={cityAutocompleteWrapperRef}>
                  <label>CITY OF RESIDENCE <span className="required-asterisk">*</span></label>
                  <input
                    className={profileErrors.cityOfResidence ? 'field-has-error' : ''}
                    value={cityInput}
                    onFocus={handleCityFocus}
                    onChange={handleCityChange}
                    onBlur={handleCityBlur}
                    placeholder="Enter City"
                    disabled={!profileForm.countryCode || !profileForm.state}
                    autoComplete="off"
                  />
                  {showCityDropdown && profileForm.countryCode && profileForm.state && (
                    <div className="city-suggestions-dropdown">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <button
                            key={`${city.countryCode}-${city.stateCode}-${city.name}`}
                            type="button"
                            className="city-suggestion-item"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              handleCitySelect(city.name);
                            }}
                          >
                            {city.name}
                          </button>
                        ))
                      ) : (
                        <div className="city-no-results">No results found</div>
                      )}
                    </div>
                  )}
                  {profileErrors.cityOfResidence && <small className="field-error">{profileErrors.cityOfResidence}</small>}
                </div>
                
                <div className="form-group full-width">
                  <label>COUNTRY <span className="required-asterisk">*</span></label>
                  <select
                    className={profileErrors.countryCode ? 'field-has-error profile-country-select' : 'profile-country-select'}
                    value={profileForm.countryCode}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select Country</option>
                    {countryOptions.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {profileErrors.countryCode && <small className="field-error">{profileErrors.countryCode}</small>}
                </div>

                <div className="form-group full-width">
                  <label>STATE <span className="required-asterisk">*</span></label>
                  <select
                    className={profileErrors.state ? 'field-has-error profile-state-select' : 'profile-state-select'}
                    value={profileForm.state}
                    onChange={handleStateChange}
                    disabled={!profileForm.countryCode}
                  >
                    <option value="">Select State</option>
                    {State.getStatesOfCountry(profileForm.countryCode).map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {profileErrors.state && <small className="field-error">{profileErrors.state}</small>}
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
                      <div className={`phone-input-shell ${profileErrors.mobile ? 'field-has-error' : ''}`}>
                        <PhoneInput
                          country="in"
                          value={phoneNumber}
                          onChange={handleMobileChange}
                          onBlur={handleMobileBlur}
                          enableSearch
                          inputProps={{
                            name: 'mobile',
                            required: true,
                            placeholder: 'Enter phone number',
                            autoComplete: 'tel'
                          }}
                          inputClass="profile-phone-input"
                          containerClass="profile-phone-container"
                          buttonClass="profile-phone-country-button"
                          dropdownClass="profile-phone-dropdown"
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
                        {countryOptions.map((country) => (
                          <option key={country.isoCode} value={country.name}>
                            {country.name}
                          </option>
                        ))}
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
                            {countryOptions.map((country) => (
                              <option key={country.isoCode} value={country.name}>
                                {country.name}
                              </option>
                            ))}
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
                              {countryOptions.map((country) => (
                                <option key={country.isoCode} value={country.name}>
                                  {country.name}
                                </option>
                              ))}
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
                            <PhoneInput
                              country="in"
                              value={coTravellerForm.mobile}
                              onChange={(value) => {
                                setCoTravellerForm({ ...coTravellerForm, mobile: normalizePhoneValue(value) });
                                if (coTravellerErrors.mobile) {
                                  setCoTravellerErrors((prev) => ({
                                    ...prev,
                                    mobile: validateMobile(normalizePhoneValue(value))
                                  }));
                                }
                              }}
                              inputProps={{
                                name: 'cotraveller-mobile',
                                required: true,
                                placeholder: 'Enter phone number',
                                autoComplete: 'tel'
                              }}
                              inputClass="cotraveller-phone-input"
                              containerClass="cotraveller-phone-container"
                              buttonClass="cotraveller-phone-country-button"
                              dropdownClass="cotraveller-phone-dropdown"
                            />
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
