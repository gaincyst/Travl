import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaHotel,
  FaBus,
  FaMoon,
  FaSun,
  FaThLarge,
  FaUserCircle, FaChevronLeft, FaChevronRight, FaArrowUp, FaArrowDown,
  FaLock, FaSuitcase, FaUtensils, FaSignOutAlt, FaUser, FaTachometerAlt
} from "react-icons/fa";

import FiltersPanel from "./FiltersPanel";
import DatePriceStrip from "./DatePriceStrip";
import DualDatePriceStrip from "./DualDatePriceStrip";
import SearchBox from "./SearchBox";
import AuthModal from "./AuthModal";
import FlightBookingPanel from "./FlightBookingPanel";
import RoundTripSummaryBar from "./RoundTripSummaryBar";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../utils/api";
import "../styles/FlightResults.css";

function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};
  
  // Check if trip is round trip
  const isRoundTrip = searchData.tripType === "roundTrip";

  const [flightData, setFlightData] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState(null);
  const [filtersState, setFiltersState] = useState(null);
  const [dateStripOutbound, setDateStripOutbound] = useState([]);
  const [dateStripReturn, setDateStripReturn] = useState([]);
  const [selectedDepartureDateKey, setSelectedDepartureDateKey] = useState(null);
  const [selectedReturnDateKey, setSelectedReturnDateKey] = useState(null);

  // ✅ FIX 1: dark mode state added
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const { isLoggedIn, currentUser, refreshAuth, logoutUser } = useAuth();

  // State for selected flights in round trip
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  // Fare Modal State
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [selectedFlightData, setSelectedFlightData] = useState(null);
  const [selectedOnewayFare, setSelectedOnewayFare] = useState(null);

  // Round Trip Fare Modal State
  const [isRoundTripFareModalOpen, setIsRoundTripFareModalOpen] = useState(false);
  const [roundTripFareTab, setRoundTripFareTab] = useState('departure');
  const [selectedDepartureFare, setSelectedDepartureFare] = useState(null);
  const [selectedReturnFare, setSelectedReturnFare] = useState(null);

  // Flight Booking Panel State
  const [isBookingPanelOpen, setIsBookingPanelOpen] = useState(false);
  const [bookingFlightData, setBookingFlightData] = useState(null);

  // Sorting state management - 3 states: null (no sort), 'asc', 'desc'
  const [sortStates, setSortStates] = useState({
    price: null,
    fastest: null,
    departure: null,
    smart: 'active'
  });

  // Separate sorting states for Round Trip
  const [outboundSortStates, setOutboundSortStates] = useState({
    price: null,
    fastest: null,
    departure: null,
    smart: 'active'
  });

  const [returnSortStates, setReturnSortStates] = useState({
    price: null,
    fastest: null,
    departure: null,
    smart: 'active'
  });

  const toggleSort = (sortKey) => {
    setSortStates(prev => {
      if (sortKey === 'smart') {
        return {
          price: null,
          fastest: null,
          departure: null,
          smart: 'active'
        };
      }

      const currentState = prev[sortKey];
      let newState;

      if (currentState === null) {
        newState = 'asc';
      } else if (currentState === 'asc') {
        newState = 'desc';
      } else {
        newState = null;
      }

      return {
        price: null,
        fastest: null,
        departure: null,
        smart: null,
        [sortKey]: newState
      };
    });
  };

  const toggleOutboundSort = (sortKey) => {
    setOutboundSortStates(prev => {
      if (sortKey === 'smart') {
        return {
          price: null,
          fastest: null,
          departure: null,
          smart: 'active'
        };
      }

      const currentState = prev[sortKey];
      let newState;

      if (currentState === null) {
        newState = 'asc';
      } else if (currentState === 'asc') {
        newState = 'desc';
      } else {
        newState = null;
      }

      return {
        price: null,
        fastest: null,
        departure: null,
        smart: null,
        [sortKey]: newState
      };
    });
  };

  const toggleReturnSort = (sortKey) => {
    setReturnSortStates(prev => {
      if (sortKey === 'smart') {
        return {
          price: null,
          fastest: null,
          departure: null,
          smart: 'active'
        };
      }

      const currentState = prev[sortKey];
      let newState;

      if (currentState === null) {
        newState = 'asc';
      } else if (currentState === 'asc') {
        newState = 'desc';
      } else {
        newState = null;
      }

      return {
        price: null,
        fastest: null,
        departure: null,
        smart: null,
        [sortKey]: newState
      };
    });
  };

  const getSortLabel = (sortKey, state) => {
    if (state === null) {
      return {
        price: 'Low to High',
        fastest: 'Shortest First',
        departure: 'Earliest First'
      }[sortKey];
    }
    if (state === 'asc') {
      return {
        price: 'High to Low',
        fastest: 'Shortest First',
        departure: 'Earliest First'
      }[sortKey];
    }
    return {
      price: 'Low to High',
      fastest: 'Longest First',
      departure: 'Latest First'
    }[sortKey];
  };

  const handleDateStripSelect = (dateKey) => {
    if (!dateKey || dateKey === selectedDepartureDateKey) return;
    setSelectedDepartureDateKey(dateKey);
  };

  const handleReturnDateStripSelect = (dateKey) => {
    if (!dateKey || dateKey === selectedReturnDateKey) return;
    setSelectedReturnDateKey(dateKey);
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-theme");
  };

  const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

  const formatDateKey = (value) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setSelectedDepartureDateKey(formatDateKey(searchData.startDate));
  }, [searchData.startDate]);

  useEffect(() => {
    setSelectedReturnDateKey(formatDateKey(searchData.returnDate));
  }, [searchData.returnDate]);

  const formatStripLabel = (dateValue) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  const buildDateRange = (baseDate, days) => {
    const list = [];
    for (let i = 0; i < days; i += 1) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      list.push(date);
    }
    return list;
  };

  const buildStripPlaceholders = (baseDate, days) =>
    buildDateRange(baseDate, days).map((dateValue) => ({
      key: formatDateKey(dateValue) || formatStripLabel(dateValue),
      label: formatStripLabel(dateValue),
      price: null
    }));

  const fetchDateStripPrices = async ({ fromCode, toCode, baseDate, days, setState }) => {
    const dateRange = buildDateRange(baseDate, days);

    const items = await Promise.all(dateRange.map(async (dateValue) => {
      const dateKey = formatDateKey(dateValue);
      const label = formatStripLabel(dateValue);

      if (!dateKey) {
        return { key: label, label, price: null };
      }

      try {
        const response = await fetch(
          `${API_ENDPOINTS.FLIGHTS_SEARCH}?from=${encodeURIComponent(fromCode)}&to=${encodeURIComponent(toCode)}&tripType=oneWay&date=${dateKey}`
        );
        const payload = await response.json();
        const flights = payload?.data?.flights || payload?.data?.outbound || [];
        const minPrice = flights.reduce((min, flight) => {
          const value = Number(flight.price);
          if (!value || Number.isNaN(value)) return min;
          return min === null || value < min ? value : min;
        }, null);

        return { key: dateKey, label, price: minPrice };
      } catch (error) {
        console.error('Date strip price error:', error);
        return { key: dateKey, label, price: null };
      }
    }));

    setState(items);
  };

  const parsePriceValue = (priceString) => {
    if (!priceString) return 0;
    return parseInt(String(priceString).replace(/[^0-9]/g, ""), 10) || 0;
  };

  const formatDuration = (minutes) => {
    const total = Number(minutes) || 0;
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timeValue) => {
    if (!timeValue) return "";
    const parts = String(timeValue).split(":");
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  };

  const buildDateTime = (baseDate, timeValue) => {
    const date = baseDate ? new Date(baseDate) : new Date();
    const [hours, minutes] = formatTime(timeValue).split(":").map(Number);
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date;
  };

  const formatDateLabel = (date) => date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formatDateTimeLabel = (date) => `${formatDateLabel(date)} at ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })}`;

  const parseTimeToMinutes = (timeValue) => {
    if (!timeValue) return 0;
    const [hours, minutes] = formatTime(timeValue).split(":").map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };

  const mapFareOptions = (options) =>
    (options || []).map((option) => ({
      fareName: option.fare_name,
      price: Number(option.price),
      refundable: option.refundable === 1,
      freeMeals: option.free_meals === 1,
      freeSeats: option.free_seats === 1,
      cancellationFee: option.cancellation_fee,
      dateChangeFee: option.date_change_fee,
      refundType: option.refund_type,
      refundAmount: option.refund_amount
    }));

  const mapSegments = (segments) =>
    (segments || []).map((segment) => ({
      fromAirport: segment.from_airport,
      toAirport: segment.to_airport,
      fromCity: segment.from_city,
      toCity: segment.to_city,
      fromAirportName: segment.from_airport_name,
      toAirportName: segment.to_airport_name,
      departureTime: formatTime(segment.departure_time),
      arrivalTime: formatTime(segment.arrival_time),
      durationMinutes: segment.duration,
      layoverMinutes: segment.layover_time,
      aircraft: segment.aircraft,
      terminal: segment.terminal
    }));

  const mapFlightCard = (flight, baseDate) => {
    const departureDateTime = buildDateTime(baseDate, flight.departure_time);
    const arrivalDateTime = new Date(departureDateTime.getTime() + (Number(flight.duration) || 0) * 60000);
    const segments = mapSegments(flight.segments);
    const fareOptions = mapFareOptions(flight.fare_options).sort((a, b) => a.price - b.price);
    const baseFare = Math.max(0, Math.round(Number(flight.price) * 0.84));
    const taxes = Math.max(0, Number(flight.price) - baseFare);
    const lockPrice = Math.max(199, Math.round(Number(flight.price) * 0.12));
    const departureTerminal = segments[0]?.terminal ? `Terminal: ${segments[0].terminal}` : 'Terminal: 1';
    const arrivalTerminal = segments.length
      ? `Terminal: ${segments[segments.length - 1].terminal || '1'}`
      : 'Terminal: 1';

    const stopsCount = Number(flight.stops) || 0;
    const stopsLabel = stopsCount === 0 ? 'Non Stop' : `${stopsCount} Stop${stopsCount > 1 ? 's' : ''}`;

    return {
      id: flight.id,
      airline: flight.airline_name,
      airlineLogo: flight.logo,
      flightCode: flight.flight_number,
      flightNumber: flight.flight_number,
      departureTime: formatTime(flight.departure_time),
      arrivalTime: formatTime(flight.arrival_time),
      departureLocation: flight.from_airport,
      arrivalLocation: flight.to_airport,
      departureCity: flight.from_city,
      arrivalCity: flight.to_city,
      departureTerminal,
      arrivalTerminal,
      departureDate: formatDateTimeLabel(departureDateTime),
      arrivalDate: formatDateTimeLabel(arrivalDateTime),
      duration: formatDuration(flight.duration),
      durationMinutes: Number(flight.duration) || 0,
      departureMinutes: parseTimeToMinutes(flight.departure_time),
      stops: stopsLabel,
      stopsCount,
      price: formatCurrency(flight.price),
      lockPrice: formatCurrency(lockPrice),
      offers: Number(flight.price) > 15000 ? '700 Off' : '+ 150 💳',
      refundable: flight.refundable === 1,
      layout: segments[0]?.aircraft || '3-3 Layout',
      beverage: flight.refundable === 1 ? 'Complimentary Beverage' : 'Beverage Available',
      baseFare,
      taxes,
      seatsLeft: flight.seats_left,
      segments,
      fareOptions
    };
  };

  const applyFilters = (flights, journeyType = 'onward') => {
    if (!filtersState) return flights;

    const popularFilters = filtersState.popularFilters || {};
    const journeyStops = journeyType === 'return'
      ? filtersState.returnJourney?.stops
      : filtersState.onwardJourney?.stops;

    const allowNonStop = journeyStops?.nonStop ?? popularFilters.nonStop;
    const allowOneStop = journeyStops?.oneStop ?? popularFilters.oneStop;

    return flights.filter((flight) => {
      if (popularFilters.refundableFares && !flight.refundable) {
        return false;
      }

      if (filtersState.priceTouched && parsePriceValue(flight.price) > filtersState.priceRange) {
        return false;
      }

      if (allowNonStop || allowOneStop) {
        if (allowNonStop && !allowOneStop && flight.stopsCount !== 0) return false;
        if (allowOneStop && !allowNonStop && flight.stopsCount !== 1) return false;
      }

      return true;
    });
  };

  const applySort = (flights, sortState) => {
    const list = [...flights];

    if (sortState.smart === 'active') {
      return list.sort((a, b) => {
        const scoreA = parsePriceValue(a.price) * 0.6 + a.durationMinutes * 1.5 + a.stopsCount * 2000;
        const scoreB = parsePriceValue(b.price) * 0.6 + b.durationMinutes * 1.5 + b.stopsCount * 2000;
        return scoreA - scoreB;
      });
    }

    if (sortState.price) {
      return list.sort((a, b) => sortState.price === 'asc'
        ? parsePriceValue(a.price) - parsePriceValue(b.price)
        : parsePriceValue(b.price) - parsePriceValue(a.price)
      );
    }

    if (sortState.fastest) {
      return list.sort((a, b) => sortState.fastest === 'asc'
        ? a.durationMinutes - b.durationMinutes
        : b.durationMinutes - a.durationMinutes
      );
    }

    if (sortState.departure) {
      return list.sort((a, b) => sortState.departure === 'asc'
        ? a.departureMinutes - b.departureMinutes
        : b.departureMinutes - a.departureMinutes
      );
    }

    return list;
  };

  const buildRoundTripPairs = (outbound, returns) => {
    if (!outbound.length || !returns.length) return [];
    const maxLen = Math.max(outbound.length, returns.length);
    return Array.from({ length: maxLen }, (_, index) => ({
      ...outbound[index % outbound.length],
      returnFlight: returns[index % returns.length]
    }));
  };

  // Open Fare Modal
  const openFareModal = (flight) => {
    setSelectedFlightData(flight);
    setSelectedOnewayFare(flight?.fareOptions?.[0] || null);
    setIsFareModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close Fare Modal
  const closeFareModal = () => {
    setIsFareModalOpen(false);
    setSelectedFlightData(null);
    setSelectedOnewayFare(null);
    document.body.style.overflow = 'auto';
  };

  // Open Booking Panel
  const openBookingPanel = (flight, fareOption = null) => {
    const finalPrice = fareOption ? formatCurrency(fareOption.price) : flight.price;
    const selectedFareName = fareOption?.fareName || flight.selectedFareType || 'Saver';

    // Add passenger counts from searchData to flight data
    const flightWithTravellers = {
      ...flight,
      price: finalPrice,
      selectedFareType: selectedFareName,
      selectedFareDetails: fareOption || null,
      adults: searchData.adults || 1, // Default to 1 if not specified
      children: searchData.children || 0,
      infants: searchData.infants || 0
    };
    setBookingFlightData(flightWithTravellers);
    setIsBookingPanelOpen(true);
    setIsFareModalOpen(false); // Close fare modal if open
    document.body.style.overflow = 'hidden';
  };

  // Close Booking Panel
  const closeBookingPanel = () => {
    setIsBookingPanelOpen(false);
    setBookingFlightData(null);
    document.body.style.overflow = 'auto';
  };
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Width of one card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, []);

  useEffect(() => {
    const fetchFlights = async () => {
      const fromCode = searchData.fromCode || searchData.fromAirport?.code || searchData.fromCity;
      const toCode = searchData.toCode || searchData.toAirport?.code || searchData.toCity;
      const formatSearchDate = (value) => {
        if (!value) return null;
        const dateObj = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(dateObj.getTime())) return null;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      if (!fromCode || !toCode) {
        setFlightData([]);
        setReturnFlights([]);
        return;
      }

      setFlightLoading(true);
      setFlightError(null);

      try {
        const tripTypeParam = isRoundTrip ? 'roundTrip' : 'oneWay';
        const travelDate = selectedDepartureDateKey || formatSearchDate(searchData.startDate);
        const returnDate = selectedReturnDateKey || formatSearchDate(searchData.returnDate);
        const queryParams = new URLSearchParams({
          from: fromCode,
          to: toCode,
          tripType: tripTypeParam
        });

        if (travelDate) {
          queryParams.set('date', travelDate);
        }

        if (isRoundTrip && returnDate) {
          queryParams.set('returnDate', returnDate);
        }

        const response = await fetch(
          `${API_ENDPOINTS.FLIGHTS_SEARCH}?${queryParams.toString()}`
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || 'Failed to load flights');
        }

        const outboundRaw = payload?.data?.flights || payload?.data?.outbound || [];
        const returnRaw = payload?.data?.return || [];
        const departureDate = travelDate ? new Date(travelDate)
          : (searchData.startDate ? new Date(searchData.startDate) : new Date());
        const returnDateValue = returnDate ? new Date(returnDate)
          : (searchData.returnDate ? new Date(searchData.returnDate) : departureDate);

        const mappedOutbound = outboundRaw.map((flight) => mapFlightCard(flight, departureDate));
        const mappedReturn = returnRaw.map((flight) => mapFlightCard(flight, returnDateValue));

        const cheapestPrice = mappedOutbound.reduce((min, flight) => {
          const price = parsePriceValue(flight.price);
          return min === null || price < min ? price : min;
        }, null);

        const outboundWithBadges = mappedOutbound.map((flight) => ({
          ...flight,
          badge: cheapestPrice !== null && parsePriceValue(flight.price) === cheapestPrice ? 'Cheapest' : ''
        }));

        setFlightData(outboundWithBadges);
        setReturnFlights(mappedReturn);
        setSelectedOutbound(null);
        setSelectedReturn(null);
      } catch (error) {
        console.error('Flight fetch error:', error);
        setFlightError(error.message || 'Failed to load flights');
        setFlightData([]);
        setReturnFlights([]);
      } finally {
        setFlightLoading(false);
      }
    };

    fetchFlights();
  }, [searchData, isRoundTrip, selectedDepartureDateKey, selectedReturnDateKey]);

  useEffect(() => {
    const fromCode = searchData.fromCode || searchData.fromAirport?.code || searchData.fromCity;
    const toCode = searchData.toCode || searchData.toAirport?.code || searchData.toCity;

    if (!fromCode || !toCode) {
      setDateStripOutbound([]);
      setDateStripReturn([]);
      return;
    }

    const baseDepartureDate = searchData.startDate ? new Date(searchData.startDate) : new Date();
    const baseReturnDate = searchData.returnDate
      ? new Date(searchData.returnDate)
      : baseDepartureDate;
    const dayCount = 7;

    setDateStripOutbound(buildStripPlaceholders(baseDepartureDate, dayCount));
    fetchDateStripPrices({
      fromCode,
      toCode,
      baseDate: baseDepartureDate,
      days: dayCount,
      setState: setDateStripOutbound
    });

    if (isRoundTrip) {
      setDateStripReturn(buildStripPlaceholders(baseReturnDate, dayCount));
      fetchDateStripPrices({
        fromCode: toCode,
        toCode: fromCode,
        baseDate: baseReturnDate,
        days: dayCount,
        setState: setDateStripReturn
      });
    } else {
      setDateStripReturn([]);
    }
  }, [searchData.fromCode, searchData.toCode, searchData.fromAirport, searchData.toAirport, searchData.fromCity, searchData.toCity, searchData.startDate, searchData.returnDate, isRoundTrip]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    logoutUser();
    setShowProfileDropdown(false);
    navigate("/");
  };

  const handleAuthSuccess = () => {
    refreshAuth();
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const getGradientStyle = (name) => {
    const charCode = name ? name.charCodeAt(0) : 85;
    const hue = (charCode * 137.508) % 360;
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 60%))`
    };
  };

  const offers = [
    { id: 1, logo: "/banks/b1.png", title: "Up to 10,000 Off", sub: "with ICICI Bank Credit Card EMI", bgColor: "#fff3e6" },
    { id: 2, logo: "/banks/b2.png", title: "Up to 12% Off", sub: "with RBL Bank Credit Card EMI", bgColor: "#f0f2ff" },
    { id: 3, logo: "/banks/b3.png", title: "Get Flat 10% Off", sub: "with AU Bank Credit Card", bgColor: "#ffefd5" },
    { id: 4, logo: "/banks/b4.png", title: "Flat 10% Off", sub: "with Kotak Retail Credit Card EMI", bgColor: "#fff9e6" }
  ];

  const [selectedFare, setSelectedFare] = useState(null);
  const [openFlightDetails, setOpenFlightDetails] = useState({});
  const [activeTab, setActiveTab] = useState({});

  const toggleFlightDetails = (cardId) => {
    setOpenFlightDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
    if (!activeTab[cardId]) {
      setActiveTab(prev => ({
        ...prev,
        [cardId]: 'flight-info'
      }));
    }
  };

  const handleTabChange = (cardId, tab) => {
    setActiveTab(prev => ({
      ...prev,
      [cardId]: tab
    }));
  };

  const fareOptions = ["Student", "Senior Citizen", "Armed Forces"];

  const filteredOutboundFlights = applyFilters(flightData, 'onward');
  const filteredReturnFlights = applyFilters(returnFlights, 'return');
  const sortedOutboundFlights = applySort(
    filteredOutboundFlights,
    isRoundTrip ? outboundSortStates : sortStates
  );
  const sortedReturnFlights = applySort(filteredReturnFlights, returnSortStates);
  const displayFlights = isRoundTrip
    ? buildRoundTripPairs(sortedOutboundFlights, sortedReturnFlights)
    : sortedOutboundFlights;

  // Handlers for round trip selection
  const handleOutboundSelect = (flight) => {
    setSelectedOutbound(flight);
  };

  const handleReturnSelect = (flight) => {
    setSelectedReturn(flight);
  };

  const handleSummaryBookNow = () => {
    if (selectedOutbound && selectedReturn) {
      // Open round trip fare modal instead of directly opening booking panel
      setSelectedDepartureFare(selectedOutbound?.fareOptions?.[0] || null);
      setSelectedReturnFare(selectedReturn?.returnFlight?.fareOptions?.[0] || null);
      setIsRoundTripFareModalOpen(true);
      setRoundTripFareTab('departure'); // Default to departure tab
      document.body.style.overflow = 'hidden';
    }
  };

  // Close Round Trip Fare Modal
  const closeRoundTripFareModal = () => {
    setIsRoundTripFareModalOpen(false);
    setSelectedDepartureFare(null);
    setSelectedReturnFare(null);
    document.body.style.overflow = 'auto';
  };

  // Open Booking Panel from Round Trip Fare Modal
  const openBookingPanelFromRoundTrip = () => {
    const defaultDepartureFare = selectedOutbound?.fareOptions?.[0] || null;
    const defaultReturnFare = selectedReturn?.returnFlight?.fareOptions?.[0] || null;
    const chosenDeparture = selectedDepartureFare || defaultDepartureFare;
    const chosenReturn = selectedReturnFare || defaultReturnFare;

    const selectedDeparturePrice = chosenDeparture?.price || parsePriceValue(selectedOutbound?.price);
    const selectedReturnPrice = chosenReturn?.price || parsePriceValue(selectedReturn?.returnFlight?.price);
    
    const combinedFlightData = {
      ...selectedOutbound,
      price: `₹${selectedDeparturePrice.toLocaleString('en-IN')}`,
      selectedFareType: chosenDeparture?.fareName || 'Saver',
      selectedFareDetails: chosenDeparture || null,
      returnFlight: {
        ...selectedReturn.returnFlight,
        price: `₹${selectedReturnPrice.toLocaleString('en-IN')}`,
        selectedFareType: chosenReturn?.fareName || 'Saver',
        selectedFareDetails: chosenReturn || null
      },
      adults: searchData.adults || 1,
      children: searchData.children || 0,
      infants: searchData.infants || 0,
      isRoundTrip: true
    };
    setIsRoundTripFareModalOpen(false);
    openBookingPanel(combinedFlightData);
  };


  return (
    <div className="flight-results-page">
      {/* NAVBAR */}
      <nav className="minimal-navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="logo-container">
            <img
              src="/logos.png"   /* ✅ public folder image */
              alt="Travl Logo"
              className="nav-logo"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Menu */}
          <ul className="nav-menu">
            <li className="active">
              <FaPlane className="menu-icon" /> Flights
            </li>
            <li onClick={() => navigate("/", { state: { searchBoxType: "hotel" } })}>
              <FaHotel className="menu-icon" /> Hotels
            </li>
            <li onClick={() => navigate("/", { state: { searchBoxType: "bus" } })}>
              <FaBus className="menu-icon" /> Buses
            </li>
            <li>
              <FaThLarge className="menu-icon" /> More
            </li>
          </ul>

          {/* Right section */}
          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? <FaSun className="sun-icon" /> : <FaMoon className="moon-icon" />}
            </button>

            {isLoggedIn && currentUser ? (
              <div className="profile-avatar-container" ref={profileDropdownRef}>
                <Avatar
                  user={currentUser}
                  size="medium"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                />

                {showProfileDropdown && (
                  <div className="profile-dropdown-menu">
                    <div className="profile-menu-item" onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}>
                      <FaUser className="profile-menu-icon" />
                      <span>My Profile</span>
                    </div>
                    <div className="profile-menu-item" onClick={() => { setShowProfileDropdown(false); navigate('/dashboard'); }}>
                      <FaTachometerAlt className="profile-menu-icon" />
                      <span>Dashboard</span>
                    </div>
                    <div className="profile-menu-item logout-item" onClick={handleLogout}>
                      <FaSignOutAlt className="profile-menu-icon" />
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="login-signup" onClick={() => setShowAuthModal(true)} style={{ cursor: "pointer" }}>
                <FaUserCircle className="user-login-icon" />
                <span>Login / Signup</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="results-hero">
        <div className="hero-content">
          <h1>Flight</h1>
          <nav className="breadcrumb">
            <span>Home</span> &gt; <span>Flight</span> &gt;{" "}
            <span className="current">Flight Grid</span>
          </nav>
        </div>
      </header>

      {/* SEARCH BOX */}
      <section className="search-section-container">
        <SearchBox preFilledData={searchData} 
        hideServiceTabs={true}
        hideTripType={true}
        />
      </section>

     {/* 4. OFFERS SECTION */}
      <section className="offers-carousel-container">
        {showLeftArrow && (
          <button className="carousel-arrow left" onClick={() => scroll("left")}>
            <FaChevronLeft />
          </button>
        )}
        
        <div className="offers-scroll-wrapper" ref={scrollRef} onScroll={checkArrows}>
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card" style={{ backgroundColor: offer.bgColor }}>
              <div className="offer-logo-circle">
                <img src={offer.logo} alt="Bank Logo" />
              </div>
              <div className="offer-details">
                <span className="offer-title">{offer.title}</span>
                <span className="offer-subtitle">{offer.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button className="carousel-arrow right" onClick={() => scroll("right")}>
            <FaChevronRight />
          </button>
        )}
      </section>
      {/* 5. SPECIAL FARES SECTION */}
      <section className="special-fares-container">
  <div className="special-fares-content">
    <span className="special-fares-label">Special Fares (Optional) :</span>
    <div className="fare-pills-wrapper">
      {fareOptions.map((fare) => (
        <div 
          key={fare}
          className={`fare-pill ${selectedFare === fare ? 'active' : ''}`}
          onClick={() => setSelectedFare(fare)}
        >
          {fare}
          {selectedFare === fare && (
            <span 
              className="fare-close-icon" 
              onClick={(e) => {
                e.stopPropagation(); // Prevents re-selecting on click
                setSelectedFare(null);
              }}
            >
              ×
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
</section>

     {/* Add this after the Special Fares Section */}
<main className="results-main-content">
  <div className="container">
    <div className="results-layout">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar-filters">
        <FiltersPanel onFiltersChange={setFiltersState} />
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <section className="flights-list-section">
        {/* DATE-PRICE STRIP SECTION */}
        {isRoundTrip ? (
          <DualDatePriceStrip 
            departureCity={searchData.fromCity || "DEL"} 
            arrivalCity={searchData.toCity || "BOM"}
            selectedDepartureDate={selectedDepartureDateKey || searchData.startDate}
            selectedReturnDate={selectedReturnDateKey || searchData.returnDate}
            departureDates={dateStripOutbound}
            returnDates={dateStripReturn}
            onDepartureSelect={handleDateStripSelect}
            onReturnSelect={handleReturnDateStripSelect}
          />
        ) : (
          <DatePriceStrip
            dates={dateStripOutbound}
            activeDateKey={selectedDepartureDateKey || formatDateKey(searchData.startDate)}
            onDateSelect={handleDateStripSelect}
          />
        )}
        
        {/* SORT BY BAR - Conditional for Round Trip */}
        {isRoundTrip ? (
          <div className="round-trip-sort-container">
            {/* Outbound Sort Bar */}
            <div className="sort-by-bar">
              <div className="sort-options">
                <button 
                  className={`sort-btn ${outboundSortStates.price !== null ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('price')}
                >
                  Price
                  <span className="sort-label">
                    {getSortLabel('price', outboundSortStates.price)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${outboundSortStates.fastest !== null ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('fastest')}
                >
                  Fastest
                  <span className="sort-label">
                    {getSortLabel('fastest', outboundSortStates.fastest)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${outboundSortStates.departure !== null ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('departure')}
                >
                  Departure
                  <span className="sort-label">
                    {getSortLabel('departure', outboundSortStates.departure)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${outboundSortStates.smart === 'active' ? 'active' : ''}`}
                  onClick={() => toggleOutboundSort('smart')}
                >
                  Smart ↓
                  <span className="sort-label">Recommended</span>
                </button>
              </div>
            </div>
            
            {/* Return Sort Bar */}
            <div className="sort-by-bar">
              <div className="sort-options">
                <button 
                  className={`sort-btn ${returnSortStates.price !== null ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('price')}
                >
                  Price
                  <span className="sort-label">
                    {getSortLabel('price', returnSortStates.price)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${returnSortStates.fastest !== null ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('fastest')}
                >
                  Fastest
                  <span className="sort-label">
                    {getSortLabel('fastest', returnSortStates.fastest)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${returnSortStates.departure !== null ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('departure')}
                >
                  Departure
                  <span className="sort-label">
                    {getSortLabel('departure', returnSortStates.departure)}
                  </span>
                </button>
                <button 
                  className={`sort-btn ${returnSortStates.smart === 'active' ? 'active' : ''}`}
                  onClick={() => toggleReturnSort('smart')}
                >
                  Smart ↓
                  <span className="sort-label">Recommended</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="sort-by-bar">
            <span className="results-count">{sortedOutboundFlights.length} Flights Available</span>
            <div className="sort-options">
              <button 
                className={`sort-btn ${sortStates.price !== null ? 'active' : ''}`}
                onClick={() => toggleSort('price')}
              >
                Price
                <span className="sort-label">
                  {getSortLabel('price', sortStates.price)}
                  {sortStates.price === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                  {sortStates.price === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                </span>
              </button>
              <button 
                className={`sort-btn ${sortStates.fastest !== null ? 'active' : ''}`}
                onClick={() => toggleSort('fastest')}
              >
                Fastest
                <span className="sort-label">
                  {getSortLabel('fastest', sortStates.fastest)}
                  {sortStates.fastest === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                  {sortStates.fastest === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                </span>
              </button>
              <button 
                className={`sort-btn ${sortStates.departure !== null ? 'active' : ''}`}
                onClick={() => toggleSort('departure')}
              >
                Departure
                <span className="sort-label">
                  {getSortLabel('departure', sortStates.departure)}
                  {sortStates.departure === 'asc' && <FaArrowUp style={{marginLeft: '4px', fontSize: '10px'}} />}
                  {sortStates.departure === 'desc' && <FaArrowDown style={{marginLeft: '4px', fontSize: '10px'}} />}
                </span>
              </button>
              <button 
                className={`sort-btn ${sortStates.smart === 'active' ? 'active' : ''}`}
                onClick={() => toggleSort('smart')}
              >
                Smart
                <span className="sort-label">Recommended</span>
              </button>
            </div>
          </div>
        )}

        {/* FLIGHT CARDS */}
        <div className="flight-cards-container">
          {flightLoading && (
            <div className="flight-loading">Loading flights...</div>
          )}
          {!flightLoading && flightError && (
            <div className="flight-loading">{flightError}</div>
          )}
          {!flightLoading && !flightError && displayFlights.length === 0 && (
            <div className="flight-empty">No flights found for this route.</div>
          )}
          {displayFlights.map((flight) => (
            <div key={flight.id} className="flight-card-wrapper">
                {/* Conditional rendering based on trip type */}
                {isRoundTrip ? (
                  // ROUND TRIP LAYOUT - Two independent side-by-side mini cards
                  <>
                  <div className="round-trip-content">
                    {/* Outbound Flight Card Wrapper */}
                    <div className="round-trip-card-wrapper">
                    <div className="round-trip-mini-card">
                      <div className="mini-card-top-row">
                        <div className="mini-airline-info">
                          <img src={flight.airlineLogo} alt={flight.airline} className="mini-airline-logo" />
                          <div className="mini-airline-details">
                            <div className="mini-airline-name">{flight.airline}</div>
                            <div className="mini-flight-code">{flight.flightCode}</div>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          name="outbound-flight" 
                          value={flight.id} 
                          className="mini-radio-top" 
                          checked={selectedOutbound?.id === flight.id}
                          onChange={() => handleOutboundSelect(flight)}
                        />
                        <div className="mini-price-section">
                          <div className="mini-price">{flight.price}</div>
                        </div>
                      </div>
                      
                      <div className="mini-card-main-row">
                        <div className="mini-departure-section">
                          <div className="mini-time">{flight.departureTime}</div>
                          <div className="mini-date">{flight.departureDate?.split(' at ')[0] || 'Tue, 14-10-2025'}</div>
                          <div className="mini-city">{flight.departureCity || flight.departureLocation}</div>
                        </div>
                        
                        <div className="mini-duration-section">
                          <div className="mini-duration">{flight.duration}</div>
                          <div className="mini-flight-line">
                            <div className="mini-line"></div>
                          </div>
                          <div className="mini-stops-info">{flight.stops}</div>
                        </div>
                        
                        <div className="mini-arrival-section">
                          <div className="mini-time">{flight.arrivalTime}</div>
                          <div className="mini-date">{flight.arrivalDate?.split(' at ')[0] || 'Wed, 15-10-2025'}</div>
                          <div className="mini-city">{flight.arrivalCity || flight.arrivalLocation}</div>
                        </div>
                      </div>
                      
                      <div className="mini-card-bottom-row">
                        <div className="mini-seats-info">{flight.seatsLeft || 0} Seats Available</div>
                        <div className="mini-stop-details">{flight.stopsCount === 0 ? "Non-stop" : `${flight.stopsCount} Stop${flight.stopsCount > 1 ? 's' : ''}`}</div>
                      </div>
                      
                      <div className="mini-card-footer-btn">
                        <button 
                          className="mini-flight-details-btn"
                          onClick={() => toggleFlightDetails(`${flight.id}-outbound`)}
                        >
                          {openFlightDetails[`${flight.id}-outbound`] ? 'Hide Details' : 'Flight Details'} →
                        </button>
                      </div>
                    </div>
                    
                    {/* FLIGHT DETAILS DROPDOWN FOR OUTBOUND */}
                  {openFlightDetails[`${flight.id}-outbound`] && (
                    <div className="flight-details-dropdown">
                      {/* Tabs */}
                      <div className="flight-details-tabs">
                        <button 
                          className={`tab-btn ${activeTab[`${flight.id}-outbound`] === 'flight-info' ? 'active' : ''}`}
                          onClick={() => handleTabChange(`${flight.id}-outbound`, 'flight-info')}
                        >
                          <FaPlane style={{marginRight: '6px', fontSize: '14px'}} />
                          FLIGHT INFORMATION
                        </button>
                        <button 
                          className={`tab-btn ${activeTab[`${flight.id}-outbound`] === 'fare-details' ? 'active' : ''}`}
                          onClick={() => handleTabChange(`${flight.id}-outbound`, 'fare-details')}
                        >
                          <FaLock style={{marginRight: '6px', fontSize: '14px'}} />
                          FARE DETAILS
                        </button>
                        <button 
                          className={`tab-btn ${activeTab[`${flight.id}-outbound`] === 'baggage-rules' ? 'active' : ''}`}
                          onClick={() => handleTabChange(`${flight.id}-outbound`, 'baggage-rules')}
                        >
                          <FaSuitcase style={{marginRight: '6px', fontSize: '14px'}} />
                          BAGGAGE RULES
                        </button>
                      </div>

                      {/* Tab Content */}
                      <div className="flight-details-content">
                        {activeTab[`${flight.id}-outbound`] === 'flight-info' && (
                          <div className="flight-info-tab">
                            <div className="flight-info-header">
                              <div className="airline-header">
                                <img src={flight.airlineLogo} alt={flight.airline} className="dropdown-airline-logo" />
                                <div className="airline-details">
                                  <span className="airline-name">{flight.airline}</span>
                                  <span className="flight-number">{flight.flightCode}</span>
                                </div>
                              </div>
                              <div className="flight-route">
                                <div className="route-segment">
                                  <div className="route-location">
                                    <span className="route-code">{flight.departureLocation}</span>
                                    <span className="route-time">{flight.departureDate}</span>
                                  </div>
                                  <div className="route-city">
                                    <span>{flight.departureCity}</span>
                                    <span className="terminal-info">{flight.departureTerminal}</span>
                                  </div>
                                </div>
                                <div className="route-duration">
                                  <span className="duration-text">{flight.duration}</span>
                                  <div className="duration-timeline-line"></div>
                                  <div className={`refundable-badge ${flight.refundable ? '' : 'non-refundable'}`}>
                                    {flight.refundable ? 'Refundable' : 'Non-Refundable'}
                                  </div>
                                </div>
                                <div className="route-segment">
                                  <div className="route-location">
                                    <span className="route-code">{flight.arrivalLocation}</span>
                                    <span className="route-time">{flight.arrivalDate}</span>
                                  </div>
                                  <div className="route-city">
                                    <span>{flight.arrivalCity}</span>
                                    <span className="terminal-info">{flight.arrivalTerminal}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flight-amenities">
                              <div className="amenity-item">
                                <FaThLarge style={{fontSize: '16px', color: '#666'}} />
                                <span>{flight.layout}</span>
                              </div>
                              <div className="amenity-item">
                                <FaUtensils style={{fontSize: '16px', color: '#666'}} />
                                <span>{flight.beverage}</span>
                              </div>
                            </div>

                            {flight.segments?.length > 1 && (
                              <div className="segment-details">
                                {flight.segments.map((segment, index) => {
                                  const nextSegment = flight.segments[index + 1];
                                  const showLayover = segment.layoverMinutes && nextSegment;
                                  const terminalChange = showLayover && segment.terminal && nextSegment.terminal
                                    ? segment.terminal !== nextSegment.terminal
                                    : false;

                                  return (
                                    <div key={`${flight.id}-outbound-seg-${index}`} className="segment-row">
                                      <div className="segment-airport">
                                        <div className="segment-time">{segment.departureTime}</div>
                                        <div className="segment-code">{segment.fromAirport}</div>
                                        <div className="segment-city">{segment.fromCity}</div>
                                      </div>
                                      <div className="segment-path">
                                        <div className="segment-duration">{formatDuration(segment.durationMinutes)}</div>
                                        <div className="segment-line"></div>
                                        <div className="segment-aircraft">{segment.aircraft}</div>
                                      </div>
                                      <div className="segment-airport">
                                        <div className="segment-time">{segment.arrivalTime}</div>
                                        <div className="segment-code">{segment.toAirport}</div>
                                        <div className="segment-city">{segment.toCity}</div>
                                      </div>

                                      {showLayover && (
                                        <div className="layover-row">
                                          <span>{formatDuration(segment.layoverMinutes)} Layover in {segment.toCity}</span>
                                          {terminalChange && <span className="terminal-change">Change of Terminal</span>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab[`${flight.id}-outbound`] === 'fare-details' && (
                          <div className="fare-details-tab">
                            <div className="fare-breakdown-card">
                              <h3 className="fare-breakdown-heading">Fare breakdown</h3>
                              
                              <div className="fare-breakdown-row">
                                <span className="fare-label">Base Fare</span>
                                <span className="fare-value">₹{flight.baseFare}</span>
                              </div>
                              
                              <div className="fare-breakdown-row">
                                <span className="fare-label">Taxes & Fees</span>
                                <span className="fare-value">₹{flight.taxes}</span>
                              </div>
                              
                              <div className="fare-divider"></div>
                              
                              <div className="fare-breakdown-row fare-total-row">
                                <span className="fare-total-label">TOTAL</span>
                                <span className="fare-total-value">₹{flight.baseFare + flight.taxes}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab[`${flight.id}-outbound`] === 'baggage-rules' && (
                          <div className="baggage-rules-tab">
                            <div className="baggage-section">
                              <h3 className="baggage-heading">CHECK-IN</h3>
                              <div className="baggage-divider"></div>
                              <div className="baggage-columns">
                                <div className="baggage-column">
                                  <div className="baggage-column-header">ADULT</div>
                                  <div className="baggage-column-value">15 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">CHILD</div>
                                  <div className="baggage-column-value">15 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">INFANT</div>
                                  <div className="baggage-column-value">0 kgs</div>
                                </div>
                              </div>
                            </div>

                            <div className="baggage-section">
                              <h3 className="baggage-heading">CABIN</h3>
                              <div className="baggage-divider"></div>
                              <div className="baggage-columns">
                                <div className="baggage-column">
                                  <div className="baggage-column-header">ADULT</div>
                                  <div className="baggage-column-value">7 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">CHILD</div>
                                  <div className="baggage-column-value">7 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">INFANT</div>
                                  <div className="baggage-column-value">7 kgs (1-piece only)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                    </div>
                    
                    {/* Return Flight Card Wrapper */}
                    <div className="round-trip-card-wrapper">
                    {/* Return Flight Card */}
                    <div className="round-trip-mini-card">
                      <div className="mini-card-top-row">
                        <div className="mini-airline-info">
                          <img src={flight.returnFlight.airlineLogo} alt={flight.returnFlight.airline} className="mini-airline-logo" />
                          <div className="mini-airline-details">
                            <div className="mini-airline-name">{flight.returnFlight.airline}</div>
                            <div className="mini-flight-code">{flight.returnFlight.flightCode}</div>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          name="return-flight" 
                          value={`${flight.id}-return`} 
                          className="mini-radio-top" 
                          checked={selectedReturn?.id === flight.id}
                          onChange={() => handleReturnSelect(flight)}
                        />
                        <div className="mini-price-section">
                          <div className="mini-price">{flight.returnFlight.price}</div>
                        </div>
                      </div>
                      
                      <div className="mini-card-main-row">
                        <div className="mini-departure-section">
                          <div className="mini-time">{flight.returnFlight.departureTime}</div>
                          <div className="mini-date">{flight.returnFlight.departureDate?.split(' at ')[0] || 'Wed, 15-10-2025'}</div>
                          <div className="mini-city">{flight.arrivalCity || flight.returnFlight.departureLocation}</div>
                        </div>
                        
                        <div className="mini-duration-section">
                          <div className="mini-duration">{flight.returnFlight.duration}</div>
                          <div className="mini-flight-line">
                            <div className="mini-line"></div>
                          </div>
                          <div className="mini-stops-info">{flight.returnFlight.stops}</div>
                        </div>
                        
                        <div className="mini-arrival-section">
                          <div className="mini-time">{flight.returnFlight.arrivalTime}</div>
                          <div className="mini-date">{flight.returnFlight.arrivalDate?.split(' at ')[0] || 'Wed, 15-10-2025'}</div>
                          <div className="mini-city">{flight.departureCity || flight.returnFlight.arrivalLocation}</div>
                        </div>
                      </div>
                      
                      <div className="mini-card-bottom-row">
                        <div className="mini-seats-info">{flight.returnFlight.seatsLeft || 0} Seats Available</div>
                        <div className="mini-stop-details">{flight.returnFlight.stopsCount === 0 ? "Non-stop" : `${flight.returnFlight.stopsCount} Stop${flight.returnFlight.stopsCount > 1 ? 's' : ''}`}</div>
                      </div>
                      
                      <div className="mini-card-footer-btn">
                        <button 
                          className="mini-flight-details-btn"
                          onClick={() => toggleFlightDetails(`${flight.id}-return`)}
                        >
                          {openFlightDetails[`${flight.id}-return`] ? 'Hide Details' : 'Flight Details'} →
                        </button>
                      </div>
                    </div>
                  
                  {/* FLIGHT DETAILS DROPDOWN FOR RETURN */}
                  {openFlightDetails[`${flight.id}-return`] && (
                    <div className="flight-details-dropdown">
                      {/* Tabs */}
                      <div className="flight-details-tabs">
                        <button 
                          className={`tab-btn ${activeTab[`${flight.id}-return`] === 'flight-info' ? 'active' : ''}`}
                          onClick={() => handleTabChange(`${flight.id}-return`, 'flight-info')}
                        >
                          <FaPlane style={{marginRight: '6px', fontSize: '14px'}} />
                          FLIGHT INFORMATION
                        </button>
                        <button 
                          className={`tab-btn ${activeTab[`${flight.id}-return`] === 'fare-details' ? 'active' : ''}`}
                          onClick={() => handleTabChange(`${flight.id}-return`, 'fare-details')}
                        >
                          <FaLock style={{marginRight: '6px', fontSize: '14px'}} />
                          FARE DETAILS
                        </button>
                        <button 
                          className={`tab-btn ${activeTab[`${flight.id}-return`] === 'baggage-rules' ? 'active' : ''}`}
                          onClick={() => handleTabChange(`${flight.id}-return`, 'baggage-rules')}
                        >
                          <FaSuitcase style={{marginRight: '6px', fontSize: '14px'}} />
                          BAGGAGE RULES
                        </button>
                      </div>

                      {/* Tab Content for Return Flight */}
                      <div className="flight-details-content">
                        {activeTab[`${flight.id}-return`] === 'flight-info' && (
                          <div className="flight-info-tab">
                            <div className="flight-info-header">
                              <div className="airline-header">
                                <img src={flight.returnFlight.airlineLogo} alt={flight.returnFlight.airline} className="dropdown-airline-logo" />
                                <div className="airline-details">
                                  <span className="airline-name">{flight.returnFlight.airline}</span>
                                  <span className="flight-number">{flight.returnFlight.flightCode}</span>
                                </div>
                              </div>
                              <div className="flight-route">
                                <div className="route-segment">
                                  <div className="route-location">
                                    <span className="route-code">{flight.returnFlight.departureLocation}</span>
                                    <span className="route-time">{flight.returnFlight.departureDate || 'Wed, 15-10-2025'}</span>
                                  </div>
                                  <div className="route-city">
                                    <span>{flight.arrivalCity || flight.returnFlight.departureLocation}</span>
                                    <span className="terminal-info">Terminal: 1</span>
                                  </div>
                                </div>
                                <div className="route-duration">
                                  <span className="duration-text">{flight.returnFlight.duration}</span>
                                  <div className="duration-timeline-line"></div>
                                  <div className="refundable-badge non-refundable">Non-Refundable</div>
                                </div>
                                <div className="route-segment">
                                  <div className="route-location">
                                    <span className="route-code">{flight.returnFlight.arrivalLocation}</span>
                                    <span className="route-time">{flight.returnFlight.arrivalDate || 'Wed, 15-10-2025'}</span>
                                  </div>
                                  <div className="route-city">
                                    <span>{flight.departureCity || flight.returnFlight.arrivalLocation}</span>
                                    <span className="terminal-info">Terminal: 2</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flight-amenities">
                              <div className="amenity-item">
                                <FaThLarge style={{fontSize: '16px', color: '#666'}} />
                                <span>3-3 Layout</span>
                              </div>
                              <div className="amenity-item">
                                <FaUtensils style={{fontSize: '16px', color: '#666'}} />
                                <span>Beverage Available</span>
                              </div>
                            </div>

                            {flight.returnFlight?.segments?.length > 1 && (
                              <div className="segment-details">
                                {flight.returnFlight.segments.map((segment, index) => {
                                  const nextSegment = flight.returnFlight.segments[index + 1];
                                  const showLayover = segment.layoverMinutes && nextSegment;
                                  const terminalChange = showLayover && segment.terminal && nextSegment.terminal
                                    ? segment.terminal !== nextSegment.terminal
                                    : false;

                                  return (
                                    <div key={`${flight.id}-return-seg-${index}`} className="segment-row">
                                      <div className="segment-airport">
                                        <div className="segment-time">{segment.departureTime}</div>
                                        <div className="segment-code">{segment.fromAirport}</div>
                                        <div className="segment-city">{segment.fromCity}</div>
                                      </div>
                                      <div className="segment-path">
                                        <div className="segment-duration">{formatDuration(segment.durationMinutes)}</div>
                                        <div className="segment-line"></div>
                                        <div className="segment-aircraft">{segment.aircraft}</div>
                                      </div>
                                      <div className="segment-airport">
                                        <div className="segment-time">{segment.arrivalTime}</div>
                                        <div className="segment-code">{segment.toAirport}</div>
                                        <div className="segment-city">{segment.toCity}</div>
                                      </div>

                                      {showLayover && (
                                        <div className="layover-row">
                                          <span>{formatDuration(segment.layoverMinutes)} Layover in {segment.toCity}</span>
                                          {terminalChange && <span className="terminal-change">Change of Terminal</span>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab[`${flight.id}-return`] === 'fare-details' && (
                          <div className="fare-details-tab">
                            <div className="fare-breakdown-card">
                              <h3 className="fare-breakdown-heading">Fare breakdown</h3>
                              
                              <div className="fare-breakdown-row">
                                <span className="fare-label">Base Fare</span>
                                <span className="fare-value">₹{flight.baseFare || 2800}</span>
                              </div>
                              
                              <div className="fare-breakdown-row">
                                <span className="fare-label">Taxes & Fees</span>
                                <span className="fare-value">₹{flight.taxes || 451}</span>
                              </div>
                              
                              <div className="fare-divider"></div>
                              
                              <div className="fare-breakdown-row fare-total-row">
                                <span className="fare-total-label">TOTAL</span>
                                <span className="fare-total-value">{flight.returnFlight.price}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab[`${flight.id}-return`] === 'baggage-rules' && (
                          <div className="baggage-rules-tab">
                            <div className="baggage-section">
                              <h3 className="baggage-heading">CHECK-IN</h3>
                              <div className="baggage-divider"></div>
                              <div className="baggage-columns">
                                <div className="baggage-column">
                                  <div className="baggage-column-header">ADULT</div>
                                  <div className="baggage-column-value">15 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">CHILD</div>
                                  <div className="baggage-column-value">15 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">INFANT</div>
                                  <div className="baggage-column-value">0 kgs</div>
                                </div>
                              </div>
                            </div>

                            <div className="baggage-section">
                              <h3 className="baggage-heading">CABIN</h3>
                              <div className="baggage-divider"></div>
                              <div className="baggage-columns">
                                <div className="baggage-column">
                                  <div className="baggage-column-header">ADULT</div>
                                  <div className="baggage-column-value">7 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">CHILD</div>
                                  <div className="baggage-column-value">7 kgs (1-piece only)</div>
                                </div>
                                <div className="baggage-column">
                                  <div className="baggage-column-header">INFANT</div>
                                  <div className="baggage-column-value">7 kgs (1-piece only)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                    </div>
                  </div>
                  </>
                ) : (
                  <div className="flight-card">
                    {flight.badge && (
                      <div className="flight-card-header">
                        <span className="cheapest-badge">{flight.badge}</span>
                      </div>
                    )}
                    
                    <div className="flight-card-content">
                    <div className="airline-info">
                      <img src={flight.airlineLogo} alt={flight.airline} className="airline-logo-flight" />
                      <div className="flight-numbers">
                        <span>{flight.airline}</span>
                        <span className="flight-code">{flight.flightCode}</span>
                      </div>
                    </div>
                    
                    <div className="flight-timing">
                      <div className="time-section">
                        <span className="time">{flight.departureTime}</span>
                        <span className="location">{flight.departureLocation}</span>
                      </div>
                      <div className="duration-section">
                        <span className="duration">{flight.duration}</span>
                        <div className="flight-line">
                          <div className="line"></div>
                          {flight.stops !== "Non Stop" && <span className="stops-dot">○</span>}
                        </div>
                        <span className="stops">{flight.stops}</span>
                      </div>
                      <div className="time-section">
                        <span className="time">{flight.arrivalTime}{flight.stops !== "Non Stop" && <sup>+1</sup>}</span>
                        <span className="location">{flight.arrivalLocation}</span>
                      </div>
                    </div>

                    <div className="flight-price-section">
                      <button className="book-btn" onClick={() => openFareModal(flight)}>Book</button>
                      <div className="price-main">{flight.price}</div>
                      <button className="lock-price-btn">🔒 Lock Price @{flight.lockPrice}</button>
                    </div>
                    </div>
                    
                    <div className="flight-card-footer">
                      <div className="price-offers">
                        <span className="offer-badge">{flight.offers}</span>
                        <span className="seats-left">{flight.seatsLeft || 0} Seats left</span>
                      </div>
                      <button 
                        className="flight-details-btn"
                        onClick={() => toggleFlightDetails(flight.id)}
                      >
                        {openFlightDetails[flight.id] ? 'Hide Details' : 'Flight Details'} →
                      </button>
                    </div>
                  </div>
                )}

              {/* FLIGHT DETAILS DROPDOWN */}
              {openFlightDetails[flight.id] && (
                <div className="flight-details-dropdown">
                  {/* Tabs */}
                  <div className="flight-details-tabs">
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'flight-info' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'flight-info')}
                    >
                      <FaPlane style={{marginRight: '6px', fontSize: '14px'}} />
                      FLIGHT INFORMATION
                    </button>
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'fare-details' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'fare-details')}
                    >
                      <FaLock style={{marginRight: '6px', fontSize: '14px'}} />
                      FARE DETAILS
                    </button>
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'baggage-rules' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'baggage-rules')}
                    >
                      <FaSuitcase style={{marginRight: '6px', fontSize: '14px'}} />
                      BAGGAGE RULES
                    </button>
                    <button 
                      className={`tab-btn ${activeTab[flight.id] === 'cancellation' ? 'active' : ''}`}
                      onClick={() => handleTabChange(flight.id, 'cancellation')}
                    >
                      <FaLock style={{marginRight: '6px', fontSize: '14px'}} />
                      CANCELLATION
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flight-details-content">
                    {activeTab[flight.id] === 'flight-info' && (
                      <div className="flight-info-tab">
                        <div className="flight-info-header">
                          <div className="airline-header">
                            <img src={flight.airlineLogo} alt={flight.airline} className="dropdown-airline-logo" />
                            <div className="airline-details">
                              <span className="airline-name">{flight.airline}</span>
                              <span className="flight-number">{flight.flightCode}</span>
                            </div>
                          </div>
                          <div className="flight-route">
                            <div className="route-segment">
                              <div className="route-location">
                                <span className="route-code">{flight.departureLocation}</span>
                                <span className="route-time">{flight.departureDate}</span>
                              </div>
                              <div className="route-city">
                                <span>{flight.departureCity}</span>
                                <span className="terminal-info">{flight.departureTerminal}</span>
                              </div>
                            </div>
                            <div className="route-duration">
                              <span className="duration-text">{flight.duration}</span>
                              <div className="duration-timeline-line"></div>
                              <div className={`refundable-badge ${flight.refundable ? '' : 'non-refundable'}`}>
                                {flight.refundable ? 'Refundable' : 'Non-Refundable'}
                              </div>
                            </div>
                            <div className="route-segment">
                              <div className="route-location">
                                <span className="route-code">{flight.arrivalLocation}</span>
                                <span className="route-time">{flight.arrivalDate}</span>
                              </div>
                              <div className="route-city">
                                <span>{flight.arrivalCity}</span>
                                <span className="terminal-info">{flight.arrivalTerminal}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bottom Icons Section */}
                        <div className="flight-amenities">
                          <div className="amenity-item">
                            <FaThLarge style={{fontSize: '16px', color: '#666'}} />
                            <span>{flight.layout}</span>
                          </div>
                          <div className="amenity-item">
                            <FaUtensils style={{fontSize: '16px', color: '#666'}} />
                            <span>{flight.beverage}</span>
                          </div>
                        </div>

                        {flight.segments?.length > 1 && (
                          <div className="segment-details">
                            {flight.segments.map((segment, index) => {
                              const nextSegment = flight.segments[index + 1];
                              const showLayover = segment.layoverMinutes && nextSegment;
                              const terminalChange = showLayover && segment.terminal && nextSegment.terminal
                                ? segment.terminal !== nextSegment.terminal
                                : false;

                              return (
                                <div key={`${flight.id}-seg-${index}`} className="segment-row">
                                  <div className="segment-airport">
                                    <div className="segment-time">{segment.departureTime}</div>
                                    <div className="segment-code">{segment.fromAirport}</div>
                                    <div className="segment-city">{segment.fromCity}</div>
                                  </div>
                                  <div className="segment-path">
                                    <div className="segment-duration">{formatDuration(segment.durationMinutes)}</div>
                                    <div className="segment-line"></div>
                                    <div className="segment-aircraft">{segment.aircraft}</div>
                                  </div>
                                  <div className="segment-airport">
                                    <div className="segment-time">{segment.arrivalTime}</div>
                                    <div className="segment-code">{segment.toAirport}</div>
                                    <div className="segment-city">{segment.toCity}</div>
                                  </div>

                                  {showLayover && (
                                    <div className="layover-row">
                                      <span>{formatDuration(segment.layoverMinutes)} Layover in {segment.toCity}</span>
                                      {terminalChange && <span className="terminal-change">Change of Terminal</span>}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab[flight.id] === 'fare-details' && (
                      <div className="fare-details-tab">
                        <div className="fare-breakdown-card">
                          <h3 className="fare-breakdown-heading">Fare breakdown</h3>
                          
                          <div className="fare-breakdown-row">
                            <span className="fare-label">Base Fare</span>
                            <span className="fare-value">₹{flight.baseFare}</span>
                          </div>
                          
                          <div className="fare-breakdown-row">
                            <span className="fare-label">Taxes & Fees</span>
                            <span className="fare-value">₹{flight.taxes}</span>
                          </div>
                          
                          <div className="fare-divider"></div>
                          
                          <div className="fare-breakdown-row fare-total-row">
                            <span className="fare-total-label">TOTAL</span>
                            <span className="fare-total-value">₹{flight.baseFare + flight.taxes}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab[flight.id] === 'baggage-rules' && (
                      <div className="baggage-rules-tab">
                        {/* CHECK-IN Section */}
                        <div className="baggage-section">
                          <h3 className="baggage-heading">CHECK-IN</h3>
                          <div className="baggage-divider"></div>
                          <div className="baggage-columns">
                            <div className="baggage-column">
                              <div className="baggage-column-header">ADULT</div>
                              <div className="baggage-column-value">15 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">CHILD</div>
                              <div className="baggage-column-value">15 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">INFANT</div>
                              <div className="baggage-column-value">0 kgs</div>
                            </div>
                          </div>
                        </div>

                        {/* CABIN Section */}
                        <div className="baggage-section">
                          <h3 className="baggage-heading">CABIN</h3>
                          <div className="baggage-divider"></div>
                          <div className="baggage-columns">
                            <div className="baggage-column">
                              <div className="baggage-column-header">ADULT</div>
                              <div className="baggage-column-value">7 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">CHILD</div>
                              <div className="baggage-column-value">7 kgs (1-piece only)</div>
                            </div>
                            <div className="baggage-column">
                              <div className="baggage-column-header">INFANT</div>
                              <div className="baggage-column-value">7 kgs (1-piece only)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab[flight.id] === 'cancellation' && (
                      <div className="cancellation-tab">
                        <div className="cancellation-empty-state">
                          <div className="cancellation-icon">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="40" cy="12" r="3" fill="#999" />
                              <circle cx="68" cy="52" r="2" fill="#999" />
                              <circle cx="55" cy="18" r="2.5" fill="#999" />
                              <circle cx="16" cy="45" r="2" fill="#999" />
                              <rect x="28" y="28" width="24" height="32" rx="2" stroke="#666" strokeWidth="1.5" fill="none" />
                              <path d="M32 34 L36 34 M32 38 L38 38 M32 42 L36 42" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
                              <text x="34" y="36" fontSize="8" fill="#666" fontWeight="600">₹</text>
                              <circle cx="40" cy="54" r="8" fill="white" stroke="#666" strokeWidth="1.5" />
                              <path d="M40 50 L40 54 M40 58 L40 58" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" />
                              <circle cx="40" cy="58" r="1" fill="#e74c3c" />
                            </svg>
                          </div>
                          <p className="cancellation-message">Sorry! Fare rules could not be<br />fetched at the moment.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
</main>

      {/* Fare Options Modal */}
      {isFareModalOpen && selectedFlightData && (
        <>
          <div className="fare-modal-overlay" onClick={closeFareModal}></div>
          <div className="fare-modal">
            <button className="fare-modal-close" onClick={closeFareModal}>✕</button>
            
            <div className="fare-modal-header">
              <h2 className="fare-modal-title">Flight Details and Fare Options available for you!</h2>
              <div className="fare-modal-flight-info">
                <img src={selectedFlightData.airlineLogo} alt={selectedFlightData.airline} className="fare-modal-airline-logo" />
                <span className="fare-modal-route">
                  {selectedFlightData.departureLocation} → {selectedFlightData.arrivalLocation}
                </span>
                <span className="fare-modal-separator">|</span>
                <span>{selectedFlightData.airline}</span>
                <span className="fare-modal-separator">|</span>
                <span>Tue, 3 Feb 26</span>
                <span className="fare-modal-separator">|</span>
                <span>Departure at {selectedFlightData.departureTime} - Arrival at {selectedFlightData.arrivalTime}</span>
              </div>
            </div>

            <div className="fare-modal-content">
              <div className="fare-cards-wrapper">
                {selectedFlightData.fareOptions?.length ? (
                  selectedFlightData.fareOptions.map((fareOption) => (
                    <div
                      key={fareOption.fareName}
                      className="fare-card"
                      onClick={() => setSelectedOnewayFare(fareOption)}
                    >
                      <div className="fare-card-price">
                        <input
                          type="radio"
                          name="oneway-fare"
                          value={fareOption.fareName}
                          checked={selectedOnewayFare?.fareName === fareOption.fareName}
                          onChange={() => setSelectedOnewayFare(fareOption)}
                          className="fare-radio-btn"
                        />
                        <span className="fare-price-amount">{formatCurrency(fareOption.price)}</span>
                        <span className="fare-price-label">per adult</span>
                        <span className="fare-type">{fareOption.fareName.toUpperCase()}</span>
                      </div>

                      <div className="fare-card-section">
                        <div className="fare-section-title">Baggage</div>
                        <div className="fare-item">
                          <span className="fare-check">✔</span>
                          <span>7 Kgs Cabin Baggage</span>
                        </div>
                        <div className="fare-item">
                          <span className="fare-check">✔</span>
                          <span>15 Kgs Check-in Baggage</span>
                        </div>
                      </div>

                      <div className="fare-card-section">
                        <div className="fare-section-title">Flexibility</div>
                        <div className="fare-item">
                          <span className={fareOption.refundable ? "fare-check" : "fare-cross"}>
                            {fareOption.refundable ? "✔" : "✖"}
                          </span>
                          <span>Cancellation fee starts at ₹ {fareOption.cancellationFee}</span>
                        </div>
                        <div className="fare-item">
                          <span className={fareOption.refundable ? "fare-check" : "fare-cross"}>
                            {fareOption.refundable ? "✔" : "✖"}
                          </span>
                          <span>Date change fee starts at ₹ {fareOption.dateChangeFee}</span>
                        </div>
                      </div>

                      <div className="fare-card-section">
                        <div className="fare-section-title">Seats, Meals & More</div>
                        <div className="fare-item">
                          <span className={fareOption.freeSeats ? "fare-check" : "fare-cross"}>
                            {fareOption.freeSeats ? "✔" : "✖"}
                          </span>
                          <span>{fareOption.freeSeats ? "Free Seats" : "Chargeable Seats"}</span>
                        </div>
                        <div className="fare-item">
                          <span className={fareOption.freeMeals ? "fare-check" : "fare-cross"}>
                            {fareOption.freeMeals ? "✔" : "✖"}
                          </span>
                          <span>{fareOption.freeMeals ? "Complimentary Meals" : "Chargeable Meals"}</span>
                        </div>
                      </div>

                      <button
                        className="fare-btn-book-single"
                        onClick={() => openBookingPanel(selectedFlightData, fareOption)}
                      >
                        BOOK NOW
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="fare-empty">No fare options available.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Round Trip Fare Options Modal */}
      {isRoundTripFareModalOpen && selectedOutbound && selectedReturn && (
        <>
          <div className="fare-modal-overlay" onClick={closeRoundTripFareModal}></div>
          <div className="fare-modal">
            <button className="fare-modal-close" onClick={closeRoundTripFareModal}>✕</button>
            
            <div className="fare-modal-header">
              <h2 className="fare-modal-title">Flight Details and Fare Options available for you!</h2>
              <div className="fare-modal-flight-info">
                <img src={selectedOutbound.airlineLogo} alt={selectedOutbound.airline} className="fare-modal-airline-logo" />
                <span className="fare-modal-route">
                  {selectedOutbound.departureLocation} → {selectedOutbound.arrivalLocation} → {selectedOutbound.departureLocation}
                </span>
                <span className="fare-modal-separator">|</span>
                <span>{selectedOutbound.airline} & {selectedReturn.returnFlight.airline}</span>
                <span className="fare-modal-separator">|</span>
                <span>Round Trip</span>
              </div>
            </div>

            {/* Departure and Return Tabs */}
            <div className="round-trip-tabs">
              <button 
                className={`round-trip-tab ${roundTripFareTab === 'departure' ? 'active' : ''}`}
                onClick={() => setRoundTripFareTab('departure')}
              >
                Departure
              </button>
              <button 
                className={`round-trip-tab ${roundTripFareTab === 'return' ? 'active' : ''}`}
                onClick={() => setRoundTripFareTab('return')}
              >
                Return
              </button>
            </div>

            <div className="fare-modal-content">
              {roundTripFareTab === 'departure' ? (
                <div className="fare-cards-wrapper">
                  {selectedOutbound?.fareOptions?.length ? (
                    selectedOutbound.fareOptions.map((fareOption) => (
                      <div
                        key={`dep-${fareOption.fareName}`}
                        className="fare-card"
                        onClick={() => setSelectedDepartureFare(fareOption)}
                      >
                        <div className="fare-card-price">
                          <input
                            type="radio"
                            name="departure-fare"
                            value={fareOption.fareName}
                            checked={selectedDepartureFare?.fareName === fareOption.fareName}
                            onChange={() => setSelectedDepartureFare(fareOption)}
                            className="fare-radio-btn"
                          />
                          <span className="fare-price-amount">{formatCurrency(fareOption.price)}</span>
                          <span className="fare-price-label">per adult</span>
                          <span className="fare-type">{fareOption.fareName.toUpperCase()}</span>
                        </div>

                        <div className="fare-card-section">
                          <div className="fare-section-title">Baggage</div>
                          <div className="fare-item">
                            <span className="fare-check">✔</span>
                            <span>7 Kgs Cabin Baggage</span>
                          </div>
                          <div className="fare-item">
                            <span className="fare-check">✔</span>
                            <span>15 Kgs Check-in Baggage</span>
                          </div>
                        </div>

                        <div className="fare-card-section">
                          <div className="fare-section-title">Flexibility</div>
                          <div className="fare-item">
                            <span className={fareOption.refundable ? "fare-check" : "fare-cross"}>
                              {fareOption.refundable ? "✔" : "✖"}
                            </span>
                            <span>Cancellation fee starts at ₹ {fareOption.cancellationFee}</span>
                          </div>
                          <div className="fare-item">
                            <span className={fareOption.refundable ? "fare-check" : "fare-cross"}>
                              {fareOption.refundable ? "✔" : "✖"}
                            </span>
                            <span>Date change fee starts at ₹ {fareOption.dateChangeFee}</span>
                          </div>
                        </div>

                        <div className="fare-card-section">
                          <div className="fare-section-title">Seats, Meals & More</div>
                          <div className="fare-item">
                            <span className={fareOption.freeSeats ? "fare-check" : "fare-cross"}>
                              {fareOption.freeSeats ? "✔" : "✖"}
                            </span>
                            <span>{fareOption.freeSeats ? "Free Seats" : "Chargeable Seats"}</span>
                          </div>
                          <div className="fare-item">
                            <span className={fareOption.freeMeals ? "fare-check" : "fare-cross"}>
                              {fareOption.freeMeals ? "✔" : "✖"}
                            </span>
                            <span>{fareOption.freeMeals ? "Complimentary Meals" : "Chargeable Meals"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="fare-empty">No departure fares available.</div>
                  )}
                </div>
              ) : (
                <div className="fare-cards-wrapper">
                  {selectedReturn?.returnFlight?.fareOptions?.length ? (
                    selectedReturn.returnFlight.fareOptions.map((fareOption) => (
                      <div
                        key={`ret-${fareOption.fareName}`}
                        className="fare-card"
                        onClick={() => setSelectedReturnFare(fareOption)}
                      >
                        <div className="fare-card-price">
                          <input
                            type="radio"
                            name="return-fare"
                            value={fareOption.fareName}
                            checked={selectedReturnFare?.fareName === fareOption.fareName}
                            onChange={() => setSelectedReturnFare(fareOption)}
                            className="fare-radio-btn"
                          />
                          <span className="fare-price-amount">{formatCurrency(fareOption.price)}</span>
                          <span className="fare-price-label">per adult</span>
                          <span className="fare-type">{fareOption.fareName.toUpperCase()}</span>
                        </div>

                        <div className="fare-card-section">
                          <div className="fare-section-title">Baggage</div>
                          <div className="fare-item">
                            <span className="fare-check">✔</span>
                            <span>7 Kgs Cabin Baggage</span>
                          </div>
                          <div className="fare-item">
                            <span className="fare-check">✔</span>
                            <span>15 Kgs Check-in Baggage</span>
                          </div>
                        </div>

                        <div className="fare-card-section">
                          <div className="fare-section-title">Flexibility</div>
                          <div className="fare-item">
                            <span className={fareOption.refundable ? "fare-check" : "fare-cross"}>
                              {fareOption.refundable ? "✔" : "✖"}
                            </span>
                            <span>Cancellation fee starts at ₹ {fareOption.cancellationFee}</span>
                          </div>
                          <div className="fare-item">
                            <span className={fareOption.refundable ? "fare-check" : "fare-cross"}>
                              {fareOption.refundable ? "✔" : "✖"}
                            </span>
                            <span>Date change fee starts at ₹ {fareOption.dateChangeFee}</span>
                          </div>
                        </div>

                        <div className="fare-card-section">
                          <div className="fare-section-title">Seats, Meals & More</div>
                          <div className="fare-item">
                            <span className={fareOption.freeSeats ? "fare-check" : "fare-cross"}>
                              {fareOption.freeSeats ? "✔" : "✖"}
                            </span>
                            <span>{fareOption.freeSeats ? "Free Seats" : "Chargeable Seats"}</span>
                          </div>
                          <div className="fare-item">
                            <span className={fareOption.freeMeals ? "fare-check" : "fare-cross"}>
                              {fareOption.freeMeals ? "✔" : "✖"}
                            </span>
                            <span>{fareOption.freeMeals ? "Complimentary Meals" : "Chargeable Meals"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="fare-empty">No return fares available.</div>
                  )}
                </div>
              )}
            </div>

            {/* Total Price Footer */}
            <div className="fare-modal-footer">
              <div className="fare-total-section">
                <div className="fare-total-prices">
                  <span className="fare-main-price">
                    ₹ {(() => {
                      // Extract numeric values from price strings
                      const parsePrice = (priceString) => {
                        if (!priceString) return 0;
                        return parseInt(priceString.replace(/[₹,\s]/g, '')) || 0;
                      };
                      
                      // Define fare prices for each type
                      const departureFarePrices = {
                        'saver': parsePrice(selectedOutbound?.price),
                        'flexi-plus': 10957,
                        'premium': 12850
                      };
                      
                      const returnFarePrices = {
                        'saver': parsePrice(selectedReturn?.returnFlight?.price),
                        'flexi': 10275,
                        'super-saver': 11890
                      };
                      
                      // If no fare selected, default to saver prices (initial state)
                      const depPrice = selectedDepartureFare 
                        ? departureFarePrices[selectedDepartureFare] 
                        : departureFarePrices['saver'];
                        
                      const retPrice = selectedReturnFare 
                        ? returnFarePrices[selectedReturnFare] 
                        : returnFarePrices['saver'];
                      
                      const total = depPrice + retPrice;
                      return total.toLocaleString('en-IN');
                    })()}
                  </span>
                </div>
                <div className="fare-total-label">ROUNDTRIP FOR 1 ADULT</div>
              </div>
              <button 
                className="fare-btn-book-roundtrip" 
                onClick={openBookingPanelFromRoundTrip}
                disabled={!selectedDepartureFare || !selectedReturnFare}
              >
                BOOK NOW
              </button>
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Flight Booking Panel */}
      <FlightBookingPanel 
        isOpen={isBookingPanelOpen}
        onClose={closeBookingPanel}
        flightData={bookingFlightData}
      />

      {/* Round Trip Summary Bar */}
      {isRoundTrip && selectedOutbound && selectedReturn && (
        <RoundTripSummaryBar 
          outboundFlight={selectedOutbound}
          returnFlight={selectedReturn}
          onBookNow={handleSummaryBookNow}
        />
      )}
    </div>
  );
}

export default FlightResults;
