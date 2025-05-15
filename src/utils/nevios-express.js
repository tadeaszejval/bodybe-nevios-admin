/**
 * Nevios Express API Utilities
 * Base URL: https://vasky-nevios-express-production.up.railway.app/api
 */

const API_BASE_URL = 'https://vasky-nevios-express-production.up.railway.app/api';

/**
 * Make a GET request to the API
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} queryParams - Query parameters to include
 * @returns {Promise<any>} - The API response data
 */
export const getRequest = async (endpoint, queryParams = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Add query parameters
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
};

/**
 * Make a POST request to the API
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} data - The data to send in the request body
 * @returns {Promise<any>} - The API response data
 */
export const postRequest = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

/**
 * Make a PUT request to the API
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} data - The data to send in the request body
 * @returns {Promise<any>} - The API response data
 */
export const putRequest = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
};

/**
 * Make a PATCH request to the API
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} data - The data to send in the request body
 * @returns {Promise<any>} - The API response data
 */
export const patchRequest = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PATCH request failed:', error);
    throw error;
  }
};

/**
 * Make a DELETE request to the API
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @returns {Promise<any>} - The API response data
 */
export const deleteRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
};

/**
 * API endpoints for various resources
 */
export const apiEndpoints = {
  customers: {
    list: '/customers',
    get: (id) => `/customers/${id}`,
    create: '/customers',
    update: (id) => `/customers/${id}`,
    delete: (id) => `/customers/${id}`,
  },
  products: {
    list: '/products',
    get: (id) => `/products/${id}`,
    create: '/products',
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
  },
  orders: {
    list: '/orders',
    get: (id) => `/orders/${id}`,
    create: '/orders',
    update: (id) => `/orders/${id}`,
    delete: (id) => `/orders/${id}`,
  },
};

/**
 * Example usage:
 * 
 * // Get customers list
 * const customers = await getRequest(apiEndpoints.customers.list);
 * 
 * // Create a customer
 * const newCustomer = await postRequest(apiEndpoints.customers.create, {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 * });
 * 
 * // Update a customer
 * const updatedCustomer = await putRequest(apiEndpoints.customers.update(123), {
 *   firstName: 'Jane',
 * });
 * 
 * // Delete a customer
 * await deleteRequest(apiEndpoints.customers.delete(123));
 */
