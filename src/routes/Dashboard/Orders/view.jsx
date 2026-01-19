"use client";
import { 
  Box, 
  Typography,
  CircularProgress,
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
import NeviosGroupButton from "../../../components/nevios/NeviosGroupButton";
import { NeviosShadowButton, NeviosDangerButton } from "../../../components/nevios/NeviosButtons";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { supabase } from "../../../utils/supabase";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import { getCountryName } from "../../../core/countryName";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";
import { ShippingAddressDisplay } from "../../../components/ShippingAddressDisplay";
import { NeviosBadge } from "../../../components/nevios/NeviosBadge";

export function OrderView({ orderId }) {
  const [order, setOrder] = useState({ name: '', created_at: null });
  const [orderItems, setOrderItems] = useState([]);
  const [orderPricing, setOrderPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [pricingLoading, setPricingLoading] = useState(true);
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*, local_currency')
          .eq('id', orderId)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          return;
        }

        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchOrderItems() {
      try {
        setItemsLoading(true);
        
        // Fetch the order items
        const { data: items, error: itemsError } = await supabase
          .from('order_item')
          .select('*')
          .eq('"order"', orderId);
          
        if (itemsError) throw itemsError;
        
        if (items && items.length > 0) {
          // Get all the item IDs to fetch their pricing
          const itemIds = items.map(item => item.id);
          
          // Fetch pricing for all items
          const { data: pricingData, error: pricingError } = await supabase
            .from('order_items_pricing')
            .select('*')
            .in('order_item', itemIds);
            
          if (pricingError) throw pricingError;
          
          // Combine items with their pricing
          const itemsWithPricing = items.map(item => {
            const pricing = pricingData?.find(p => p.order_item === item.id) || null;
            return { ...item, pricing };
          });
          
          setOrderItems(itemsWithPricing);
        } else {
          setOrderItems([]);
        }
      } catch (error) {
        console.error('Error fetching order items:', error);
      } finally {
        setItemsLoading(false);
      }
    }

    async function fetchOrderPricing() {
      try {
        setPricingLoading(true);
        
        // Fetch order pricing components
        const { data: pricingData, error: pricingError } = await supabase
          .from('orders_pricing')
          .select('*')
          .eq('order_id', orderId);
          
        if (pricingError) throw pricingError;
        
        if (pricingData) {
          // Sort pricing components in logical order
          const sortOrder = {
            'subtotal': 1,
            'discount': 2,
            'shipping': 3,
            'payment': 4, 
            'tip': 5,
            'total': 6
          };
          
          const sortedPricing = pricingData.sort((a, b) => {
            return (sortOrder[a.component] || 99) - (sortOrder[b.component] || 99);
          });
          
          setOrderPricing(sortedPricing);
        }
      } catch (error) {
        console.error('Error fetching order pricing:', error);
      } finally {
        setPricingLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
      fetchOrderItems();
      fetchOrderPricing();
    }
  }, [orderId]);

  useEffect(() => {
    async function fetchCustomerAndAddresses() {
      try {
        setCustomerLoading(true);
        // Fetch customer
        let customerData = null;
        if (order.customer) {
          const { data: cust, error: custErr } = await supabase
            .from('customers')
            .select('*')
            .eq('id', order.customer)
            .single();
          if (custErr) throw custErr;
          customerData = cust;
          setCustomer(cust);
        }
        // Fetch billing address
        if (order.billing_address) {
          const { data: billing, error: billingErr } = await supabase
            .from('billing_address')
            .select('*')
            .eq('id', order.billing_address)
            .single();
          if (billingErr) throw billingErr;
          setBillingAddress(billing);
        }
        // Fetch shipping address
        if (order.shipping_address) {
          const { data: shipping, error: shippingErr } = await supabase
            .from('shipping_address')
            .select('*')
            .eq('id', order.shipping_address)
            .single();
          if (shippingErr) throw shippingErr;
          setShippingAddress(shipping);
        }
      } catch (err) {
        console.error('Error fetching customer or addresses:', err);
      } finally {
        setCustomerLoading(false);
      }
    }
    if (order && order.customer) {
      fetchCustomerAndAddresses();
    }
  }, [order]);

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

  return (
    <PageContainer
      customSx={{
        maxWidth: "1000px"
      }}
    >
      <>
          <DashboardHeader
            title={`${order.name || 'Order details'}`}
            icon={<TbShoppingCart size={24} />}
            iconOnClick={() => {router.push('/dashboard/orders')}}  
            iconTooltipTitle="Back to list of orders"
            badges={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <NeviosBadge value={order.status} configKey="orderStatus" />
                <NeviosBadge value={order.payment_status} configKey="paymentStatus" />
                <NeviosBadge value={order.fulfillment_status} configKey="orderFulfillmentStatus" />
                <NeviosBadge value={order.inventory_status} configKey="inventoryStatus" />
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
            subtitle={order.created_at ? `Created ${formatReadableDatetime(order.created_at)}` : ''}
          />
          <NeviosTwoColumnFormContainer
            mainContent={
              <>
                <NeviosFormPaper>
                  {itemsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : orderItems.length === 0 ? (
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
                        {orderItems.map((item, idx) => (
                          <Box key={item.id} sx={{ display: 'flex', alignItems: 'flex-start', px: 1.5, py: 1.5, borderBottom: idx !== orderItems.length - 1 ? '0.7px solid rgba(0, 0, 0, 0.12)' : 'none', gap: 2 }}>
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
                  {pricingLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : orderPricing.length === 0 ? (
                    <Box sx={{ py: 2, textAlign: 'center' }}>
                      <Typography color="text.secondary">No pricing information available</Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableBody>
                          {orderPricing.map((pricing, index) => {
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
                  description="No notes from customer"
                >
                </NeviosFormPaper>
                <NeviosFormPaper title="Customer" gap={3}>
                  {customerLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : !customer ? (
                    <Typography color="text.secondary">No customer data</Typography>
                  ) : (
                    <>
                      <NeviosFormPaperBlock>
                        <Tooltip title="View customer profile">
                          <Typography 
                            onClick={() => router.push(`/dashboard/customers/${customer.id}`)} 
                            variant="body2x" 
                            sx={{ width: 'fit-content', cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                        >
                          {customer.first_name} {customer.last_name}
                        </Typography>
                        </Tooltip>
                        {customer.email && <NeviosCopyBlock copyValue={customer.email} />}
                        {customer.phone && <NeviosCopyBlock copyValue={customer.phone} />}
                        {customer.country && (
                          <Typography variant="body2" color="text.secondary">
                            {getCountryName(customer.country)}
                          </Typography>
                        )}
                      </NeviosFormPaperBlock>
                      <NeviosFormPaperBlock title="Billing Address">
                        {billingAddress ? (
                          <>
                            <Typography variant="body2">{billingAddress.first_name} {billingAddress.last_name}</Typography>
                            {billingAddress.company && (
                              <Typography variant="body2">{billingAddress.company}</Typography>
                            )}
                            <Typography variant="body2">{billingAddress.address}</Typography>
                            <Typography variant="body2">{billingAddress.city}, {billingAddress.zip}</Typography>
                            <Typography variant="body2">{getCountryName(billingAddress.country)}</Typography>
                            {billingAddress.company_id && (
                              <Typography variant="body2x">ID: {billingAddress.company_id}</Typography>
                            )}
                            {billingAddress.company_vat && (
                              <Typography variant="body2x">VAT: {billingAddress.company_vat}</Typography>
                            )}
                          </>
                        ) : (
                          <Typography color="text.secondary">No billing address</Typography>
                        )}
                      </NeviosFormPaperBlock>
                    </>
                  )}
                </NeviosFormPaper>
                <ShippingAddressDisplay address={shippingAddress} />
              </>
            }
          />
        </>
    </PageContainer>
  );
}