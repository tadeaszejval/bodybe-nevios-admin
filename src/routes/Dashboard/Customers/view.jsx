"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Button,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { TbArrowLeft, TbUser, TbPencil, TbBuildingCommunity } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { useModuleRetrieve } from "../../../hooks/useModuleRetrieve";
import { SubscribedBadge } from "../../../components/dashboard/customers/SubscribedBadge";
import { getCountryName } from "../../../core/countryName";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
// import ActivityLogs from "../../../components/dashboard/customers/ActivityLogs";
import NeviosGroupButton from "../../../components/nevios/NeviosGroupButton";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import ContactPopup from "../../../components/dashboard/customers/ContactPopup";
import ShippingAddressPopup from "../../../components/dashboard/customers/ShippingAddressPopup";
import BillingAddressPopup from "../../../components/dashboard/customers/BillingAddressPopup";
import NeviosConfirmDialog from "../../../components/nevios/NeviosConfirmDialog";
import { modifyCustomer } from "../../../../actions/customers/modify";
import { modifyBillingAddress } from "../../../../actions/customers/billing-address/modify";
import { modifyShippingAddress } from "../../../../actions/customers/shipping-address/modify";
import { deleteCustomer } from "../../../../actions/customers/delete";
import { createBillingAddress } from "../../../../actions/customers/billing-address/create";
import { createShippingAddress } from "../../../../actions/customers/shipping-address/create";
import { NeviosBadge } from "../../../components/nevios/NeviosBadge";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";
import { ShippingAddressCard } from "../../../components/ShippingAddressCard";

