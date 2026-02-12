"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Typography, Tooltip, CircularProgress } from "@mui/material";
import { TbUser } from "react-icons/tb";
import { NeviosFormPaper } from "./NeviosFormPaper";
import { NeviosFormPaperBlock } from "./NeviosFormPaperBlock";
import { NeviosCopyBlock } from "./NeviosCopyBlock";
import { getCountryName } from "../../core/countryName";
import { useModuleRetrieve } from "../../hooks/useModuleRetrieve";

/**
 * NeviosCustomerCard - Reusable customer information card component
 * 
 * @param {Object} props - Component props
 * @param {Object|string} props.customer - Customer object with details OR customer ID string
 * @param {string} props.customer.id - Customer ID (if object)
 * @param {string} props.customer.first_name - Customer first name (if object)
 * @param {string} props.customer.last_name - Customer last name (if object)
 * @param {string} props.customer.email - Customer email (optional)
 * @param {string} props.customer.phone - Customer phone (optional)
 * @param {string} props.customer.country - Customer country code (optional)
 * @param {Object} props.billingAddress - Billing address object (optional)
 * @param {boolean} props.showBillingAddress - Whether to show billing address section (default: false)
 * 
 * @example
 * // With customer object (no API call)
 * <NeviosCustomerCard 
 *   customer={order.customer} 
 *   billingAddress={order.billing_address_log}
 *   showBillingAddress={true}
 * />
 * 
 * @example
 * // With customer ID (fetches data internally)
 * <NeviosCustomerCard 
 *   customer="customer-uuid-123"
 *   showBillingAddress={false}
 * />
 */
export function NeviosCustomerCard({ 
  customer, 
  billingAddress = null,
  showBillingAddress = false 
}) {
  const router = useRouter();

  // Determine if customer is an ID string or an object
  const customerId = typeof customer === 'string' ? customer : customer?.id;
  const isCustomerObject = typeof customer === 'object' && customer !== null;

  // Only fetch if customer is provided as ID string (not object)
  const { 
    data: fetchedCustomer, 
    loading, 
    error 
  } = useModuleRetrieve('customer', customerId, {
    expand: [],
    autoFetch: !isCustomerObject && !!customerId
  });

  // Use provided customer object or fetched customer
  const customerData = isCustomerObject ? customer : fetchedCustomer;

  // Show loading state
  if (loading) {
    return (
      <NeviosFormPaper title="Customer" titleIcon={<TbUser size={16} />}>
        <CircularProgress size={20} />
      </NeviosFormPaper>
    );
  }

  // Show error state
  if (error) {
    return (
      <NeviosFormPaper title="Customer" titleIcon={<TbUser size={16} />}>
        <Typography color="error">Error loading customer</Typography>
      </NeviosFormPaper>
    );
  }

  return (
    <NeviosFormPaper title="Customer" titleIcon={<TbUser size={16} />} gap={3}>
      {!customerData ? (
        <Typography color="text.secondary">No customer data</Typography>
      ) : (
        <>
          <NeviosFormPaperBlock>
            <Tooltip title="View customer profile">
              <Typography 
                onClick={() => router.push(`/dashboard/customers/${customerData.id}`)} 
                variant="body2x" 
                sx={{ 
                  width: 'fit-content', 
                  cursor: 'pointer', 
                  color: 'primary.main', 
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                {customerData.first_name} {customerData.last_name}
              </Typography>
            </Tooltip>
            {customerData.email && <NeviosCopyBlock copyValue={customerData.email} />}
            {customerData.phone && <NeviosCopyBlock copyValue={customerData.phone} />}
            {customerData.country && (
              <Typography variant="body2" color="text.secondary">
                {getCountryName(customerData.country)}
              </Typography>
            )}
          </NeviosFormPaperBlock>

          {showBillingAddress && (
            <NeviosFormPaperBlock title="Billing Address">
              {billingAddress ? (
                <>
                  <Typography variant="body2">
                    {billingAddress.first_name} {billingAddress.last_name}
                  </Typography>
                  {billingAddress.company && (
                    <Typography variant="body2">{billingAddress.company}</Typography>
                  )}
                  <Typography variant="body2">{billingAddress.address}</Typography>
                  <Typography variant="body2">
                    {billingAddress.city}, {billingAddress.zip}
                  </Typography>
                  <Typography variant="body2">
                    {getCountryName(billingAddress.country)}
                  </Typography>
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
          )}
        </>
      )}
    </NeviosFormPaper>
  );
}
