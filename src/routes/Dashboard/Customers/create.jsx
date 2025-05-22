"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { NeviosInput } from "../../../components/nevios/NeviosInput";
import { TbArrowLeft, TbUserPlus, TbPencil } from "react-icons/tb";
import {  NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { NeviosSettingsItem } from "../../../components/nevios/NeviosSettingsItem";
import BillingAddressPopup from "../../../components/dashboard/customers/BillingAddressPopup";
import ShippingAddressPopup from "../../../components/dashboard/customers/ShippingAddressPopup";
import NeviosCheckbox from "../../../components/nevios/NeviosCheckbox";
import { createCustomer } from "../../../../actions/customers/create";
import { getCountryName } from "../../../core/countryName";
import { supabase } from "../../../utils/supabase";

export function CreateCustomer() {
  const router = useRouter();
  const [billingAddressPopupOpen, setBillingAddressPopupOpen] = useState(false);
  const [billingAddress, setBillingAddress] = useState(null);
  const [shippingAddressPopupOpen, setShippingAddressPopupOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [savingBillingAddress, setSavingBillingAddress] = useState(false);
  const [savingShippingAddress, setSavingShippingAddress] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subscribed: false
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleOpenBillingAddressPopup = () => {
    setBillingAddressPopupOpen(true);
  };
  
  const handleCloseBillingAddressPopup = () => {
    setBillingAddressPopupOpen(false);
  };
  
  const handleSaveBillingAddress = async (formData) => {
    setSavingBillingAddress(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Billing address saved:", formData);
      setBillingAddress(formData);
      
      // Close the popup
      setBillingAddressPopupOpen(false);
    } catch (error) {
      console.error("Error saving billing address:", error);
    } finally {
      setSavingBillingAddress(false);
    }
  };

  const handleOpenShippingAddressPopup = () => {
    setShippingAddressPopupOpen(true);
  };
  
  const handleCloseShippingAddressPopup = () => {
    setShippingAddressPopupOpen(false);
  };
  
  const handleSaveShippingAddress = async (formData) => {
    setSavingShippingAddress(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Shipping address saved:", formData);
      setShippingAddress(formData);
      
      // Close the popup
      setShippingAddressPopupOpen(false);
    } catch (error) {
      console.error("Error saving shipping address:", error);
    } finally {
      setSavingShippingAddress(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear validation errors when user types
    if (name === 'email' && validationErrors.email) {
      setValidationErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
    
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check email existence after user stops typing
    if (name === 'email' && value.trim()) {
      // Debounce email validation to avoid too many requests
      if (window.emailValidationTimeout) {
        clearTimeout(window.emailValidationTimeout);
      }
      
      window.emailValidationTimeout = setTimeout(() => {
        checkEmailExists(value);
      }, 500);
    }
  };
  
  const checkEmailExists = async (email) => {
    if (!email || !email.includes('@')) return;
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, email')
        .ilike('email', email.trim())
        .limit(1);
      
      if (error) {
        console.error('Error checking email:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setValidationErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log("Checkbox changed:", name, checked);
    setCustomerData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleCreateCustomer = async () => {
    try {
      // Log customer data to verify subscribed value
      console.log("Submitting customer data:", customerData);
      
      // Validate required fields
      const newValidationErrors = {};
      
      if (!customerData.email) {
        newValidationErrors.email = 'Email is required';
      } else if (validationErrors.email) {
        // Keep existing email validation error if present
        newValidationErrors.email = validationErrors.email;
      } else if (!isValidEmail(customerData.email)) {
        newValidationErrors.email = 'Please enter a valid email address';
      }
      
      if (Object.keys(newValidationErrors).length > 0) {
        setValidationErrors(newValidationErrors);
        setSnackbar({
          open: true,
          message: 'Please correct the errors before submitting',
          severity: 'error'
        });
        return;
      }
      
      setLoading(true);
      
      const response = await createCustomer(
        customerData,
        billingAddress,
        shippingAddress
      );
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Customer created successfully',
          severity: 'success'
        });
        
        // Redirect to customer list after a short delay
        setTimeout(() => {
          router.push('/dashboard/customers');
        }, 500);
      } else {
        setSnackbar({
          open: true,
          message: response.error || 'Failed to create customer',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      setSnackbar({
        open: true,
        message: error.message || 'An unexpected error occurred',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

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
        title="New Customer"
        icon={<TbUserPlus size={24} />}
        actions={
          <Button 
            size="small" 
            variant="outlined" 
            color="secondary" 
            startIcon={<TbArrowLeft />}
            onClick={() => router.push("/dashboard/customers")}
          >
            Back to Customers
          </Button>
        }
      />
      <NeviosTwoColumnFormContainer
        mainContent={
            <>
                <NeviosFormPaper title="Overview" footerDescription="You should ask your customers for permission before you subscribe them to your marketing emails or SMS.">
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
                        <NeviosInput 
                          label="First Name" 
                          name="firstName"
                          value={customerData.firstName}
                          onChange={handleInputChange}
                        />
                        <NeviosInput 
                          label="Last Name" 
                          name="lastName"
                          value={customerData.lastName}
                          onChange={handleInputChange}
                        />
                    </Box>
                    <NeviosInput 
                      label="Email" 
                      name="email"
                      value={customerData.email}
                      onChange={handleInputChange}
                      required
                      error={!!validationErrors.email}
                      helperText={validationErrors.email}
                    />
                    <NeviosInput 
                      label="Phone" 
                      name="phone"
                      value={customerData.phone}
                      onChange={handleInputChange}
                    />
                    <NeviosCheckbox 
                      label="Customer agreed to receive marketing emails." 
                      name="subscribed"
                      checked={customerData.subscribed}
                      onChange={handleCheckboxChange}
                    />
                </NeviosFormPaper>
                <NeviosFormPaper title="Billing address" description="The primary billing address of this customer">
                    {billingAddress ? (
                        <Box sx={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '8px', 
                            p: 2, 
                            position: 'relative' 
                        }}>
                            <Typography variant="body2">
                                {billingAddress.firstName} {billingAddress.lastName}
                            </Typography>
                            {billingAddress.company && (
                                <Typography variant="body2">
                                    {billingAddress.company}
                                </Typography>
                            )}
                            <Typography variant="body2">
                                {billingAddress.address}
                            </Typography>
                            <Typography variant="body2">
                                {billingAddress.city}, {billingAddress.postalCode}
                            </Typography>
                            <Typography variant="body2">
                                {getCountryName(billingAddress.country)}
                            </Typography>
                            {billingAddress.phone && (
                                <Typography variant="body2">
                                    {billingAddress.phone}
                                </Typography>
                            )}
                            {billingAddress.companyId && billingAddress.companyVat && (
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    ID: {billingAddress.companyId} VAT: {billingAddress.companyVat}
                                </Typography>
                            )}
                            <IconButton
                                color="secondary"
                                onClick={handleOpenBillingAddressPopup}
                                sx={{ 
                                    position: 'absolute', 
                                    top: '8px', 
                                    right: '8px'
                                }}
                            >
                                <TbPencil />
                            </IconButton>
                        </Box>
                    ) : (
                        <NeviosSettingsItem 
                            label="Add default billing address" 
                            onClick={handleOpenBillingAddressPopup}
                        />
                    )}
                    <BillingAddressPopup
                        open={billingAddressPopupOpen}
                        onClose={handleCloseBillingAddressPopup}
                        onSave={handleSaveBillingAddress}
                        initialData={billingAddress || {}}
                        loading={savingBillingAddress}
                    />
                </NeviosFormPaper>

                <NeviosFormPaper title="Shipping address" description="The primary shipping address of this customer">
                    {shippingAddress ? (
                        <Box sx={{ 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '8px', 
                            p: 2, 
                            position: 'relative' 
                        }}>
                            <Typography variant="body2">
                                {shippingAddress.firstName} {shippingAddress.lastName}
                            </Typography>
                            {shippingAddress.company && (
                                <Typography variant="body2">
                                    {shippingAddress.company}
                                </Typography>
                            )}
                            <Typography variant="body2">
                                {shippingAddress.address}
                            </Typography>
                            <Typography variant="body2">
                                {shippingAddress.city}, {shippingAddress.postalCode}
                            </Typography>
                            <Typography variant="body2">
                                {getCountryName(shippingAddress.country)}
                            </Typography>
                            {shippingAddress.phone && (
                                <Typography variant="body2">
                                    {shippingAddress.phone}
                                </Typography>
                            )}
                            {shippingAddress.companyId && shippingAddress.companyVat && (
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    ID: {shippingAddress.companyId} VAT: {shippingAddress.companyVat}
                                </Typography>
                            )}
                            <IconButton
                                color="secondary"
                                onClick={handleOpenShippingAddressPopup}
                                sx={{ 
                                    position: 'absolute', 
                                    top: '8px', 
                                    right: '8px'
                                }}
                            >
                                <TbPencil />
                            </IconButton>
                        </Box>
                    ) : (
                        <NeviosSettingsItem 
                            label="Add default shipping address" 
                            onClick={handleOpenShippingAddressPopup}
                        />
                    )}
                    <ShippingAddressPopup
                        open={shippingAddressPopupOpen}
                        onClose={handleCloseShippingAddressPopup}
                        onSave={handleSaveShippingAddress}
                        initialData={shippingAddress || {}}
                        loading={savingShippingAddress}
                    />
                </NeviosFormPaper>
            </>
        }
        sideContent={
          <NeviosFormPaper title="Notes" icon={<TbPencil />} description="Notes are private and won't be shared with the customer.">
          </NeviosFormPaper>
        }
        footerContent={
          <Button 
            size="medium" 
            variant="contained" 
            color="primary"
            onClick={handleCreateCustomer}
            disabled={loading || !!validationErrors.email}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Creating...' : 'Create Customer'}
          </Button>
        }
      />
    </PageContainer>
  );
}
