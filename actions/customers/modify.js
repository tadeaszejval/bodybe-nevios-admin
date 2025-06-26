// Customer modification action
import { putRequest } from '../../src/utils/neviosExpress';

/**
 * Modifies an existing customer's information
 * 
 * @param {string} customerId - The ID of the customer to modify
 * @param {Object} updateData - Data to update (email, phone, firstName, lastName, etc.)
 * @returns {Promise<Object>} - API response with updated customer data
 */
export async function modifyCustomer(customerId, updateData) {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Update data is required');
    }
    
    // Prepare request payload
    const payload = {};
    
    // Map frontend field names to API field names
    if (updateData.email !== undefined) payload.email = updateData.email;
    if (updateData.phone !== undefined) payload.phone = updateData.phone;
    if (updateData.firstName !== undefined) payload.first_name = updateData.firstName;
    if (updateData.lastName !== undefined) payload.last_name = updateData.lastName;
    if (updateData.company !== undefined) payload.company = updateData.company;
    if (updateData.subscribed !== undefined) payload.subscribed = Boolean(updateData.subscribed);
    if (updateData.accountEnabled !== undefined) payload.account_enabled = Boolean(updateData.accountEnabled);
    if (updateData.metadata !== undefined) payload.metadata = updateData.metadata;
    
    // Call the API
    const response = await putRequest(`/server/customers/modify/${customerId}`, payload);
    return response;
  } catch (error) {
    console.error('Error modifying customer:', error);
    throw error;
  }
}
