"use client";
import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "../utils/authApi";

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
 * Custom hook for retrieving a single module record with expansions
 * 
 * @param {string} module - The module name (e.g., 'order', 'customer', 'product')
 * @param {string} id - The record ID to retrieve
 * @param {Object} options - Configuration options
 * @param {Array} options.expand - Related records to expand (default: [])
 * @param {Function} options.transformData - Custom data transformation function
 * @param {boolean} options.autoFetch - Whether to auto-fetch on mount (default: true)
 * @param {boolean} options.enabled - Whether fetching is enabled (default: true)
 * 
 * @returns {Object} Hook state and methods
 * 
 * @example
 * // Retrieve customer with addresses and orders
 * const { data: customer, loading, error, refreshData } = useModuleRetrieve('customer', customerId, {
 *   expand: ['billing_addresses', 'shipping_addresses', 'orders']
 * });
 * 
 * @example
 * // Retrieve order with all related data
 * const { data: order, loading, error } = useModuleRetrieve('order', orderId, {
 *   expand: ['customer', 'items', 'pricing', 'billing_address', 'shipping_address']
 * });
 */
export function useModuleRetrieve(module, id, options = {}) {
  const {
    expand = [],
    transformData = null,
    autoFetch = true,
    enabled = true
  } = options;

  // State for data fetching
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!module) {
      console.warn('useModuleRetrieve: module name is required');
      return;
    }

    if (!id) {
      console.warn('useModuleRetrieve: record id is required');
      return;
    }

    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();

      // Add expand parameter if provided (comma-separated)
      if (expand.length > 0) {
        const expandParam = expand.join(',');
        params.append('expand', expandParam);
      }

      const queryString = params.toString();
      const url = `${API_BASE_URL}/server/${module}/retrieve/${id}${queryString ? `?${queryString}` : ''}`;
      
      console.log(`[useModuleRetrieve] ${module}/${id} GET request:`, url);
      console.log(`[useModuleRetrieve] Expand:`, expand);

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || `Failed to fetch ${module} record`);
      }

      console.log(`[useModuleRetrieve] ${module}/${id} API response:`, {
        hasData: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : []
      });

      // Apply custom transformation if provided
      const finalData = transformData ? transformData(result.data) : result.data;
      
      setData(finalData);
      setLastFetched(new Date());

    } catch (err) {
      console.error(`Error fetching ${module} record:`, err);
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [module, id, enabled, JSON.stringify(expand), transformData]);

  // Auto-fetch data on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && enabled && id) {
      fetchData();
    }
  }, [
    module,
    id,
    enabled,
    JSON.stringify(expand),
    autoFetch,
    fetchData
  ]);

  // Public methods for external control
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const resetData = useCallback(() => {
    setData(null);
    setError(null);
    setLastFetched(null);
  }, []);

  // Return hook state and methods
  return {
    // Data state
    data,
    loading,
    error,
    lastFetched,
    
    // Control methods
    refreshData,
    resetData,
    
    // Manual fetch (for when autoFetch is false)
    fetchData
  };
}
