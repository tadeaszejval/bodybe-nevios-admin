/**
 * Data Query API handler for backend server endpoints
 * Handles table queries with pagination, sorting, and filtering
 */

import { getAccessToken } from './authApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_NEVIOS_EXPRESS_URL || 'http://localhost:3001/api';

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
 * Query data from backend API endpoints
 * @param {Object} params - Query parameters
 * @param {string} params.endpoint - API endpoint (e.g., 'order', 'customer', 'email')
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.limit - Number of records per page (max: 100)
 * @param {string} params.orderBy - Column to order by
 * @param {boolean} params.ascending - Sort order (true for ascending, false for descending)
 * @param {string} params.select - Columns to select (comma-separated)
 * @param {Object} params.filters - Filter object
 * @param {boolean} params.useAdvanced - Whether to use advanced endpoint (PUT) or basic (POST)
 * @returns {Promise<Object>} - API response with data and pagination info
 */
export async function queryTableData({
  endpoint,
  page = 1,
  limit = 50,
  orderBy = 'created_at',
  ascending = false,
  select = '*',
  filters = {},
  useAdvanced = false
}) {
  try {
    const url = `${API_BASE_URL}/server/${endpoint}/query${useAdvanced ? '/advanced' : ''}`;
    
    let requestConfig = {
      method: useAdvanced ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
    };

    let finalUrl = url;

    if (useAdvanced) {
      // Advanced endpoint: all parameters in request body
      requestConfig.body = JSON.stringify({
        page,
        limit,
        orderBy,
        ascending,
        select,
        filters
      });
    } else {
      // Basic endpoint: pagination/sorting in URL, filters in body
      const urlParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        orderBy,
        ascending: ascending.toString(),
        select
      });
      
      requestConfig.body = JSON.stringify({ filters });
      finalUrl = `${url}?${urlParams.toString()}`;
    }

    const response = await fetch(finalUrl, requestConfig);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error(`Error querying ${endpoint} data:`, error);
    throw new Error(`Failed to fetch ${endpoint} data: ${error.message}`);
  }
}

/**
 * Convert UI filters to backend API format
 * @param {Array} uiFilters - Filters from UI components
 * @returns {Object} - Backend API compatible filters
 */
export function convertUIFiltersToAPI(uiFilters) {
  const apiFilters = {};
  
  uiFilters.forEach(filter => {
    const { field, operator, value } = filter;
    
    // Convert operators to backend format
    switch (operator) {
      case 'contains':
        // Use pattern matching with %
        apiFilters[field] = `%${value}%`;
        break;
      case 'startsWith':
        apiFilters[field] = `${value}%`;
        break;
      case 'endsWith':
        apiFilters[field] = `%${value}`;
        break;
      case 'equals':
        apiFilters[field] = value;
        break;
      case 'in':
        // Array values for IN operation
        apiFilters[field] = Array.isArray(value) ? value : [value];
        break;
      case 'greater_than':
      case 'less_than':
        // For numeric/date comparisons, pass value directly
        // Backend should handle the comparison logic
        apiFilters[field] = value;
        break;
      default:
        // Default to exact match
        apiFilters[field] = value;
    }
  });
  
  return apiFilters;
}

/**
 * Convert UI sort model to backend API format
 * @param {Array} sortModel - Sort model from UI
 * @returns {Object} - Backend API compatible sort parameters
 */
export function convertSortModelToAPI(sortModel) {
  if (!sortModel || sortModel.length === 0) {
    return {
      orderBy: 'created_at',
      ascending: false
    };
  }
  
  const firstSort = sortModel[0];
  return {
    orderBy: firstSort.field,
    ascending: firstSort.sort === 'asc'
  };
}

/**
 * Get available endpoints for different table types
 */
export const TABLE_ENDPOINTS = {
  orders: 'order',
  customers: 'customer', 
  emails: 'email',
  products: 'product'
};

/**
 * Get endpoint name for a table
 * @param {string} tableName - Name of the table
 * @returns {string} - API endpoint name
 */
export function getEndpointForTable(tableName) {
  return TABLE_ENDPOINTS[tableName] || tableName;
}
