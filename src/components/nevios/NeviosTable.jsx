"use client";
import { Box, Button, useMediaQuery, useTheme, Typography } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import * as React from "react";
import { CircularProgress } from "@mui/material";
import { NeviosPaper } from "./NeviosPaper";
export const defaultAscendingSortOrder = ["asc", "desc", null];
export const defaultDescendingSortOrder = ["desc", "asc", null];

// Global pagination settings 
const GLOBAL_PAGE_SIZE = 50;

/**
 * NeviosTable - simplified table component
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column definitions
 * @param {Array} props.data - Table data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {number} props.totalCount - Total number of records
 * @param {Function} props.onRowClick - Row click handler
 * @param {Object} props.emptyStateProps - Empty state configuration
 * @param {string} props.tableHeight - Table height
 * @param {number} props.rowHeight - Row height
 * @param {Array} props.sortingOrder - Sorting order
 * @param {boolean} props.hideFooter - Whether to hide footer
 * @param {Object} props.pagination - Pagination state
 * @param {Function} props.onPaginationChange - Pagination change handler
 * @param {Array} props.sortModel - Sort model
 * @param {Function} props.onSortChange - Sort change handler
 */
export function NeviosTable({
  columns,
  data = [],
  loading = false,
  error = null,
  totalCount = 0,
  onRowClick,
  emptyStateProps = {},
  tableHeight,
  rowHeight = 'auto', // Default to 'auto' for dynamic row heights
  sortingOrder = defaultAscendingSortOrder,
  hideFooter = true,
  pagination = { page: 0, pageSize: GLOBAL_PAGE_SIZE },
  onPaginationChange,
  sortModel = [],
  onSortChange,
  elevation = false,
  sx: customSx,
  ...props
}) {
  const theme = useTheme();
  const matchesSmBreakpoint = useMediaQuery(theme.breakpoints.up("sm"));
  
  // Sticky footer state
  const [isFooterSticky, setIsFooterSticky] = React.useState(false);
  const [footerPosition, setFooterPosition] = React.useState({ left: 0, width: '100%' });
  const footerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  
  // Determine row height configuration
  // If rowHeight is 'auto', use getRowHeight function
  // If rowHeight is a number, use that fixed height
  const rowHeightConfig = rowHeight === 'auto' 
    ? { getRowHeight: () => 'auto' }
    : { rowHeight: rowHeight };
  
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
    endRecord
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
      {/* Left side - Pagination info */}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        {totalCount > 0 ? (
          <Typography variant="body2" color="gray.600">
            {startRecord}-{endRecord} of {totalCount.toLocaleString()}
          </Typography>
        ) : (
          <Typography variant="body2" color="gray.600">
            No records
          </Typography>
        )}
      </Box>
    </Box>
  ));

  return (
    <>
      <NeviosPaper 
        ref={containerRef}
        elevation={elevation ? 2 : 0} 
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
            borderRadius: "12px",
            flexDirection: "column",
            overflow: "hidden", // Prevent outer container from scrolling
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Prevent this container from scrolling
            }}
          >
            
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
                {...rowHeightConfig}
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
                  '.MuiDataGrid-row': {
                    border: "none",
                    borderBottom: `1px solid ${theme.palette.gray[200]}`,
                  },
                  '.MuiDataGrid-cell': {
                    cursor: 'default',
                    border: "none",
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
                  // Simple variant styling (default)
                  borderRadius: 0,
                  ".MuiDataGrid-columnHeader": {
                    borderTopRightRadius: 0,
                    borderTopLeftRadius: 0,
                    backgroundColor: theme.palette.gray["50"],
                  },
                  border: "none",
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
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        textAlign: "center",
                        py: 4,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {emptyStateProps.title || 'No data available'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 400 }}>
                        {emptyStateProps.description || 'There are no rows to display'}
                      </Typography>
                      {emptyStateProps.action && (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={emptyStateProps.action}
                          sx={{ mt: 1 }}
                        >
                          {emptyStateProps.buttonText || 'Add New Item'}
                        </Button>
                      )}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Box>
        </div>
        
        {/* Regular footer (for intersection observer) */}
        {!hideFooter && (
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
          />
        </div>
        )}
      </NeviosPaper>

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

