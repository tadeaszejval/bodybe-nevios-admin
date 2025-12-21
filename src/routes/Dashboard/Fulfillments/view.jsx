"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Box,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Link,
  Avatar
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { TbTruckDelivery, TbExternalLink, TbPackage } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { supabase } from "../../../utils/supabase";
import { formatReadableDatetime } from "../../../core/formatters";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { FulfillmentStatusBadge } from "../../../components/dashboard/fulfillments/FulfillmentStatusBadge";
import { DeliveryStatusBadge } from "../../../components/dashboard/fulfillments/DeliveryStatusBadge";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import { getCountryName } from "../../../core/countryName";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";

export function FulfillmentView({ fulfillmentId }) {
  const router = useRouter();
  const [fulfillment, setFulfillment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Fetch fulfillment data
  useEffect(() => {
    if (!fulfillmentId) return;

    const fetchFulfillment = async () => {
      try {
        setLoading(true);
        
        // Fetch the fulfillment data with related information
        const { data, error } = await supabase
          .from('fulfillments')
          .select(`
            *,
            customer:customers(id, first_name, last_name, email, phone),
            order:orders(id, name),
            shipping_address:shipping_address(
              id, first_name, last_name, company, address, additional_address, 
              city, province, country, zip
            ),
            items:fulfillment_items(
              id, shipped_quantity,
              order_item:order_item(
                id, quantity, product_title, sku, variant_title, image
              )
            )
          `)
          .eq('id', fulfillmentId)
          .single();
          
        if (error) throw error;
        
        setFulfillment(data);
      } catch (err) {
        console.error("Error fetching fulfillment:", err);
        setSnackbar({
          open: true,
          message: "Failed to load fulfillment: " + (err.message || "Unknown error"),
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFulfillment();
  }, [fulfillmentId]);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <ContentLoadingScreen />;
  }

  if (!fulfillment) {
    return (
      <PageContainer>
        <Alert severity="error">Fulfillment not found</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      customSx={{
        maxWidth: "950px"
      }}
    >
      <DashboardHeader
        title={fulfillment.name || "Fulfillment"}
        icon={<TbTruckDelivery size={24} />}
        iconOnClick={() => {router.push('/dashboard/fulfillments')}}
        iconTooltipTitle="Back to fulfillments"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <NeviosPaginationButtons
              previousButtonOnClick={() => {}}
              nextButtonOnClick={() => {}}
            />  
          </Box>
        }
        subtitle={`Created at ${formatReadableDatetime(fulfillment.created_at)}`}
        badges={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FulfillmentStatusBadge value={fulfillment.status} />
            <DeliveryStatusBadge value={fulfillment.delivery_status} />
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
                        <Avatar src={item.order_item.image} alt={item.order_item.product_title} icon={<TbPackage />} sx={{ width: 45, height: 45, borderRadius: "12px", backgroundColor: "#fafbfc", border: "0.7px solid rgba(0, 0, 0, 0.12)" }} />
                      </Box>
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {item.order_item.product_title || 'Unknown Product'}
                        </Typography>
                        {item.order_item.variant_title && (
                          <Typography variant="body2" color="text.secondary">
                            {item.order_item.variant_title}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          SKU: {item.order_item.sku || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Shipped: <strong>{item.shipped_quantity}</strong> out of {item.order_item.quantity}
                        </Typography>

                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">No items found</Typography>
                )}
              </Box>
            </NeviosFormPaper>

            {fulfillment.shipping_address && (
              <NeviosFormPaper title="Shipping Address">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>
                      {fulfillment.shipping_address.first_name} {fulfillment.shipping_address.last_name}
                    </strong>
                  </Typography>
                  {fulfillment.shipping_address.company && (
                    <Typography variant="body2">{fulfillment.shipping_address.company}</Typography>
                  )}
                  <Typography variant="body2">{fulfillment.shipping_address.address}</Typography>
                  {fulfillment.shipping_address.additional_address && (
                    <Typography variant="body2">{fulfillment.shipping_address.additional_address}</Typography>
                  )}
                  <Typography variant="body2">
                    {fulfillment.shipping_address.city}, {fulfillment.shipping_address.province} {fulfillment.shipping_address.zip}
                  </Typography>
                  <Typography variant="body2">{getCountryName(fulfillment.shipping_address.country)}</Typography>
                  {fulfillment.shipping_address.phone && (
                    <Typography variant="body2">Phone: {fulfillment.shipping_address.phone}</Typography>
                  )}
                </Box>
              </NeviosFormPaper>
            )}
          </>
        }
        sideContent={
          <>
            <NeviosFormPaper title="Details" gap={3}>
              <NeviosFormPaperBlock title="Fulfillment Name:">
                <Typography variant="body2x">
                  {fulfillment.name || 'N/A'}
                </Typography>
              </NeviosFormPaperBlock>
              
              <NeviosFormPaperBlock title="Type:">
                <Typography variant="body2x">
                  {fulfillment.shipping_type}
                </Typography>
              </NeviosFormPaperBlock>

              <NeviosFormPaperBlock title="Carrier:">
                <Typography variant="body2x">
                  {fulfillment.carrier_name || 'Unknown'}
                </Typography>
                {fulfillment.external_name && fulfillment.external_name !== fulfillment.carrier_name && (
                  <Typography variant="caption" color="text.secondary">
                    External: {fulfillment.external_name}
                  </Typography>
                )}
              </NeviosFormPaperBlock>

              {fulfillment.tracking && fulfillment.tracking !== 'N/A' && (
                <NeviosFormPaperBlock title="Tracking:">
                  {fulfillment.tracking_link ? (
                    <Link
                      href={fulfillment.tracking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {fulfillment.tracking}
                      <TbExternalLink size={14} />
                    </Link>
                  ) : (
                    <NeviosCopyBlock copyValue={fulfillment.tracking} />
                  )}
                </NeviosFormPaperBlock>
              )}

              <NeviosFormPaperBlock title="Shipping Type:">
                <Typography variant="body2x">
                  {fulfillment.shipping_type || 'standard'}
                </Typography>
              </NeviosFormPaperBlock>
            </NeviosFormPaper>

            {fulfillment.customer && (
              <NeviosFormPaper title="Customer" gap={3}>
                <Tooltip title="View customer" placement="right">
                  <Typography 
                    variant="body2x" 
                    sx={{ 
                      width: 'fit-content', 
                      cursor: 'pointer', 
                      color: 'primary.main', 
                      '&:hover': { textDecoration: 'underline' } 
                    }}
                    onClick={() => router.push(`/dashboard/customers/${fulfillment.customer.id}`)}
                  >
                    {fulfillment.customer.first_name} {fulfillment.customer.last_name}
                  </Typography>
                </Tooltip>
                <NeviosCopyBlock copyValue={fulfillment.customer.email} />
              </NeviosFormPaper>
            )}

            {fulfillment.order && (
              <NeviosFormPaper title="Order" gap={3}>
                <Typography variant="body2x">
                  {fulfillment.order.name}
                </Typography>
                <Typography 
                  variant="body2x" 
                  sx={{ 
                    width: 'fit-content', 
                    cursor: 'pointer', 
                    color: 'primary.main', 
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                  onClick={() => router.push(`/dashboard/orders/${fulfillment.order.id}`)}
                >
                  View Order
                </Typography>
              </NeviosFormPaper>
            )}
          </>
        }
      />
    </PageContainer>
  );
} 