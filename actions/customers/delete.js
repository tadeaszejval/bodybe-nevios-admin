// Customer deletion action
import { deleteRequest } from '../../src/utils/neviosExpress';

/**
 * Deletes a customer by ID
 * 
 * @param {string} customerId - The ID of the customer to delete
 * @returns {Promise<Object>} - API response with deletion status
 */
export async function deleteCustomer(customerId) {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    // Call the API
    const response = await deleteRequest(`/server/customers/delete/${customerId}`);
    return response;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}
