// Shipping address deletion action
import { deleteRequest } from '../../../src/utils/nevios-express';

/**
 * Deletes a shipping address for a customer
 * 
 * @param {string} customerId - The ID of the customer
 * @param {string} addressId - The ID of the shipping address to delete
 * @returns {Promise<Object>} - API response with deletion status
 */
export async function deleteShippingAddress(customerId, addressId) {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    if (!addressId) {
      throw new Error('Address ID is required');
    }
    
    // Call the API
    const response = await deleteRequest(`/server/customers/shipping-address/${customerId}/${addressId}`);
    return response;
  } catch (error) {
    console.error('Error deleting shipping address:', error);
    throw error;
  }
}
