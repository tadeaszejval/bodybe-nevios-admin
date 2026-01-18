import { getAccessToken } from './authApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_NEVIOS_EXPRESS_URL;

/**
 * Get authorization headers with JWT token
 * @returns {Object} Headers object with Authorization if token exists
 */
const getAuthHeaders = () => {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

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
      const value = queryParams[key];
      if (value !== undefined && value !== null) {
        // Handle array parameters (like select[])
        if (Array.isArray(value)) {
          value.forEach(item => {
            url.searchParams.append(key, item);
          });
        } else {
          url.searchParams.append(key, value);
        }
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
 * // Get customers list (with auth)
 * const customers = await getRequest(apiEndpoints.customers.list);
 * 
 * // Create a customer (with auth)
 * const newCustomer = await postRequest(apiEndpoints.customers.create, {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 * });
 * 
 * // Update a customer (with auth)
 * const updatedCustomer = await putRequest(apiEndpoints.customers.update(123), {
 *   firstName: 'Jane',
 * });
 * 
 * // Delete a customer (with auth)
 * await deleteRequest(apiEndpoints.customers.delete(123));
 */
