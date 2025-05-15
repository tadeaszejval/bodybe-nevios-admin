// Billing address creation action
import { postRequest } from '../../../src/utils/nevios-express';

/**
 * Creates a billing address for a customer
 * 
 * @param {string} customerId - The ID of the customer
 * @param {Object} addressData - Billing address information
 * @param {boolean} setAsDefault - Whether to set as default address
 * @returns {Promise<Object>} - API response with created address data
 */
export async function createBillingAddress(customerId, addressData, setAsDefault = false) {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    if (!addressData) {
      throw new Error('Address data is required');
    }

    // Validate required fields
    const requiredFields = ['address', 'city', 'zip', 'country'];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    
    // Prepare request payload
    const payload = {
      address: addressData.address,
      city: addressData.city,
      zip: addressData.zip,
      country: addressData.country
    };
    
    // Add optional fields if provided
    if (addressData.first_name) payload.first_name = addressData.first_name;
    if (addressData.last_name) payload.last_name = addressData.last_name;
    if (addressData.company) payload.company = addressData.company;
    if (addressData.company_id) payload.company_id = addressData.company_id;
    if (addressData.company_vat) payload.company_vat = addressData.company_vat;
    if (addressData.additional_address) payload.additional_address = addressData.additional_address;
    if (addressData.province) payload.province = addressData.province;
    
    // Build URL with query parameter if setAsDefault is true
    let endpoint = `/server/customers/billing-address/${customerId}`;
    if (setAsDefault) {
      endpoint += '?setAsDefault=true';
    }
    
    // Call the API
    const response = await postRequest(endpoint, payload);
    return response;
  } catch (error) {
    console.error('Error creating billing address:', error);
    throw error;
  }
}
