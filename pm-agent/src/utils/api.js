import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch wrapper with authentication token
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const user = auth.currentUser;
    let headers = { 'Content-Type': 'application/json', ...options.headers };
    
    if (user) {
      const token = await user.getIdToken();
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * GET request helper
 */
export const get = (endpoint) => fetchWithAuth(endpoint);

/**
 * POST request helper
 */
export const post = (endpoint, data) => fetchWithAuth(endpoint, {
  method: 'POST',
  body: JSON.stringify(data)
});

/**
 * PUT request helper
 */
export const put = (endpoint, data) => fetchWithAuth(endpoint, {
  method: 'PUT',
  body: JSON.stringify(data)
});

/**
 * DELETE request helper
 */
export const del = (endpoint) => fetchWithAuth(endpoint, {
  method: 'DELETE'
});

export default {
  get,
  post,
  put,
  delete: del
}; 