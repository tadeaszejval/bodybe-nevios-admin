// Customer creation action
import { postRequest } from '../../src/utils/nevios-express';

/**
 * Creates a new customer with optional billing and shipping addresses
 * 
 * @param {Object} customerData - Basic customer information
 * @param {Object} billingAddress - Optional billing address
 * @param {Object} shippingAddress - Optional shipping address
 * @returns {Promise<Object>} - API response with created customer data
 */
export async function createCustomer(customerData, billingAddress = null, shippingAddress = null) {
  try {
    // Prepare request payload
    const payload = {
      email: customerData.email,
      phone: customerData.phone,
      first_name: customerData.firstName,
      last_name: customerData.lastName,
      subscribed: Boolean(customerData.subscribed),
    };

    console.log("API Payload before sending:", payload);

    // Add billing address if provided
    if (billingAddress) {
      payload.billing_address = {
        first_name: billingAddress.firstName,
        last_name: billingAddress.lastName,
        company: billingAddress.company,
        company_id: billingAddress.companyId,
        company_vat: billingAddress.companyVat,
        address: billingAddress.address,
        city: billingAddress.city,
        country: billingAddress.country,
        zip: billingAddress.postalCode,
      };
    }

    // Add shipping address if provided
    if (shippingAddress) {
      payload.shipping_address = {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        company: shippingAddress.company,
        address: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country,
        zip: shippingAddress.postalCode
      };
    }

    // Call the API
    const response = await postRequest('/server/customers/create', payload);
    return response;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}