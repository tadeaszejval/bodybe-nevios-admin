// Billing address deletion action
import { deleteRequest } from '../../../src/utils/nevios-express';

/**
 * Deletes a billing address for a customer
 * 
 * @param {string} customerId - The ID of the customer
 * @param {string} addressId - The ID of the billing address to delete
 * @returns {Promise<Object>} - API response with deletion status
 */
export async function deleteBillingAddress(customerId, addressId) {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    if (!addressId) {
      throw new Error('Address ID is required');
    }
    
    // Call the API
    const response = await deleteRequest(`/server/customers/billing-address/${customerId}/${addressId}`);
    return response;
  } catch (error) {
    console.error('Error deleting billing address:', error);
    throw error;
  }
}
