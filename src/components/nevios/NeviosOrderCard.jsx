"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Tooltip, CircularProgress } from "@mui/material";
import { TbShoppingCart } from "react-icons/tb";
import { NeviosFormPaper } from "./NeviosFormPaper";
import { NeviosFormPaperBlock } from "./NeviosFormPaperBlock";
import { NeviosBadge } from "./NeviosBadge";
import { formatReadableDatetime, formatCurrencyNumber } from "../../core/formatters";
import { useModuleRetrieve } from "../../hooks/useModuleRetrieve";

/**
 * NeviosOrderCard - Reusable order information card component
 * 
 * @param {Object} props - Component props
 * @param {Object|string} props.order - Order object with details OR order ID string
 * @param {string} props.order.id - Order ID (if object)
 * @param {string} props.order.name - Order name/number (if object)
 * @param {string} props.order.created_at - Order creation date (optional)
 * @param {string} props.order.status - Order status (optional)
 * @param {string} props.order.payment_status - Payment status (optional)
 * @param {string} props.order.fulfillment_status - Fulfillment status (optional)
 * @param {string} props.order.inventory_status - Inventory status (optional)
 * @param {number} props.order.total_amount - Order total amount (optional)
 * @param {string} props.order.local_currency - Currency code (optional)
 * @param {Object} props.order.customer - Customer object (optional)
 * @param {boolean} props.showOrderStatus - Show order lifecycle status badge (default: false)
 * @param {boolean} props.showPaymentStatus - Show payment status badge (default: false)
 * @param {boolean} props.showFulfillmentStatus - Show fulfillment status badge (default: false)
 * @param {boolean} props.showInventoryStatus - Show inventory status badge (default: false)
 * @param {boolean} props.showTotalAmount - Show order total amount (default: true)
 * @param {boolean} props.showCustomer - Show customer name with link (default: false)
 * @param {boolean} props.showCreatedDate - Show order creation date (default: true)
 * 
 * @example
 * // With order object (no API call)
 * <NeviosOrderCard 
 *   order={payment.order} 
 *   showTotalAmount={true}
 *   showCreatedDate={true}
 * />
 * 
 * @example
 * // With order ID (fetches data internally)
 * <NeviosOrderCard 
 *   order="order-uuid-123"
 *   showPaymentStatus={true}
 *   showFulfillmentStatus={true}
 * />
 */
export function NeviosOrderCard({ 
  order,
  showOrderStatus = false,
  showPaymentStatus = false,
  showFulfillmentStatus = false,
  showInventoryStatus = false,
  showTotalAmount = true,
  showCustomer = false,
  showCreatedDate = true
}) {
  const router = useRouter();

  // Determine if order is an ID string or an object
  const orderId = typeof order === 'string' ? order : order?.id;
  const isOrderObject = typeof order === 'object' && order !== null;

  // Only fetch if order is provided as ID string (not object)
  const { 
    data: fetchedOrder, 
    loading, 
    error 
  } = useModuleRetrieve('order', orderId, {
    expand: showCustomer ? ['customer'] : [],
    autoFetch: !isOrderObject && !!orderId
  });

  // Use provided order object or fetched order
  const orderData = isOrderObject ? order : fetchedOrder;

  // Show loading state
  if (loading) {
    return (
      <NeviosFormPaper title="Order" titleIcon={<TbShoppingCart size={16} />}>
        <CircularProgress size={20} />
      </NeviosFormPaper>
    );
  }

  // Show error state
  if (error) {
    return (
      <NeviosFormPaper title="Order" titleIcon={<TbShoppingCart size={16} />}>
        <Typography color="error">Error loading order</Typography>
      </NeviosFormPaper>
    );
  }

  if (!orderData) {
    return (
      <NeviosFormPaper title="Order" titleIcon={<TbShoppingCart size={16} />}>
        <Typography color="text.secondary">No order data</Typography>
      </NeviosFormPaper>
    );
  }

  return (
    <NeviosFormPaper title="Order" titleIcon={<TbShoppingCart size={16} />}>
      <NeviosFormPaperBlock>

        {/* Order Name - Clickable Link */}
        <Tooltip title="View order details">
          <Typography 
            onClick={() => router.push(`/dashboard/orders/${orderData.id}`)} 
            variant="body2x" 
            sx={{ 
              width: 'fit-content', 
              cursor: 'pointer', 
              color: 'primary.main', 
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            {orderData.name}
          </Typography>
        </Tooltip>

        {/* Total Amount */}
        {showTotalAmount && orderData.total_price_gross && (
          <Typography variant="body2x">
            {orderData.local_currency || orderData.home_currency || 'CZK'} {formatCurrencyNumber(orderData.total_price_gross)}
          </Typography>
        )}

        {/* Created Date */}
        {showCreatedDate && orderData.created_at && (
          <Typography variant="body2" color="text.secondary">
            {formatReadableDatetime(orderData.created_at)}
          </Typography>
        )}

        {/* Status Badges */}
        {(showOrderStatus || showPaymentStatus || showFulfillmentStatus || showInventoryStatus) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
            {showOrderStatus && orderData.status && (
              <NeviosBadge value={orderData.status} configKey="orderStatus" />
            )}
            {showPaymentStatus && orderData.payment_status && (
              <NeviosBadge value={orderData.payment_status} configKey="paymentStatus" showDot={true} />
            )}
            {showFulfillmentStatus && orderData.fulfillment_status && (
              <NeviosBadge value={orderData.fulfillment_status} configKey="orderFulfillmentStatus" />
            )}
            {showInventoryStatus && orderData.inventory_status && (
              <NeviosBadge value={orderData.inventory_status} configKey="inventoryStatus" />
            )}
          </Box>
        )}

        {/* Customer Name - Optional */}
        {showCustomer && orderData.customer && (
          <Tooltip title="View customer profile">
            <Typography 
              onClick={() => router.push(`/dashboard/customers/${orderData.customer.id}`)} 
              variant="body2" 
              sx={{ 
                width: 'fit-content', 
                cursor: 'pointer', 
                color: 'primary.main', 
                '&:hover': { textDecoration: 'underline' },
                mt: 0.5
              }}
            >
              Customer: {orderData.customer.first_name} {orderData.customer.last_name}
            </Typography>
          </Tooltip>
        )}
      </NeviosFormPaperBlock>
    </NeviosFormPaper>
  );
}
