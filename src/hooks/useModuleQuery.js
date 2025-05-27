"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

const API_BASE_URL = "https://vasky-nevios-express-production.up.railway.app/api";

// Global pagination settings
const GLOBAL_PAGE_SIZE = 50;

/**
 * Custom hook for querying module data with pagination, sorting, filtering, and search
 * 
 * @param {string} module - The module name (e.g., 'order', 'customer', 'product')
 * @param {Object} options - Configuration options
 * @param {Array} options.expand - Related records to expand (default: [])
 * @param {Object} options.initialFilters - Initial filters to apply (default: {})
 * @param {string} options.initialSearch - Initial search term (default: "")
 * @param {boolean} options.enableSearch - Whether search is enabled (default: false)
 * @param {string} options.defaultOrderBy - Default sort column (default: 'created_at')
 * @param {boolean} options.defaultAscending - Default sort order (default: false)
 * @param {boolean} options.autoFetch - Whether to auto-fetch on mount (default: true)
 * @param {Function} options.transformData - Custom data transformation function
 * 
 * @returns {Object} Hook state and methods
 */
export function useModuleQuery(module, options = {}) {
  const {
    expand = [],
    initialFilters = {},
    initialSearch = "",
    enableSearch = false,
    defaultOrderBy = 'created_at',
    defaultAscending = false,
    autoFetch = true,
    transformData = null
  } = options;

  // State for data fetching
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for query parameters
  const [pagination, setPagination] = useState({ 
    page: 0, 
    pageSize: GLOBAL_PAGE_SIZE 
  });
  const [sortModel, setSortModel] = useState([{ 
    field: defaultOrderBy, 
    sort: defaultAscending ? 'asc' : 'desc' 
  }]);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  // Transform DataGrid sort model to API format
  const transformSortModel = useMemo(() => {
    return (sortModel) => {
      if (!sortModel || sortModel.length === 0) {
        return { orderBy: defaultOrderBy, ascending: defaultAscending };
      }
      
      const sort = sortModel[0];
      return {
        orderBy: sort.field,
        ascending: sort.sort === 'asc'
      };
    };
  }, [defaultOrderBy, defaultAscending]);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    if (!module) {
      console.warn('useModuleQuery: module name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { orderBy, ascending } = transformSortModel(sortModel);
      
      const requestBody = {
        page: pagination.page + 1, // Convert from 0-based to 1-based
        limit: pagination.pageSize,
        orderBy,
        ascending,
        ...(expand.length > 0 && { expand }),
        ...(Object.keys(filters).length > 0 && { filters }),
        ...(enableSearch && debouncedSearchTerm?.trim() && { search: debouncedSearchTerm.trim() })
      };

      // Remove undefined values
      Object.keys(requestBody).forEach(key => {
        if (requestBody[key] === undefined) {
          delete requestBody[key];
        }
      });

      const response = await fetch(`${API_BASE_URL}/server/${module}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || `Failed to fetch ${module} data`);
      }

      // Apply custom transformation if provided
      const finalData = transformData ? transformData(result.data) : result.data;
      
      setData(finalData);
      setTotalCount(result.pagination.totalRecords);

    } catch (err) {
      console.error(`Error fetching ${module} data:`, err);
      setError(err.message);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    module, 
    pagination.page,
    pagination.pageSize,
    sortModel,
    filters, 
    debouncedSearchTerm, 
    enableSearch, 
    expand, 
    transformSortModel,
    transformData
  ]);

  // Auto-fetch data on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [
    module,
    pagination.page,
    pagination.pageSize,
    JSON.stringify(sortModel),
    JSON.stringify(filters),
    debouncedSearchTerm,
    enableSearch,
    JSON.stringify(expand),
    autoFetch
  ]);

  // Handle pagination changes
  const handlePaginationChange = useCallback((newPagination) => {
    setPagination(newPagination);
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((newSortModel) => {
    setSortModel(newSortModel);
  }, []);

  // Public methods for external control
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const updateSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    // Reset to first page when search changes
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const resetQuery = useCallback(() => {
    setPagination({ page: 0, pageSize: GLOBAL_PAGE_SIZE });
    setSortModel([{ field: defaultOrderBy, sort: defaultAscending ? 'asc' : 'desc' }]);
    setFilters(initialFilters);
    setSearchTerm(initialSearch);
  }, [defaultOrderBy, defaultAscending, initialFilters, initialSearch]);

  // Return hook state and methods
  return {
    // Data state
    data,
    loading,
    error,
    totalCount,
    
    // Query state
    pagination,
    sortModel,
    filters,
    searchTerm,
    
    // Event handlers for table
    handlePaginationChange,
    handleSortChange,
    
    // Control methods
    refreshData,
    updateFilters,
    updateSearch,
    resetQuery,
    
    // Manual fetch (for when autoFetch is false)
    fetchData
  };
} 