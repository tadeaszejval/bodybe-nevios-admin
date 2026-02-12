"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Box,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
  Link,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { TbTruckDelivery, TbExternalLink, TbPackage, TbReceipt, TbArrowLeft, TbClock } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { formatReadableDatetime } from "../../../core/formatters";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { NeviosBadge } from "../../../components/nevios/NeviosBadge";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import NeviosGroupButton from "../../../components/nevios/NeviosGroupButton";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";
import { ShippingAddressCard } from "../../../components/ShippingAddressCard";
import { NeviosCustomerCard } from "../../../components/nevios/NeviosCustomerCard";
import { NeviosOrderCard } from "../../../components/nevios/NeviosOrderCard";
import { useModuleRetrieve } from "../../../hooks/useModuleRetrieve";

export function FulfillmentView({ fulfillmentId }) {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // ✅ Use useModuleRetrieve hook to fetch fulfillment data via Express API
  // Note: Only expand items, shipping_address, and tracking_history
  // Customer and order cards fetch their own data by ID
  const { 
    data: fulfillment, 
    loading, 
    error: fetchError, 
    refreshData 
  } = useModuleRetrieve('fulfillment', fulfillmentId, {
    expand: ['items', 'shipping_address', 'tracking_history']
  });

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFulfill = async () => {
    // TODO: Implement with separate endpoint
    console.log('Fulfill clicked for fulfillment:', fulfillmentId);
  };

  const handleUnfulfill = async () => {
    // TODO: Implement with separate endpoint
    console.log('Unfulfill clicked for fulfillment:', fulfillmentId);
  };

  const handleAddTracking = async () => {
    // TODO: Implement with separate endpoint
    console.log('Add tracking clicked for fulfillment:', fulfillmentId);
  };

  const handleCancel = async () => {
    // TODO: Implement with separate endpoint
    console.log('Cancel clicked for fulfillment:', fulfillmentId);
  };

  // Build complete tracking history including initial creation (newest first)
  const completeTrackingHistory = useMemo(() => {
    if (!fulfillment) return [];

    const history = fulfillment.tracking_history || [];
    const allStatuses = [];

    // Add initial "Created" status using fulfillment creation date
    allStatuses.push({
      id: 'created',
      new_delivery_status: 'CREATED',
      new_carrier_status: null,
      created_at: fulfillment.created_at
    });

    // Add all tracking history entries
    allStatuses.push(...history);

    // Reverse to show newest first (latest at top)
    return allStatuses.reverse();
  }, [fulfillment]);

  if (loading) {
    return <ContentLoadingScreen />;
  }

  if (fetchError || !fulfillment) {
    return (
      <PageContainer>
        <Alert severity="error">
          {fetchError || 'Fulfillment not found'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<TbArrowLeft />} 
            onClick={() => router.push('/dashboard/fulfillments')}
          >
            Back to Fulfillments
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      customSx={{
        maxWidth: "950px"
      }}
    >
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <DashboardHeader
        title={fulfillment.name || "Fulfillment"}
        icon={<TbTruckDelivery size={24} />}
        iconOnClick={() => {router.push('/dashboard/fulfillments')}}
        iconTooltipTitle="Back to fulfillments"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <NeviosGroupButton
              buttonText="Actions"
              menuItems={[
                { 
                  label: 'Fulfill Package', 
                  onClick: handleFulfill,
                  disabled: fulfillment.status === 'FULFILLED'
                },
                { 
                  label: 'Unfulfill Package', 
                  onClick: handleUnfulfill,
                  disabled: fulfillment.status !== 'FULFILLED' || ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(fulfillment.delivery_status)
                },
                { 
                  label: 'Add Tracking', 
                  onClick: handleAddTracking
                },
                { 
                  label: 'Cancel Fulfillment', 
                  onClick: handleCancel,
                  disabled: fulfillment.status === 'FULFILLED'
                }
              ]}
            />
            <NeviosPaginationButtons
              previousButtonOnClick={() => {}}
              nextButtonOnClick={() => {}}
            />  
          </Box>
        }
        subtitle={`Created ${formatReadableDatetime(fulfillment.created_at)}`}
        badges={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <NeviosBadge value={fulfillment.status} configKey="fulfillmentModuleStatus" />
            <NeviosBadge value={fulfillment.delivery_status} configKey="deliveryStatus" />
          </Box>
        }
      />
      
      <NeviosTwoColumnFormContainer
        mainContent={
          <>
            <NeviosFormPaper title="Items">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {fulfillment.items && fulfillment.items.length > 0 ? (
                  fulfillment.items.map((item, index) => (
                    <Box 
                      key={item.id || index}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        border: '1px solid',
                        gap: 1,
                        px: 1.5,
                        py: 1.5,
                        borderColor: 'grey.200',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'grey.50'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar src={item.order_item?.image} alt={item.order_item?.product_title} icon={<TbPackage />} sx={{ width: 45, height: 45, borderRadius: "12px", backgroundColor: "#fafbfc", border: "0.7px solid rgba(0, 0, 0, 0.12)" }} />
                      </Box>
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {item.order_item?.product_title || 'Unknown Product'}
                        </Typography>
                        {item.order_item?.variant_title && (
                          <Typography sx={{ fontSize: "12px", fontWeight: 500, backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "8px", width: "fit-content" }}>
                            {item.order_item.variant_title}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          SKU: {item.order_item?.sku || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Quantity: <strong>{item.shipped_quantity}</strong>
                        </Typography>

                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">No items found</Typography>
                )}
              </Box>
            </NeviosFormPaper>

            {completeTrackingHistory.length > 0 && (
              <NeviosFormPaper title="Tracking History" titleIcon={<TbClock size={16} />}>
                <TableContainer component={Paper} elevation={0}>
                  <Table size="small">
                    <TableBody>
                      {completeTrackingHistory.map((history, index) => (
                        <TableRow
                          key={history.id}
                          sx={{
                            "&:last-child td": {
                              borderBottom: "none",
                            }
                          }}
                        >
                          <TableCell sx={{ padding: "10px 15px", borderBottom: index !== completeTrackingHistory.length - 1 ? "1px solid" : "none", borderColor: "grey.200" }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <NeviosBadge
                                value={history.new_delivery_status}
                                configKey="deliveryStatus"
                              />
                              {history.new_carrier_status && (
                                <Typography variant="caption" color="text.secondary">
                                  {history.new_carrier_status}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ padding: "10px 15px", borderBottom: index !== completeTrackingHistory.length - 1 ? "1px solid" : "none", borderColor: "grey.200" }}>
                            <Typography variant="body2" color="text.secondary">
                              {formatReadableDatetime(history.created_at)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </NeviosFormPaper>
            )}
          </>
        }
        sideContent={
          <>

            <ShippingAddressCard address={fulfillment?.shipping_address} />
            <NeviosCustomerCard 
              customer={fulfillment?.customer}
              showBillingAddress={false}
            />

            <NeviosOrderCard 
              order={fulfillment?.order}
              showTotalAmount={true}
              showCreatedDate={true}
              showOrderStatus={true}
            />
          </>
        }
      />
    </PageContainer>
  );
} 