// Shipping address creation action
import { postRequest } from '../../../src/utils/nevios-express';

/**
 * Creates a shipping address for a customer
 * 
 * @param {string} customerId - The ID of the customer
 * @param {Object} addressData - Shipping address information
 * @param {boolean} setAsDefault - Whether to set as default address
 * @returns {Promise<Object>} - API response with created address data
 */
export async function createShippingAddress(customerId, addressData, setAsDefault = false) {
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
    if (addressData.additional_address) payload.additional_address = addressData.additional_address;
    if (addressData.province) payload.province = addressData.province;
    if (addressData.type) payload.type = addressData.type;
    if (addressData.point_id) payload.point_id = addressData.point_id;
    if (addressData.point_name) payload.point_name = addressData.point_name;
    if (addressData.point_carrier) payload.point_carrier = addressData.point_carrier;
    if (addressData.store) payload.store = addressData.store;
    
    // Build URL with query parameter if setAsDefault is true
    let endpoint = `/server/customers/shipping-address/${customerId}`;
    if (setAsDefault) {
      endpoint += '?setAsDefault=true';
    }
    
    // Call the API
    const response = await postRequest(endpoint, payload);
    return response;
  } catch (error) {
    console.error('Error creating shipping address:', error);
    throw error;
  }
}