export function CustomerView({ customerId }) {
  const router = useRouter();
  
  // ✅ NEW: Use useModuleRetrieve hook to fetch customer data via Express API
  const { 
    data: customer, 
    loading, 
    error: fetchError, 
    refreshData 
  } = useModuleRetrieve('customer', customerId, {
    expand: ['billing_addresses', 'shipping_addresses', 'orders']
  });

  // Extract addresses from the expanded data
  const billingAddress = useMemo(() => {
    // Get the first billing address or the default one
    if (customer?.billing_addresses && customer.billing_addresses.length > 0) {
      const defaultBilling = customer.billing_addresses.find(addr => addr.id === customer.default_billing);
      return defaultBilling || customer.billing_addresses[0];
    }
    return null;
  }, [customer]);

  const shippingAddress = useMemo(() => {
    // Get the first shipping address or the default one
    if (customer?.shipping_addresses && customer.shipping_addresses.length > 0) {
      const defaultShipping = customer.shipping_addresses.find(addr => addr.id === customer.default_shipping);
      return defaultShipping || customer.shipping_addresses[0];
    }
    return null;
  }, [customer]);

  // Get recent orders (limit to 5)
  const recentOrders = useMemo(() => {
    if (customer?.orders && Array.isArray(customer.orders)) {
      return customer.orders.slice(0, 5);
    }
    return [];
  }, [customer]);

  // UI State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [contactPopupOpen, setContactPopupOpen] = useState(false);
  const [billingPopupOpen, setBillingPopupOpen] = useState(false);
  const [shippingPopupOpen, setShippingPopupOpen] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingBilling, setSavingBilling] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(false);

  const handleEditCustomer = useCallback(async (formData) => {
    try {
      setSavingContact(true);
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };
      
      const response = await modifyCustomer(customerId, updateData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update customer');
      }
      
      // ✅ Refresh data from API instead of manual state update
      await refreshData();
      
      setSnackbar({
        open: true,
        message: 'Customer information updated successfully',
        severity: 'success'
      });
      
      // Close the popup on success
      setContactPopupOpen(false);
    } catch (err) {
      console.error('Error updating customer:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update customer',
        severity: 'error'
      });
    } finally {
      setSavingContact(false);
    }
  }, [customerId, refreshData]);

  const handleEditBillingAddress = useCallback(async (formData) => {
    try {
      setSavingBilling(true);
      
      // Map UI field names to API field names
      const addressData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        city: formData.city,
        zip: formData.postalCode,
        country: formData.country,
        company: formData.company,
        company_id: formData.companyId,
        company_vat: formData.companyVat
      };
      
      let response;
      
      // If the address exists, update it; otherwise create a new one
      if (billingAddress && billingAddress.id) {
        response = await modifyBillingAddress(customerId, billingAddress.id, addressData);
      } else {
        response = await createBillingAddress(customerId, addressData, true); // Set as default
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update billing address');
      }
      
      // ✅ Refresh data from API instead of manual state update
      await refreshData();
      
      setSnackbar({
        open: true,
        message: billingAddress && billingAddress.id ? 'Billing address updated successfully' : 'Billing address created successfully',
        severity: 'success'
      });
      
      // Close the popup on success
      setBillingPopupOpen(false);
    } catch (err) {
      console.error('Error updating billing address:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update billing address',
        severity: 'error'
      });
    } finally {
      setSavingBilling(false);
    }
  }, [customerId, billingAddress, refreshData]);

  const handleEditShippingAddress = useCallback(async (formData) => {
    try {
      setSavingShipping(true);
      
      // Map UI field names to API field names
      const addressData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        city: formData.city,
        zip: formData.postalCode,
        country: formData.country
      };
      
      let response;
      
      // If the address exists, update it; otherwise create a new one
      if (shippingAddress && shippingAddress.id) {
        response = await modifyShippingAddress(customerId, shippingAddress.id, addressData);
      } else {
        response = await createShippingAddress(customerId, addressData, true); // Set as default
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update shipping address');
      }
      
      // ✅ Refresh data from API instead of manual state update
      await refreshData();
      
      setSnackbar({
        open: true,
        message: shippingAddress && shippingAddress.id ? 'Shipping address updated successfully' : 'Shipping address created successfully',
        severity: 'success'
      });
      
      // Close the popup on success  
      setShippingPopupOpen(false);
    } catch (err) {
      console.error('Error updating shipping address:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update shipping address',
        severity: 'error'
      });
    } finally {
      setSavingShipping(false);
    }
  }, [customerId, shippingAddress, refreshData]);

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCustomer = async () => {
    try {
      setDeletingCustomer(true);
      
      const response = await deleteCustomer(customerId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete customer');
      }
      
      setSnackbar({
        open: true,
        message: 'Customer deleted successfully',
        severity: 'success'
      });
      
      // Redirect to customers list after a short delay
      setTimeout(() => {
        router.push('/dashboard/customers');
      }, 1000);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete customer',
        severity: 'error'
      });
      setDeleteDialogOpen(false);
    } finally {
      setDeletingCustomer(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Prepare initial data for popups
  const contactInitialData = customer ? {
    firstName: customer.first_name || '',
    lastName: customer.last_name || '',
    email: customer.email || '',
    phone: customer.phone || ''
  } : {};

  const billingInitialData = billingAddress ? {
    firstName: billingAddress.first_name || '',
    lastName: billingAddress.last_name || '',
    address: billingAddress.address || '',
    city: billingAddress.city || '',
    postalCode: billingAddress.zip || '',
    country: billingAddress.country || '',
    company: billingAddress.company || '',
    companyId: billingAddress.company_id || '',
    companyVat: billingAddress.company_vat || ''
  } : {};

  const shippingInitialData = shippingAddress ? {
    firstName: shippingAddress.first_name || '',
    lastName: shippingAddress.last_name || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.zip || '',
    country: shippingAddress.country || ''
  } : {};

  if (loading) {
    return <ContentLoadingScreen />;
  }

  if (fetchError || !customer) {
    return (
      <PageContainer>
        <Alert severity="error">
          {fetchError || 'Customer not found'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<TbArrowLeft />} 
            onClick={() => router.push('/dashboard/customers')}
          >
            Back to Customers
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
      {/* Popups */}
      <ContactPopup
        open={contactPopupOpen}
        onClose={() => setContactPopupOpen(false)}
        onSave={handleEditCustomer}
        initialData={contactInitialData}
        loading={savingContact}
      />
      
      <BillingAddressPopup
        open={billingPopupOpen}
        onClose={() => setBillingPopupOpen(false)}
        onSave={handleEditBillingAddress}
        initialData={billingInitialData}
        loading={savingBilling}
      />
      
      <ShippingAddressPopup
        open={shippingPopupOpen}
        onClose={() => setShippingPopupOpen(false)}
        onSave={handleEditShippingAddress}
        initialData={shippingInitialData}
        loading={savingShipping}
      />

      <NeviosConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customer?.first_name || ''} ${customer?.last_name || ''}? This action cannot be undone and will remove all customer data including orders, addresses, and preferences.`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        dangerous={true}
        loading={deletingCustomer}
      />

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
        title={`${customer.first_name || ''} ${customer.last_name || ''}`}
        icon={<TbUser size={24} />}
        iconOnClick={() => {router.push('/dashboard/customers')}}
        iconTooltipTitle="Back to list of customers"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <NeviosPaginationButtons
              previousButtonOnClick={() => {}}
              nextButtonOnClick={() => {}}
            />  
          </Box>
        }
        subtitle={`Customer since ${formatReadableDatetime(customer.created_at)}`}
        badges={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {billingAddress && billingAddress.company && (
              <NeviosBadge label={billingAddress.company} color="blue" icon={<TbBuildingCommunity size={14} />} />
            )}
            <NeviosBadge value={customer.subscribed} configKey="customerSubscribedStatus" />
            <NeviosBadge value={customer.account_enabled} configKey="customerAccountStatus" />
          </Box>
        }
      />
      <NeviosTwoColumnFormContainer
        mainContent={
          <>
            <NeviosFormPaper title="Recent Orders">
              {recentOrders.length === 0 ? (
                <Typography color="text.secondary">No orders found</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', border: '0.7px solid rgba(0, 0, 0, 0.12)', borderRadius: "12px" }}>
                  {recentOrders.map((order, idx) => (
                    <Box
                      key={order.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        py: 1.5,
                        px: 2,
                        borderBottom: idx !== recentOrders.length - 1 ? '0.7px solid rgba(0, 0, 0, 0.12)' : 'none'
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={600} 
                          sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }} 
                          onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                        >
                          {order.name || order.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatReadableDatetime(order.created_at)}
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 120, display: 'flex', gap: 1 }}>
                        {order.fulfillment_status && (
                          <NeviosBadge value={order.fulfillment_status} configKey="orderFulfillmentStatus" />
                        )}
                        {order.payment_status && (
                          <NeviosBadge value={order.payment_status} configKey="paymentStatus" showDot={true} />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </NeviosFormPaper>
            {/* ⚠️ Customer Activity - Commented out for now */}
            {/* <NeviosFormPaper title="Customer Activity" gap={2}>
              <ActivityLogs 
                activities={sampleCustomerActivities} 
              />
            </NeviosFormPaper> */}
          </>
        }
        sideContent={
          <>
            <NeviosFormPaper 
              title="Customer" 
              gap={4} 
              icon={<TbPencil />}
              onClick={() => setContactPopupOpen(true)}
            >
              <NeviosFormPaperBlock>
                {customer.first_name && (
                  <Typography variant="body2" fontWeight={600}>{customer.first_name} {customer.last_name}</Typography>
                )}
                {customer.email && (
                  <NeviosCopyBlock copyValue={customer.email} />
                )}
                {customer.phone && (
                  <NeviosCopyBlock copyValue={customer.phone} />
                )}
                </NeviosFormPaperBlock>
                <NeviosFormPaperBlock 
                  icon={<TbPencil />} 
                  onClick={() => setBillingPopupOpen(true)}
                  title="Billing Address" 
                  gap={"1px"}
                >
                  {billingAddress && (
                    <>
                      <Typography variant="body2" fontWeight={600}>{billingAddress.first_name} {billingAddress.last_name}</Typography>
                      <Typography variant="body2" fontWeight={500}>{billingAddress.address}</Typography>
                      <Typography variant="body2" fontWeight={500}>{billingAddress.city}, {billingAddress.zip}</Typography>
                      <Typography variant="body2" fontWeight={500}>{getCountryName(billingAddress.country)}</Typography>
                      {billingAddress.company && (
                        <Typography variant="body2" fontWeight={600}>{billingAddress.company}</Typography>
                      )}
                      {billingAddress.company_id && (
                        <Typography variant="body2" fontWeight={600}>ID: {billingAddress.company_id}</Typography>
                      )}
                      {billingAddress.company_vat && (
                        <Typography variant="body2" fontWeight={600}>VAT: {billingAddress.company_vat}</Typography>
                      )}
                    </>
                  )}
                </NeviosFormPaperBlock>
                <NeviosFormPaperBlock title="Email Notifications" icon={<TbPencil />}>
                    <SubscribedBadge status={customer.subscribed} />
                </NeviosFormPaperBlock>
            </NeviosFormPaper>
            <NeviosFormPaper title="Benefit Account" gap={4}>
                <NeviosBadge value={customer.account_enabled} configKey="customerAccountStatus" />
            </NeviosFormPaper>
            <ShippingAddressCard address={shippingAddress} />
          </>
        }
      />
    </PageContainer>
  );
}
