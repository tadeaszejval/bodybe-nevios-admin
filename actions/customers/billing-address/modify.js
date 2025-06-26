// Billing address modification action
import { putRequest } from '../../../src/utils/neviosExpress';

/**
 * Updates a billing address for a customer
 * 
 * @param {string} customerId - The ID of the customer
 * @param {string} addressId - The ID of the billing address to update
 * @param {Object} updateData - Data to update (address, city, etc.)
 * @param {boolean} setAsDefault - Whether to set as default address
 * @returns {Promise<Object>} - API response with updated address data
 */
export async function modifyBillingAddress(customerId, addressId, updateData, setAsDefault = false) {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    if (!addressId) {
      throw new Error('Address ID is required');
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data is required');
    }
    
    // Prepare request payload
    const payload = {};
    
    // Add fields to update if provided
    if (updateData.first_name !== undefined) payload.first_name = updateData.first_name;
    if (updateData.last_name !== undefined) payload.last_name = updateData.last_name;
    if (updateData.company !== undefined) payload.company = updateData.company;
    if (updateData.company_id !== undefined) payload.company_id = updateData.company_id;
    if (updateData.company_vat !== undefined) payload.company_vat = updateData.company_vat;
    if (updateData.address !== undefined) payload.address = updateData.address;
    if (updateData.additional_address !== undefined) payload.additional_address = updateData.additional_address;
    if (updateData.zip !== undefined) payload.zip = updateData.zip;
    if (updateData.province !== undefined) payload.province = updateData.province;
    if (updateData.city !== undefined) payload.city = updateData.city;
    if (updateData.country !== undefined) payload.country = updateData.country;
    
    // Build URL with query parameter if setAsDefault is true
    let endpoint = `/server/customers/billing-address/${customerId}/${addressId}`;
    if (setAsDefault) {
      endpoint += '?setAsDefault=true';
    }
    
    // Call the API
    const response = await putRequest(endpoint, payload);
    return response;
  } catch (error) {
    console.error('Error updating billing address:', error);
    throw error;
  }
}
