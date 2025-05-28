"use client";
import { Box, Button, useMediaQuery, useTheme, Paper, Typography } from "@mui/material";
import { NeviosSecondaryIconButton, NeviosSimpleToggleButton } from "./NeviosButtons";
import { TbFilterCog, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import * as React from "react";
import { DotLoader } from "../DotLoader";
import { NeviosSearchBar } from "./NeviosSearchBar";
import { NeviosEnhancedTableFilters } from "./NeviosFilters/NeviosEnhancedTableFilters";
export const defaultAscendingSortOrder = ["asc", "desc", null];
export const defaultDescendingSortOrder = ["desc", "asc", null];

// Global pagination settings
const GLOBAL_PAGE_SIZE = 50;

/**
 * Enhanced NeviosTable - simplified version for backend endpoint integration
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column definitions
 * @param {Array} props.data - Table data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {number} props.totalCount - Total number of records
 * @param {boolean} props.enableFilters - Whether to show filters (default: true)
 * @param {Array} props.filterConfigs - Filter configurations for the table
 * @param {Object} props.activeFilters - Current active filters
 * @param {Function} props.onFiltersChange - Callback when filters change
 * @param {boolean} props.enableSearch - Whether to enable search functionality (default: false)
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Callback when search term changes
 * @param {string} props.searchPlaceholder - Placeholder text for search bar
 * @param {Function} props.onRowClick - Row click handler
 * @param {Object} props.emptyStateProps - Empty state configuration
 * @param {string} props.tableHeight - Table height
 * @param {string} props.variant - Table variant
 * @param {number} props.rowHeight - Row height
 * @param {Array} props.sortingOrder - Sorting order
 * @param {boolean} props.hideFooter - Whether to hide footer
 * @param {Object} props.pagination - Pagination state
 * @param {Function} props.onPaginationChange - Pagination change handler
 * @param {Array} props.sortModel - Sort model
 * @param {Function} props.onSortChange - Sort change handler
 * @param {Array} props.rowSelectionModel - Selected row IDs
 * @param {Function} props.onRowSelectionModelChange - Callback when row selection changes
 * @param {boolean} props.checkboxSelection - Whether to show checkboxes for selection (default: true)
 * @param {Array} props.bulkActions - Array of bulk action configurations
 * @param {Function} props.onBulkAction - Callback when a bulk action is performed
 */
export function NeviosEnhancedTable({
  columns,
  data = [],
  loading = false,
  error = null,
  totalCount = 0,
  enableFilters = true,
  filterConfigs = [],
  activeFilters = {},
  onFiltersChange,
  enableSearch = false,
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search for all records",
  onRowClick,
  emptyStateProps = {},
  tableHeight,
  variant = "simple",
  rowHeight,
  sortingOrder = defaultAscendingSortOrder,
  hideFooter = true,
  pagination = { page: 0, pageSize: GLOBAL_PAGE_SIZE },
  onPaginationChange,
  sortModel = [],
  onSortChange,
  rowSelectionModel = [],
  onRowSelectionModelChange,
  checkboxSelection = true,
  bulkActions = [],
  onBulkAction,
  ...props
}) {
  const theme = useTheme();
  const matchesSmBreakpoint = useMediaQuery(theme.breakpoints.up("sm"));
  
  // Filter bar visibility state
  const [showFiltersBar, setShowFiltersBar] = React.useState(false);
  
  // Internal row selection state (fallback if not controlled externally)
  const [internalRowSelection, setInternalRowSelection] = React.useState([]);
  
  // Use external selection model if handler is provided, otherwise use internal state
  const currentRowSelectionModel = onRowSelectionModelChange ? rowSelectionModel : internalRowSelection;
  
  // Sticky footer state
  const [isFooterSticky, setIsFooterSticky] = React.useState(false);
  const [footerPosition, setFooterPosition] = React.useState({ left: 0, width: '100%' });
  const footerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  
  // Calculate default rowHeight based on breakpoint if custom rowHeight is not provided
  const calculatedRowHeight = rowHeight || (matchesSmBreakpoint ? 40 : 32);
  
  // Update footer position to match container
  const updateFooterPosition = React.useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setFooterPosition({
        left: rect.left,
        width: rect.width
      });
    }
  }, []);
  
  // Intersection Observer for sticky footer
  React.useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only make sticky if footer is not fully visible AND it's below the viewport
        const isNotFullyVisible = !entry.isIntersecting || entry.intersectionRatio < 1;
        const isBelow = entry.boundingClientRect.top > 0;
        
        const shouldBeSticky = isNotFullyVisible && isBelow;
        setIsFooterSticky(shouldBeSticky);
        
        // Update position when becoming sticky
        if (shouldBeSticky) {
          updateFooterPosition();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0, 1] // Check both when it starts intersecting and when it's fully visible
      }
    );

    observer.observe(footerElement);

    return () => {
      observer.unobserve(footerElement);
    };
  }, [updateFooterPosition]);
  
  // Update footer position on window resize
  React.useEffect(() => {
    if (isFooterSticky) {
      const handleResize = () => updateFooterPosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isFooterSticky, updateFooterPosition]);
  
  // Handle row selection changes
  const handleRowSelectionModelChange = React.useCallback((newRowSelectionModel) => {
    console.log('Row selection changed:', newRowSelectionModel); // Debug log
    console.log('Current selection model:', currentRowSelectionModel); // Debug current state
    
    // Update internal state if no external handler is provided
    if (!onRowSelectionModelChange) {
      setInternalRowSelection(newRowSelectionModel);
    }
    
    // Call external handler if provided
    if (onRowSelectionModelChange) {
      onRowSelectionModelChange(newRowSelectionModel);
    }
  }, [onRowSelectionModelChange, currentRowSelectionModel]);
  
  // Handle pagination changes from DataGrid
  const handlePaginationModelChange = React.useCallback((paginationModel) => {
    if (onPaginationChange) {
      onPaginationChange(paginationModel);
    }
  }, [onPaginationChange]);
  
  // Handle sort changes from DataGrid
  const handleSortModelChange = React.useCallback((newSortModel) => {
    if (onSortChange) {
      onSortChange(newSortModel);
    }
  }, [onSortChange]);
  
  // Handle row clicks
  const handleRowClick = React.useCallback((params, event) => {
    if (onRowClick) {
      onRowClick(params, event);
    }
  }, [onRowClick]);

  // Custom pagination handlers
  const handlePreviousPage = React.useCallback(() => {
    if (pagination.page > 0 && onPaginationChange) {
      onPaginationChange({
        ...pagination,
        page: pagination.page - 1
      });
    }
  }, [pagination, onPaginationChange]);

  const handleNextPage = React.useCallback(() => {
    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    if (pagination.page < totalPages - 1 && onPaginationChange) {
      onPaginationChange({
        ...pagination,
        page: pagination.page + 1
      });
    }
  }, [pagination, totalCount, onPaginationChange]);

  // Calculate pagination info
  const currentPage = pagination.page + 1; // Convert to 1-based
  const totalPages = Math.ceil(totalCount / pagination.pageSize);
  const hasNextPage = pagination.page < totalPages - 1;
  const hasPreviousPage = pagination.page > 0;
  const startRecord = pagination.page * pagination.pageSize + 1;
  const endRecord = Math.min((pagination.page + 1) * pagination.pageSize, totalCount);

  // Check if we have any filters configured
  const hasFilters = filterConfigs && filterConfigs.length > 0;
  
  // Get selected rows data
  const selectedRowsData = React.useMemo(() => {
    return data.filter(row => {
      const rowId = row.id || row._id || row.key;
      return currentRowSelectionModel.includes(rowId);
    });
  }, [data, currentRowSelectionModel]);
  
  // Handle bulk actions
  const handleBulkAction = React.useCallback((actionKey) => {
    if (onBulkAction && selectedRowsData.length > 0) {
      onBulkAction(actionKey, selectedRowsData, currentRowSelectionModel);
    }
  }, [onBulkAction, selectedRowsData, currentRowSelectionModel]);

  // Footer component
  const FooterComponent = () => (
    <Box 
      sx={{ 
        backgroundColor: 'gray.50', 
        height: isFooterSticky ? '45px' : '40px', 
        borderRadius: isFooterSticky ? '0' : '0 0 12px 12px',
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: 1.5,
        borderTop: isFooterSticky ? `1px solid ${theme.palette.gray[200]}` : 'none',
        boxShadow: isFooterSticky ? theme.shadows[4] : 'none',
      }}
    >
      {/* Left side - Navigation buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
          <NeviosSecondaryIconButton 
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage || loading}
          >
            <TbChevronLeft size={16} />
          </NeviosSecondaryIconButton>
          <NeviosSecondaryIconButton 
            onClick={handleNextPage}
            disabled={!hasNextPage || loading}
          >
            <TbChevronRight size={16} />
          </NeviosSecondaryIconButton>
        </Box>
        {totalCount > 0 ? (
          <>
            <Typography variant="body2" color="gray.600">
              {startRecord}-{endRecord} of {totalCount.toLocaleString()}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="gray.600">
            Nothing
          </Typography>
        )}
      </Box>

      {/* Center - Pagination info */}
      <Box sx={{ 
        fontSize: '14px', 
        color: 'gray.600',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
      </Box>

      {/* Right side - Page size info */}
      <Box sx={{ 
        fontSize: '14px', 
        color: 'gray.500',
        minWidth: '80px',
        textAlign: 'right'
      }}>
        
      </Box>
    </Box>
  );

  return (
    <>
      <Paper 
        ref={containerRef}
        elevation={2} 
        sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          marginBottom: isFooterSticky ? '45px' : '0' // Add margin when footer is sticky
        }}
      >
        <div
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: "100%",
              borderTop: (theme) => `0.5px solid ${theme.palette.gray[200]}`,
            }}
          >
            {/* Table Controls */}
            <Box sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              height: "50px",
              px: 1.5,
              justifyContent: "space-between",
              gap: 2,
              borderBottom: (theme) => `0.75px solid ${theme.palette.gray[200]}`,
            }}>
              {/* Bulk Actions - Show when rows are selected */}
              {currentRowSelectionModel.length > 0 && bulkActions.length > 0 ? (
                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: 'primary.50',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'primary.200'
                }}>
                  <Typography variant="body2" sx={{ color: 'primary.700', fontWeight: 500 }}>
                    {currentRowSelectionModel.length} selected
                  </Typography>
                  {bulkActions.map((action) => (
                    <Button
                      key={action.key}
                      size="small"
                      variant={action.variant || "outlined"}
                      color={action.color || "primary"}
                      onClick={() => handleBulkAction(action.key)}
                      disabled={loading}
                      startIcon={action.icon}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              ) : (
                <>
                  <Box sx={{
                    display: "none",
                    maxWidth: "200px",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.5,
                  }}>
                    <NeviosSimpleToggleButton toggled={true}>Active</NeviosSimpleToggleButton>
                    <NeviosSimpleToggleButton>Inactive</NeviosSimpleToggleButton>
                  </Box>
                  <Box sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 0.5,
                  }}>
                    <Box sx={{
                      width: "100%",
                    }}>
                      <NeviosSearchBar 
                        loading={loading}
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        disabled={!enableSearch}
                        sx={{
                          opacity: enableSearch ? 1 : 0.5,
                          pointerEvents: enableSearch ? 'auto' : 'none'
                        }}
                      />
                    </Box>
                  </Box>
                </>
              )}
              
              {enableFilters && hasFilters && (
                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5,
                }}>
                  <NeviosSecondaryIconButton onClick={() => setShowFiltersBar(!showFiltersBar)}>
                    <TbFilterCog size={16} />
                  </NeviosSecondaryIconButton>
                </Box>
              )}
            </Box>
            
            {/* Filters Bar */}
            {enableFilters && hasFilters && (
              <Box
                sx={{
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  maxHeight: showFiltersBar ? '200px' : '0px',
                  opacity: showFiltersBar ? 1 : 0,
                  p: 0,
                }}
              >
                <Box sx={{ p: 1, backgroundColor: 'white' }}>
                  <NeviosEnhancedTableFilters
                    filterConfigs={filterConfigs}
                    activeFilters={activeFilters}
                    onFiltersChange={onFiltersChange}
                    loading={loading}
                  />
                </Box>
              </Box>
            )}
            
            {/* Error State */}
            {error && (
              <Box sx={{
                p: 2,
                textAlign: 'center',
                color: 'error.main',
                backgroundColor: 'error.light',
                borderRadius: 1,
                m: 2
              }}>
                Error: {error}
              </Box>
            )}
            
            {/* Data Grid */}
            <DataGrid
              disableRowSelectionOnClick={true}
              columnHeaderHeight={matchesSmBreakpoint ? 40 : 32}
              disableColumnSorting={true}
              disableColumnMenu={true}
              rowHeight={calculatedRowHeight}
              sortingOrder={sortingOrder}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              hideFooter={true}
              loading={loading}
              columns={columns}
              rows={data}
              
              // Use autoHeight instead of fixed height with scrolling
              autoHeight
              
              // Row selection
              checkboxSelection={checkboxSelection}
              rowSelectionModel={currentRowSelectionModel}
              onRowSelectionModelChange={handleRowSelectionModelChange}
              getRowId={(row) => row.id || row._id || row.key}
              
              // Pagination
              pagination={!hideFooter}
              paginationMode="server"
              rowCount={totalCount}
              paginationModel={pagination}
              onPaginationModelChange={handlePaginationModelChange}
              pageSizeOptions={[GLOBAL_PAGE_SIZE]}
              
              
              // Row interaction
              onRowClick={handleRowClick}
              
              sx={{
                [`.${gridClasses.cell}:focus, .${gridClasses.cell}:focus-within`]: {
                  outline: "none",
                },
                [`.${gridClasses.columnHeader}:focus, .${gridClasses.columnHeader}:focus-within`]: {
                  borderRadius: 0,
                  outline: "none",
                },
                ".datagrid-row-error": {
                  backgroundColor: theme.palette.red["50"],
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.red["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                  '[data-mui-color-scheme="dark"] &': {
                    backgroundColor: theme.palette.red["50"],
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.red["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                  },
                },
                ".datagrid-row-disabled": {
                  ".MuiCheckbox-root": {
                    visibility: "hidden",
                  },
                  opacity: 0.75,
                  backgroundColor: theme.palette.gray["50"],
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.gray["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                  '[data-mui-color-scheme="dark"] &': {
                    backgroundColor: theme.palette.gray["50"],
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${hslToHex(theme.palette.gray["200"])}' fill-opacity='0.75' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                  },
                },
                ".MuiDataGrid-menuIcon": {
                  display: "none",
                },
                ".MuiDataGrid-row": {
                  borderTop: `0.7px solid ${theme.palette.gray[200]}`,
                },
                '.MuiDataGrid-row, .MuiDataGrid-cell': {
                  cursor: 'default',
                },
                '.MuiDataGrid-row[role="row"]:hover': {
                  backgroundColor: theme.palette.action.hover,
                  cursor: onRowClick ? 'pointer' : 'default',
                },
                ...(variant === "simple" && {
                  borderRadius: 0,
                  ".MuiDataGrid-columnHeader": {
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                    backgroundColor: theme.palette.gray["50"],
                  },
                  border: "none",
                  ".MuiDataGrid-cell[aria-colindex='1']": {
                    paddingLeft: 0,
                  },
                  ".MuiDataGrid-columnHeader[aria-colindex='1']": {
                    paddingLeft: 0,
                  },
                }),
              }}
              
              {...props}
              
              slots={{
                ...props.slots,
                loadingOverlay: () => (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      height: "100%",
                      width: "100%",
                      pointerEvents: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 4,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        height: "100%",
                        width: "100%",
                        pointerEvents: "none",
                        zIndex: 5,
                        opacity: 0.5,
                        background: (theme) => `linear-gradient(to top,
                          ${theme.palette.background.paper},
                          ${theme.palette.background.paper} 100%
                        )`,
                      },
                    }}
                  >
                    <DotLoader loading={true} dotSize={6} />
                  </Box>
                ),
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      color: "gray.800",
                    }}
                  >
                    <Box sx={{ fontSize: "48px" }}>📋</Box>
                    <Box sx={{ fontSize: "16px", fontWeight: 500 }}>
                      {emptyStateProps.title || 'No data available'}
                    </Box>
                    <Box sx={{ fontSize: "14px", color: "gray.400" }}>
                      {emptyStateProps.description || 'There are no rows to display'}
                    </Box>
                    {emptyStateProps.action && (
                      <Button variant="contained" color="primary" onClick={emptyStateProps.action}>
                        {emptyStateProps.buttonText || 'Add New Item'}
                      </Button>
                    )}
                  </Box>
                ),
              }}
            />
          </Box>
        </div>
        
        {/* Regular footer (for intersection observer) */}
        <div ref={footerRef}>
          <FooterComponent />
        </div>
      </Paper>

      {/* Sticky footer */}
      {isFooterSticky && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: footerPosition.left,
            width: footerPosition.width,
            zIndex: 1000,
          }}
        >
          <FooterComponent />
        </Box>
      )}
    </>
  );
}

// Helper function from original component
function hslToHex(hslString) {
  if (!hslString) {
    return "";
  }
  const matches = hslString.match(/\d+/g);
  if (!matches) {
    return "";
  }
  const [h, s, l] = matches.map(Number);
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `${f(0)}${f(8)}${f(4)}`;
  };
  return hslToHex(h, s, l);
} 