"use client";
import React, { useState, useEffect } from "react";
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
import { TbArrowLeft, TbUser, TbPencil } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { supabase } from "../../../utils/supabase";
import { SubscribedBadge } from "../../../components/dashboard/customers/SubscribedBadge";
import { AccountStatusBadge } from "../../../components/dashboard/customers/AccountStatusBadge";
import { getCountryName } from "../../../core/countryName";
import { formatReadableDatetime } from "../../../core/formatters";
import NeviosAnalyticsStripe from "../../../components/nevios/NeviosAnalyticsStripe";
import ActivityLogs from "../../../components/dashboard/customers/ActivityLogs";
import { CompanyBadge } from "../../../components/dashboard/customers/CompanyBadge";  
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
import { FulfillmentStatusBadge } from "../../../components/dashboard/orders/FulfillmentStatusBadge";
import { PaymentStatusBadge } from "../../../components/dashboard/orders/PaymentStatusBadge";
// Sample customer activity data for testing
const sampleCustomerActivities = [
  {
    type: 'order',
    description: 'Placed an order',
    timestamp: '2023-06-15T14:30:00Z',
    details: 'Order #12345 - 3 items - $150.00'
  },
  {
    type: 'viewed',
    description: 'Viewed product page',
    timestamp: '2023-06-15T13:45:00Z',
    details: 'Product: Wireless Headphones'
  },
  {
    type: 'cart',
    description: 'Added item to cart',
    timestamp: '2023-06-15T13:40:00Z',
    details: 'Wireless Headphones - $89.99'
  }
];

export function CustomerView({ customerId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [error, setError] = useState(null);
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
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  useEffect(() => {
    if (customerId) {
      fetchCustomerData(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    async function fetchCustomerOrders() {
      if (!customer) return;
      try {
        setOrdersLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('id, name, created_at, fulfillment_status, payment_status, local_currency')
          .eq('customer', customer.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchCustomerOrders();
  }, [customer]);

  const fetchCustomerData = async (id) => {
    try {
      setLoading(true);
      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (customerError) throw customerError;
      if (!customerData) throw new Error('Customer not found');
      
      setCustomer(customerData);

      // Fetch billing address if available
      if (customerData.default_billing) {
        const { data: billingData, error: billingError } = await supabase
          .from('billing_address')
          .select('*')
          .eq('id', customerData.default_billing)
          .single();

        if (!billingError) {
          setBillingAddress(billingData);
        }
      }

      // Fetch shipping address if available
      if (customerData.default_shipping) {
        const { data: shippingData, error: shippingError } = await supabase
          .from('shipping_address')
          .select('*')
          .eq('id', customerData.default_shipping)
          .single();

        if (!shippingError) {
          setShippingAddress(shippingData);
        }
      } else {
        // If no default shipping address, try to fetch any shipping address for this customer
        const { data: shippingData, error: shippingError } = await supabase
          .from('shipping_address')
          .select('*')
          .eq('customer', id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!shippingError && shippingData && shippingData.length > 0) {
          setShippingAddress(shippingData[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err.message || 'Failed to fetch customer data');
      setSnackbar({
        open: true,
        message: err.message || 'Failed to fetch customer data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = async (formData) => {
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
      
      // Update local state with new data
      setCustomer(prev => ({
        ...prev,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone
      }));
      
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
  };

  const handleEditBillingAddress = async (formData) => {
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
      
      // Update local state with new data
      setBillingAddress(prev => {
        const updatedAddress = response.data || {
          ...prev,
          ...addressData
        };
        return updatedAddress;
      });
      
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
  };

  const handleEditShippingAddress = async (formData) => {
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
      
      // Update local state with new data
      setShippingAddress(prev => {
        const updatedAddress = response.data || {
          ...prev,
          ...addressData
        };
        return updatedAddress;
      });
      
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
  };

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
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error || !customer) {
    return (
      <PageContainer>
        <Alert severity="error">
          {error || 'Customer not found'}
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
            <NeviosGroupButton
              buttonText="Actions"
              menuItems={[
                { label: 'Email customer', onClick: () => {} },
                { label: 'Send account invite', onClick: () => {} },
                { label: 'Delete customer', color: '#b50000', onClick: handleOpenDeleteDialog }
              ]}
            /> 
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
              <CompanyBadge company={billingAddress.company} />
            )}
            <SubscribedBadge status={customer.subscribed} />
            <AccountStatusBadge status={customer.account_enabled} />
          </Box>
        }
      />
      <NeviosAnalyticsStripe sections={[
        { title: "Revenue", value: "$1,234" },
        { title: "Orders", value: "56" },
        { title: "Customer since", value: "About 2 hours" },
        { title: "RFM group", value: "—" },
        { title: "Predicted spend time", value: "—" }
      ]} />
      <NeviosTwoColumnFormContainer
        mainContent={
          <>
            <NeviosFormPaper title="Last order placed">
              {ordersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : orders.length === 0 ? (
                <Typography color="text.secondary">No orders found</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', border: '0.7px solid rgba(0, 0, 0, 0.12)', borderRadius: "12px" }}>
                  {orders.map((order, idx) => {
                    let total = '';
                    if (order.orders_pricing && Array.isArray(order.orders_pricing)) {
                      const totalObj = order.orders_pricing.find(p => p.component === 'total');
                      if (totalObj) total = `${order.local_currency} ${formatCurrencyNumber(totalObj.gross_local)}`;
                    }
                    return (
                      <Box
                        key={order.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          py: 1.5,
                          px: 2,
                          borderBottom: idx !== orders.length - 1 ? '0.7px solid rgba(0, 0, 0, 0.12)' : 'none'
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }} onClick={() => router.push(`/dashboard/orders/${order.id}`)}>{order.name || order.id}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatReadableDatetime(order.created_at)}</Typography>
                        </Box>
                        <Box sx={{ minWidth: 90 }}>
                          <Typography variant="body2" fontWeight={600}>{total}</Typography>
                        </Box>
                        <Box sx={{ minWidth: 120, display: 'flex', gap: 1 }}>
                          <FulfillmentStatusBadge status={order.fulfillment_status} />
                          <PaymentStatusBadge status={order.payment_status} />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </NeviosFormPaper>
            <NeviosFormPaper title="Customer Activity" gap={2}>
              <ActivityLogs 
                activities={sampleCustomerActivities} 
              />
            </NeviosFormPaper>
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
                <AccountStatusBadge status={customer.account_enabled} />
            </NeviosFormPaper>
            <NeviosFormPaper 
              title="Shipping Address" 
              icon={<TbPencil />} 
              onClick={() => setShippingPopupOpen(true)}
              gap={0.5} 
              footerDescription="Default or last used address by the customer."
            >
              {shippingAddress && (
                <>
                  <Typography variant="body2" fontWeight={500}>{shippingAddress.first_name} {shippingAddress.last_name}</Typography>
                  <Typography variant="body2">{shippingAddress.address}</Typography>
                  <Typography variant="body2">{shippingAddress.city}, {shippingAddress.zip}</Typography>
                  <Typography variant="body2">{getCountryName(shippingAddress.country)}</Typography>
                </>
              )}
            </NeviosFormPaper>
          </>
        }
      />
    </PageContainer>
  );
}
