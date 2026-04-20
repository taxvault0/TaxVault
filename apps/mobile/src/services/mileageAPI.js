import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@/constants/config';

const mileageAPI = axios.create({
  baseURL: `${API_URL}/mileage`,
});

// Add token to requests
mileageAPI.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error adding token to request:', error);
    return config;
  }
});

// Handle response errors
mileageAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - token may be expired');
    }
    return Promise.reject(error);
  }
);

const normalizeTripStats = (payload = {}) => {
  const source =
    payload?.stats && typeof payload.stats === 'object'
      ? payload.stats
      : payload;

  return {
    totalTrips: Number(source?.totalTrips ?? source?.trips ?? 0),
    totalDistance: Number(
      source?.totalDistance ?? source?.distance ?? source?.kilometers ?? 0
    ),
    totalAmount: Number(
      source?.totalAmount ?? source?.amount ?? source?.deductibleAmount ?? 0
    ),
    businessTrips: Number(source?.businessTrips ?? 0),
    personalTrips: Number(source?.personalTrips ?? 0),
  };
};

/**
 * Get all trips with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.year - Filter by year
 * @param {string} params.type - Filter by trip type (business, personal, all)
 * @param {string} params.startDate - Start date for range
 * @param {string} params.endDate - End date for range
 * @returns {Promise<Object>} - Trips data with statistics
 */
