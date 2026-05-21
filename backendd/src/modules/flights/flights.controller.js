import {
  searchAirportsService,
  getPopularAirportsService,
  getRecentSearchesService,
  saveRecentSearchService,
  searchFlightsService,
  createBookingService
} from './flights.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const searchAirports = async (req, res) => {
  try {
    const { query } = req.query;
    const limit = Number(req.query.limit) || 10;

    if (!query || !query.trim()) {
      return successResponse(res, 200, 'No query provided', { airports: [] });
    }

    const airports = await searchAirportsService(query.trim(), limit);
    return successResponse(res, 200, 'Airports fetched successfully', { airports });
  } catch (error) {
    console.error('Airport search error:', error);
    return errorResponse(res, 500, 'Failed to search airports');
  }
};

export const getPopularAirports = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const airports = await getPopularAirportsService(limit);
    return successResponse(res, 200, 'Popular airports fetched successfully', { airports });
  } catch (error) {
    console.error('Popular airports error:', error);
    return errorResponse(res, 500, 'Failed to fetch popular airports');
  }
};

export const getRecentSearches = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    const searches = await getRecentSearchesService(limit);
    return successResponse(res, 200, 'Recent searches fetched successfully', { searches });
  } catch (error) {
    console.error('Recent searches error:', error);
    return errorResponse(res, 500, 'Failed to fetch recent searches');
  }
};

export const saveRecentSearch = async (req, res) => {
  try {
    const { fromAirport, toAirport } = req.body;

    if (!fromAirport || !toAirport) {
      return errorResponse(res, 400, 'From and To airports are required');
    }

    const result = await saveRecentSearchService(fromAirport, toAirport);
    return successResponse(res, 201, 'Recent search saved', result);
  } catch (error) {
    console.error('Save recent search error:', error);
    return errorResponse(res, 500, 'Failed to save recent search');
  }
};

export const searchFlights = async (req, res) => {
  try {
    const { from, to, tripType, cabinClass, stops, refundable, minPrice, maxPrice, date, returnDate } = req.query;

    if (!from || !to) {
      return errorResponse(res, 400, 'From and To parameters are required');
    }

    const result = await searchFlightsService({
      from,
      to,
      tripType: tripType || 'oneWay',
      cabinClass,
      stops,
      refundable,
      minPrice,
      maxPrice,
      date,
      returnDate
    });

    return successResponse(res, 200, 'Flights fetched successfully', result);
  } catch (error) {
    console.error('Flight search error:', error);
    return errorResponse(res, 500, 'Failed to search flights');
  }
};

export const createBooking = async (req, res) => {
  try {
    const { tripType, departureFlightId, returnFlightId, email, phone, totalPrice, passengers } = req.body;

    if (!tripType || !departureFlightId || !email || !phone || !totalPrice) {
      return errorResponse(res, 400, 'Required booking details are missing');
    }

    const bookingId = await createBookingService({
      tripType,
      departureFlightId,
      returnFlightId: returnFlightId || null,
      email,
      phone,
      totalPrice,
      passengers: Array.isArray(passengers) ? passengers : []
    });

    return successResponse(res, 201, 'Booking saved successfully', { bookingId });
  } catch (error) {
    console.error('Create booking error:', error);
    return errorResponse(res, 500, 'Failed to save booking');
  }
};
