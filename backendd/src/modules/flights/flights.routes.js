import express from 'express';
import {
  searchAirports,
  getPopularAirports,
  getRecentSearches,
  saveRecentSearch,
  searchFlights,
  createBooking
} from './flights.controller.js';

const router = express.Router();

// Airport discovery
router.get('/airports/search', searchAirports);
router.get('/airports/popular', getPopularAirports);
router.get('/airports/recent', getRecentSearches);
router.post('/airports/recent', saveRecentSearch);

// Flight search
router.get('/search', searchFlights);

// Booking flow
router.post('/bookings', createBooking);

export default router;
