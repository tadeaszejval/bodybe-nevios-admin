"use client";
import { Typography, Box } from "@mui/material";
import { TbTruck } from "react-icons/tb";
import { NeviosFormPaper } from "./nevios/NeviosFormPaper";
import { NeviosFormPaperBlock } from "./nevios/NeviosFormPaperBlock";
import { getCountryName } from "../core/countryName";
import { NeviosCopyBlock } from "./nevios/NeviosCopyBlock";
import { NeviosCustomBadge } from "./nevios/NeviosCustomBadge";
/**
 * Renders shipping address based on type (HOME, POINT, or STORE)
 * @param {Object} address - The shipping address object
 * @param {string} address.type - Address type: HOME, POINT, or STORE
 * @param {string} address.first_name - First name
 * @param {string} address.last_name - Last name
 * @param {string} address.company - Company name (optional)
 * @param {string} address.address - Street address (for HOME)
 * @param {string} address.city - City (for HOME)
 * @param {string} address.zip - ZIP code (for HOME)
 * @param {string} address.country - Country code (for HOME)
 * @param {string} address.point_id - Pickup point ID (for POINT)
 * @param {string} address.point_name - Pickup point name (for POINT)
 * @param {string} address.point_carrier - Pickup point carrier (for POINT)
 * @param {string} address.store - Store UUID (for STORE)
 * @param {string} address.phone - Phone number (optional)
 */
export function ShippingAddressDisplay({ address }) {
  if (!address) {
    return (
      <NeviosFormPaper title="Shipping Address" titleIcon={<TbTruck size={16} />}>
        <Typography color="text.secondary">No shipping address</Typography>
      </NeviosFormPaper>
    );
  }

  const addressType = address.type || 'HOME';

  // HOME type - Standard home delivery
  if (addressType === 'HOME') {
    return (
      <NeviosFormPaper title="Shipping Address" >
        <NeviosFormPaperBlock>
          <Typography variant="body2" fontWeight={600}>
            {address.first_name} {address.last_name}
          </Typography>
          {address.company && (
            <Typography variant="body2">{address.company}</Typography>
          )}
          {address.address && (
            <Typography variant="body2">{address.address}</Typography>
          )}
          {address.additional_address && (
            <Typography variant="body2">{address.additional_address}</Typography>
          )}
          {(address.city || address.zip) && (
            <Typography variant="body2">
              {address.city}{address.city && address.zip && ', '}{address.zip}
            </Typography>
          )}
          {address.province && (
            <Typography variant="body2">{address.province}</Typography>
          )}
          {address.country && (
            <Typography variant="body2">
              {getCountryName(address.country)}
            </Typography>
          )}
          {address.phone && (
            <Typography variant="body2">Phone: {address.phone}</Typography>
          )}
        </NeviosFormPaperBlock>
      </NeviosFormPaper>
    );
  }

  // POINT type - Pickup point delivery
  if (addressType === 'POINT') {
    return (
      <NeviosFormPaper title="Shipping Address" >
        <NeviosFormPaperBlock>
          <Typography variant="body2">
            {address.first_name} {address.last_name}
          </Typography>
          <Typography variant="body2">
            {address.point_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <NeviosCustomBadge 
              value={address.point_carrier} 
              color="blue"
              icon={<TbTruck size={12} />}
            />
            <NeviosCopyBlock copyValue={address.point_id} />
          </Box>
        </NeviosFormPaperBlock>
      </NeviosFormPaper>
    );
  }

  // STORE type - Store pickup
  if (addressType === 'STORE') {
    return (
      <NeviosFormPaper title="Shipping Address" >
        <NeviosFormPaperBlock>
          <Box sx={{ 
            mb: 1, 
            px: 1, 
            py: 0.5, 
            backgroundColor: 'green.50', 
            borderRadius: 1,
            width: 'fit-content'
          }}>
            <Typography variant="caption" color="green.700">
              Store Pickup
            </Typography>
          </Box>
          <Typography variant="body2">
            {address.first_name} {address.last_name}
          </Typography>
          {address.store && (
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mt: 1 }}>
              Store ID: {address.store}
            </Typography>
          )}
          {address.phone && (
            <Typography variant="body2">Phone: {address.phone}</Typography>
          )}
        </NeviosFormPaperBlock>
      </NeviosFormPaper>
    );
  }

  // Fallback for unknown type
  return (
    <NeviosFormPaper title="Shipping Address" >
      <NeviosFormPaperBlock>
        <Typography variant="body2" fontWeight={600}>
          {address.first_name} {address.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unknown address type: {addressType}
        </Typography>
      </NeviosFormPaperBlock>
    </NeviosFormPaper>
  );
}