export const getTrips = async (params = {}) => {
  try {
    const response = await mileageAPI.get('/', { params });
    return response?.data ?? {};
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single trip by ID
 * @param {string|number} id - Trip ID
 * @returns {Promise<Object>} - Trip data
 */
export const getTrip = async (id) => {
  try {
    const response = await mileageAPI.get(`/${id}`);
    return response?.data ?? {};
  } catch (error) {
    console.error(`Error fetching trip ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Create new trip
 * @param {Object} tripData - Trip information
 * @param {string} tripData.startAddress - Starting address
 * @param {string} tripData.endAddress - Ending address
 * @param {number} tripData.distance - Distance in km
 * @param {number} tripData.duration - Duration in minutes
 * @param {string} tripData.purpose - Trip purpose (business, personal, delivery, commute)
 * @param {string} tripData.type - Trip type (regular, return, deadhead)
 * @param {boolean} tripData.hasOrder - Whether trip had an order
 * @param {boolean} tripData.hasMultipleApps - Whether using multiple apps
 * @param {number} tripData.appShare - Share percentage for multi-app trips
 * @param {number} tripData.orders - Number of orders
 * @param {string} tripData.notes - Additional notes
 * @returns {Promise<Object>} - Created trip data
 */
export const createTrip = async (tripData) => {
  try {
    const isDeductible = calculateDeductibility(tripData);

    const response = await mileageAPI.post('/', {
      ...tripData,
      isDeductible,
      createdAt: new Date().toISOString(),
    });
    return response?.data ?? {};
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update trip
 * @param {string|number} id - Trip ID
 * @param {Object} tripData - Updated trip data
 * @returns {Promise<Object>} - Updated trip data
 */
export const updateTrip = async (id, tripData) => {
  try {
    const response = await mileageAPI.put(`/${id}`, tripData);
    return response?.data ?? {};
  } catch (error) {
    console.error(`Error updating trip ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Delete trip
 * @param {string|number} id - Trip ID
 * @returns {Promise<Object>} - Deletion response
 */
export const deleteTrip = async (id) => {
  try {
    const response = await mileageAPI.delete(`/${id}`);
    return response?.data ?? {};
  } catch (error) {
    console.error(`Error deleting trip ${id}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Start tracking a trip
 * @param {Object} startData - Starting location data
 * @param {string} startData.address - Starting address
 * @param {number} startData.latitude - Starting latitude
 * @param {number} startData.longitude - Starting longitude
 * @returns {Promise<Object>} - Active trip session
 */
export const startTripTracking = async (startData) => {
  try {
    const response = await mileageAPI.post('/tracking/start', startData);
    return response?.data ?? {};
  } catch (error) {
    console.error('Error starting trip tracking:', error);
    throw error.response?.data || error;
  }
};

/**
 * End tracking a trip
 * @param {string} sessionId - Tracking session ID
 * @param {Object} endData - Ending location data
 * @param {string} endData.address - Ending address
 * @param {number} endData.latitude - Ending latitude
 * @param {number} endData.longitude - Ending longitude
 * @param {number} endData.distance - Total distance in km
 * @param {number} endData.duration - Total duration in minutes
 * @returns {Promise<Object>} - Completed trip data
 */
export const endTripTracking = async (sessionId, endData) => {
  try {
    const response = await mileageAPI.post(`/tracking/${sessionId}/end`, endData);
    return response?.data ?? {};
  } catch (error) {
    console.error('Error ending trip tracking:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get trip statistics
 * @param {Object} params - Query parameters
 * @param {number} params.year - Year for statistics
 * @param {number} params.month - Month for statistics
 * @returns {Promise<Object>} - Statistics data
 */
export const getTripStats = async (params = {}) => {
  try {
    const response = await mileageAPI.get('/stats', { params });
    return normalizeTripStats(response?.data);
  } catch (error) {
    console.error('Error fetching trip stats:', error);
    return normalizeTripStats();
  }
};

/**
 * Get mileage rates by year
 * @param {number} year - Year for rate
 * @returns {Promise<Object>} - Rate information
 */
export const getMileageRate = async (year) => {
  try {
    const response = await mileageAPI.get(`/rates/${year}`);
    return response?.data ?? {};
  } catch (error) {
    console.error('Error fetching mileage rate:', error);
    throw error.response?.data || error;
  }
};

/**
 * Calculate trip deductibility based on business rules
 * @param {Object} trip - Trip data
 * @returns {boolean} - Whether trip is deductible
 */
const calculateDeductibility = (trip) => {
  if (trip.type === 'deadhead' && !trip.hasOrder) {
    return false;
  }

  if (trip.purpose === 'personal' || trip.purpose === 'commute') {
    return false;
  }

  if (trip.purpose === 'business' || trip.purpose === 'delivery') {
    return true;
  }

  if (trip.type === 'return' && trip.hasOrder) {
    return true;
  }

  return false;
};

/**
 * Calculate deductible amount for a trip
 * @param {Object} trip - Trip data
 * @param {number} rate - CRA mileage rate
 * @returns {number} - Deductible amount
 */
export const calculateDeductibleAmount = (trip, rate) => {
  if (!calculateDeductibility(trip)) {
    return 0;
  }

  let deductibleKm = trip.distance;

  if (trip.hasMultipleApps) {
    const appShare = trip.appShare || 0.5;
    deductibleKm = trip.distance * appShare;
  }

  return deductibleKm * rate;
};

/**
 * Export trips data
 * @param {Object} params - Export parameters
 * @param {string} params.format - Export format (pdf, csv, excel)
 * @param {number} params.year - Year to export
 * @param {string} params.type - Trip type filter
 * @returns {Promise<Blob>} - File blob
 */
export const exportTrips = async (params = {}) => {
  try {
    const response = await mileageAPI.get('/export', {
      params,
      responseType: 'blob',
    });
    return response?.data;
  } catch (error) {
    console.error('Error exporting trips:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get trip summary for tax filing
 * @param {number} year - Tax year
 * @returns {Promise<Object>} - Tax summary data
 */
export const getTaxSummary = async (year) => {
  try {
    const response = await mileageAPI.get(`/tax-summary/${year}`);
    return response?.data ?? {};
  } catch (error) {
    console.error('Error fetching tax summary:', error);
    throw error.response?.data || error;
  }
};

/**
 * Bulk delete trips
 * @param {Array} ids - Array of trip IDs to delete
 * @returns {Promise<Object>} - Bulk deletion response
 */
export const bulkDeleteTrips = async (ids) => {
  try {
    const response = await mileageAPI.post('/bulk-delete', { ids });
    return response?.data ?? {};
  } catch (error) {
    console.error('Error bulk deleting trips:', error);
    throw error.response?.data || error;
  }
};

export const MILEAGE_RATES = {
  2024: 0.61,
  2023: 0.61,
  2022: 0.59,
  2021: 0.59,
  2020: 0.58,
};

export default {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  startTripTracking,
  endTripTracking,
  getTripStats,
  getMileageRate,
  calculateDeductibleAmount,
  exportTrips,
  getTaxSummary,
  bulkDeleteTrips,
  MILEAGE_RATES,
};