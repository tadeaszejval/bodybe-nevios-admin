"use client";
import { Box, Button, useMediaQuery, useTheme, Paper, Typography } from "@mui/material";
import { NeviosSecondaryIconButton, NeviosSimpleToggleButton } from "./NeviosButtons";
import { TbFilterCog, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import * as React from "react";
import { CircularProgress } from "@mui/material";
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
 * @param {string|number} props.buttonHeight - Custom height for all buttons in the table
 * @param {string|number} props.buttonWidth - Custom width for all buttons in the table
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
  buttonHeight,
  buttonWidth,
  sx: customSx,
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

  // Footer component
  const FooterComponent = React.memo(({ 
    isFooterSticky, 
    theme, 
    handlePreviousPage, 
    handleNextPage, 
    hasPreviousPage, 
    hasNextPage, 
    loading, 
    totalCount, 
    startRecord, 
    endRecord,
    buttonHeight,
    buttonWidth
  }) => (
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
        borderTop: isFooterSticky ? `1px solid ${theme.palette.gray[200]}` : 'none'
      }}
    >
      {/* Left side - Navigation buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
          <NeviosSecondaryIconButton 
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage || loading}
            height={buttonHeight}
            width={buttonWidth}
          >
            <TbChevronLeft size={16} />
          </NeviosSecondaryIconButton>
          <NeviosSecondaryIconButton 
            onClick={handleNextPage}
            disabled={!hasNextPage || loading}
            height={buttonHeight}
            width={buttonWidth}
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
  ));

  return (
    <>
      <Paper 
        ref={containerRef}
        elevation={2} 
        sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          marginBottom: isFooterSticky ? '45px' : '0', // Add margin when footer is sticky
          height: tableHeight || '350px', // Set a default height to enable proper scrolling
          minHeight: '250px' // Minimum height to ensure table is usable
        }}
      >
        <div
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Prevent outer container from scrolling
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: "100%",
              borderTop: (theme) => `0.5px solid ${theme.palette.gray[200]}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Prevent this container from scrolling
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
              flexShrink: 0, // Prevent controls from shrinking
            }}>
              <Box sx={{
                display: "none",
                maxWidth: "200px",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.5,
              }}>
                <NeviosSimpleToggleButton 
                  toggled={true}
                  height={buttonHeight}
                  width={buttonWidth}
                >
                  Active
                </NeviosSimpleToggleButton>
                <NeviosSimpleToggleButton
                  height={buttonHeight}
                  width={buttonWidth}
                >
                  Inactive
                </NeviosSimpleToggleButton>
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
              
              {enableFilters && hasFilters && (
                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5,
                }}>
                  <NeviosSecondaryIconButton 
                    onClick={() => setShowFiltersBar(!showFiltersBar)}
                    height={buttonHeight}
                    width={buttonWidth}
                  >
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
                  flexShrink: 0, // Prevent filters from shrinking
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
                m: 2,
                flexShrink: 0, // Prevent error box from shrinking
              }}>
                Error: {error}
              </Box>
            )}
            
            {/* Data Grid Container */}
            <Box
              sx={{
                flex: 1,
                width: "100%",
                overflow: "auto", // Enable both horizontal and vertical scrolling
                minHeight: 0, // Allow flex child to shrink below content size
                position: 'relative', // For absolute positioning of empty state
              }}
            >
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
                hideFooterPagination={true}
                disableColumnSelector={true}
                disableColumnFilter={true}
                
                // Remove autoHeight to enable proper scrolling
                // autoHeight
                
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
                  height: '100%', // Always fill container height
                  width: '100%',
                  minWidth: data.length === 0 ? '100%' : 'max-content', // Full width when empty, content width when data
                  position: 'relative', // Ensure overlays position correctly
                  // Merge custom sx from props first
                  ...(customSx || {}),
                  // Hide column headers when no data - apply after custom sx to ensure it takes precedence
                  ...(data.length === 0 && {
                    '.MuiDataGrid-columnHeaders': {
                      display: 'none !important',
                    },
                    '.MuiDataGrid-virtualScroller': {
                      marginTop: '0 !important',
                      height: '100% !important',
                    },
                    '.MuiDataGrid-main': {
                      height: '100%',
                    },
                  }),
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
                  // Custom overlay positioning - ensure overlays fill the entire DataGrid
                  '.MuiDataGrid-overlayWrapper': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    minHeight: data.length === 0 ? '100%' : '250px',
                    zIndex: 10,
                  },
                  '.MuiDataGrid-overlayWrapperInner': {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        width: '100%',
                        height: '100%',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        minHeight: '250px',
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ),
                  noRowsOverlay: () => (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: '250px',
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          color: "gray.800",
                          textAlign: "center",
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
                    </Box>
                  ),
                }}
              />
            </Box>
          </Box>
        </div>
        
        {/* Regular footer (for intersection observer) */}
        <div ref={footerRef}>
          <FooterComponent 
            isFooterSticky={isFooterSticky}
            theme={theme}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            loading={loading}
            totalCount={totalCount}
            startRecord={startRecord}
            endRecord={endRecord}
            buttonHeight={buttonHeight}
            buttonWidth={buttonWidth}
          />
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
          <FooterComponent 
            isFooterSticky={isFooterSticky}
            theme={theme}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            loading={loading}
            totalCount={totalCount}
            startRecord={startRecord}
            endRecord={endRecord}
            buttonHeight={buttonHeight}
            buttonWidth={buttonWidth}
          />
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