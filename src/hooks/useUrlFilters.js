"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Custom hook to sync filters with URL parameters
 * Persists filter state across page refreshes
 * 
 * @param {Object} initialFilters - Default filters to use if URL has none
 * @returns {Object} { filters, updateFilters, clearFilters }
 */
export function useUrlFilters(initialFilters = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to flatten date range filters from nested structure
  const flattenFilters = useCallback((filters) => {
    const flattened = {};
    
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      // Check if this is a nested date range filter object
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const hasDateRangeKeys = Object.keys(value).some(k => k.endsWith('_from') || k.endsWith('_to'));
        
        if (hasDateRangeKeys) {
          // Flatten: spread the nested keys directly
          Object.assign(flattened, value);
        } else {
          // Keep as-is (non-date-range object)
          flattened[key] = value;
        }
      } else {
        // Primitive or array value
        flattened[key] = value;
      }
    });
    
    return flattened;
  }, []);

  // Parse filters from URL on mount
  useEffect(() => {
    if (isInitialized) return;

    const filtersParam = searchParams.get('filters');
    if (filtersParam) {
      try {
        const parsedFilters = JSON.parse(decodeURIComponent(filtersParam));
        // Flatten any nested date range filters
        const flatFilters = flattenFilters(parsedFilters);
        setFilters(flatFilters);
      } catch (error) {
        console.error('Failed to parse filters from URL:', error);
        setFilters(initialFilters);
      }
    } else {
      setFilters(initialFilters);
    }
    setIsInitialized(true);
  }, [searchParams, initialFilters, isInitialized, flattenFilters]);

  // Update URL when filters change
  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (Object.keys(newFilters).length > 0) {
      params.set('filters', encodeURIComponent(JSON.stringify(newFilters)));
    } else {
      params.delete('filters');
    }

    // Use replace to avoid adding to browser history for every filter change
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Update filters and sync with URL
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    updateUrlParams(newFilters);
  }, [updateUrlParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    updateUrlParams({});
  }, [updateUrlParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
    isInitialized
  };
}
