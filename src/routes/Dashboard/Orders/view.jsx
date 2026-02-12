"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Avatar,
  TableRow,
  Paper,
  Tooltip
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { TbPencil, TbPackage, TbShoppingCart } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { NeviosDangerButton } from "../../../components/nevios/NeviosButtons";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import { useModuleRetrieve } from "../../../hooks/useModuleRetrieve";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import { getCountryName } from "../../../core/countryName";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";
import { ShippingAddressCard } from "../../../components/ShippingAddressCard";
import { NeviosBadge } from "../../../components/nevios/NeviosBadge";
import { NeviosCustomerCard } from "../../../components/nevios/NeviosCustomerCard";

export function OrderView({ orderId }) {
  const router = useRouter();

  // ✅ NEW: Use useModuleRetrieve hook to fetch order data via Express API
  const { 
    data: order, 
    loading, 
    error: fetchError, 
    refreshData 
  } = useModuleRetrieve('order', orderId, {
    expand: ['customer', 'items', 'pricing', 'items.pricing']
  });

  // Sort pricing components in logical order
  const sortedPricing = useMemo(() => {
    // Handle both array format and object with components array
    const pricingArray = Array.isArray(order?.pricing) 
      ? order.pricing 
      : order?.pricing?.components;
    
    if (!pricingArray || !Array.isArray(pricingArray)) return [];
    
    const sortOrder = {
      'subtotal': 1,
      'discount': 2,
      'shipping': 3,
      'payment': 4, 
      'tip': 5,
      'total': 6
    };
    
    return [...pricingArray].sort((a, b) => {
      return (sortOrder[a.component] || 99) - (sortOrder[b.component] || 99);
    });
  }, [order?.pricing]);

  const handleOpenDeleteDialog = () => {
    // Will implement later
    console.log('Delete dialog should open');
  };

  // Function to format pricing component label
  const formatPricingLabel = (component) => {
    // Capitalize first letter and handle special cases
    switch(component) {
      case 'subtotal':
        return 'Subtotal';
      case 'discount':
        return 'Discount';
      case 'shipping':
        return 'Shipping';
      case 'payment':
        return 'Payment fee';
      case 'tip':
        return 'Tip';
      case 'total':
        return 'Total';
      default:
        return component.charAt(0).toUpperCase() + component.slice(1);
    }
  };

  if (loading) {
    return <ContentLoadingScreen />;
  }

  if (fetchError || !order) {
    return (
      <PageContainer>
        <Box sx={{ p: 3 }}>
          <Typography color="error">
            {fetchError || 'Order not found'}
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      customSx={{
        maxWidth: "1000px"
      }}
    >
      <>
          <DashboardHeader
            title={order?.name || 'Order details'}
            icon={<TbShoppingCart size={24} />}
            iconOnClick={() => {router.push('/dashboard/orders')}}  
            iconTooltipTitle="Back to list of orders"
            badges={
              <Box sx={{ display: 'flex', gap: 1 }}>
                {order?.status && <NeviosBadge value={order.status} configKey="orderStatus" />}
                {order?.payment_status && <NeviosBadge value={order.payment_status} configKey="paymentStatus" />}
                {order?.fulfillment_status && <NeviosBadge value={order.fulfillment_status} configKey="orderFulfillmentStatus" />}
                {order?.inventory_status && <NeviosBadge value={order.inventory_status} configKey="inventoryStatus" />}
              </Box>
            }
            actions={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <NeviosDangerButton>Delete</NeviosDangerButton>
                <NeviosPaginationButtons
                  previousButtonOnClick={() => {}}
                  nextButtonOnClick={() => {}}
                />  
              </Box>
            }
            subtitle={order?.created_at ? `Created ${formatReadableDatetime(order.created_at)}` : ''}
          />
          <NeviosTwoColumnFormContainer
            mainContent={
              <>
                <NeviosFormPaper>
                  {!order?.items || order.items.length === 0 ? (
                    <Box sx={{ py: 2, textAlign: 'center' }}>
                      <Typography color="text.secondary">No products in this order</Typography>
                    </Box>
                  ) : (
                    <Box>
                      {/* Delivery method */}
                      {order.shipping_method && (
                        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
                          <Typography variant="body2x" color="text.secondary">Delivery method</Typography>
                          <Typography variant="body2x">
                            {typeof order.shipping_method === 'string' ? order.shipping_method : order.shipping_method?.name || ''}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ borderRadius: "12px", p: 0, border: '0.7px solid rgba(0, 0, 0, 0.12)' }}>
                        {order.items.map((item, idx) => (
                          <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', px: 1.5, py: 1.5, borderBottom: idx !== order.items.length - 1 ? '0.7px solid rgba(0, 0, 0, 0.12)' : 'none', gap: 2 }}>
                            <Avatar src={item.image} alt={item.handle || 'Product'} icon={<TbPackage />} sx={{ width: 45, height: 45, borderRadius: "12px", backgroundColor: "#fafbfc", border: "0.7px solid rgba(0, 0, 0, 0.12)" }} />
                            <Box sx={{ flex: 1, minWidth: 0, gap: 0.5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product_title || 'Unknown product'}</Typography>
                                <Typography sx={{ fontSize: "12px", fontWeight: 500, backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: "8px", width: "fit-content" }}>{item.variant_title || 'Unknown'}</Typography>
                                  {item.sku && (
                                    <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "text.secondary" }}>SKU: {item.sku}</Typography>
                                  )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 180, justifyContent: 'flex-end' }}>
                              <Typography variant="body2x" sx={{ minWidth: 80, textAlign: 'right' }}>{order.local_currency} {formatCurrencyNumber(item.pricing?.price || 0)}</Typography>
                              <Typography variant="body2x"> × {item.quantity || 1}</Typography>
                              <Typography variant="body2x" sx={{ minWidth: 80, textAlign: 'right' }}>{order.local_currency} {formatCurrencyNumber(item.pricing?.line_price || 0)}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </NeviosFormPaper>
                
                <NeviosFormPaper>
                  {sortedPricing.length === 0 ? (
                    <Box sx={{ py: 2, textAlign: 'center' }}>
                      <Typography color="text.secondary">No pricing information available</Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableBody>
                          {sortedPricing.map((pricing, index) => {
                            const isTotal = pricing.component === 'total';
                            const isSubtotal = pricing.component === 'subtotal';
                            const isDiscount = pricing.component === 'discount';
                            const value = isDiscount ? -pricing.gross_local : pricing.gross_local;
                            
                            
                            // Add a divider before the total row
                            if (isTotal && index > 0) {
                              return (
                                <TableRow key={pricing.component} sx={{ borderTop: "0.7px solid rgba(0, 0, 0, 0.12)" }}>
                                  <TableCell 
                                    component="th" 
                                    scope="row"
                                    sx={{ 
                                      fontWeight: 600,
                                      color: "text.secondary",
                                      borderBottom: "none",
                                      paddingTop: 1,
                                      paddingBottom: 1
                                    }}
                                  >
                                    <Typography 
                                      variant="subtitle2" 
                                      fontWeight={600}
                                    >
                                      {formatPricingLabel(pricing.component)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell 
                                    align="right"
                                    sx={{ 
                                      fontWeight: 600,
                                      color: "text.primary",
                                      borderBottom: "none",
                                      paddingTop: 1,
                                      paddingBottom: 1
                                    }}
                                  >
                                    <Typography 
                                      variant="subtitle2" 
                                      fontWeight={600}
                                    >
                                      {order.local_currency} {formatCurrencyNumber(value)}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                            
                            return (
                              <TableRow key={pricing.component}>
                                <TableCell 
                                  component="th" 
                                  scope="row"
                                  sx={{ 
                                    fontWeight: isTotal ? 600 : 400,
                                    color: isDiscount ? "error.main" : "text.secondary",
                                    border: 0,
                                    paddingTop: isSubtotal ? 1.5 : 1,
                                    paddingBottom: isSubtotal ? 1 : 1
                                  }}
                                >
                                  <Typography 
                                    variant={isTotal ? "subtitle2" : "body2"} 
                                    fontWeight={isTotal ? 600 : 400}
                                  >
                                    {formatPricingLabel(pricing.component)}
                                  </Typography>
                                </TableCell>
                                <TableCell 
                                  align="right"
                                  sx={{ 
                                    fontWeight: isTotal ? 600 : 400,
                                    color: isDiscount ? "error.main" : "text.primary",
                                    border: 0,
                                    paddingTop: isSubtotal ? 1.5 : 1,
                                    paddingBottom: isSubtotal ? 1 : 1
                                  }}
                                >
                                  <Typography 
                                    variant={isTotal ? "subtitle2" : "body2"} 
                                    fontWeight={isTotal ? 600 : 400}
                                  >
                                    {order.local_currency} {formatCurrencyNumber(value)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </NeviosFormPaper>
              </>
            }
            sideContent={
              <>
                <NeviosFormPaper 
                  title="Notes" 
                  gap={4} 
                  icon={<TbPencil />}
                  description={order?.customer_note || order?.internal_note ? undefined : "No notes from customer"}
                >
                  {order?.customer_note && (
                    <NeviosFormPaperBlock title="Customer Note">
                      <Typography variant="body2">{order.customer_note}</Typography>
                    </NeviosFormPaperBlock>
                  )}
                  {order?.internal_note && (
                    <NeviosFormPaperBlock title="Internal Note">
                      <Typography variant="body2" color="text.secondary">{order.internal_note}</Typography>
                    </NeviosFormPaperBlock>
                  )}
                </NeviosFormPaper>
                <NeviosCustomerCard 
                  customer={order?.customer}
                  billingAddress={order?.billing_address_log}
                  showBillingAddress={true}
                />
                  <ShippingAddressCard address={order?.shipping_address_log} />
              </>
            }
          />
        </>
    </PageContainer>
  );
}