'use server';

/**
 * Modifies an existing fulfillment with new values
 * @param {string} id - The ID of the fulfillment to modify
 * @param {Object} params - Parameters to update (only included parameters will be updated)
 * @param {string} [params.shipping_type] - Type of shipping (HOME, POINT, STORE)
 * @param {string} [params.shipping_address] - Shipping address ID
 * @param {string} [params.order] - Order ID (UUID)
 * @param {string} [params.type] - Fulfillment type
 * @param {string} [params.name] - Fulfillment name
 * @param {string} [params.status] - Fulfillment status
 * @param {string} [params.tracking] - Tracking number
 * @param {string} [params.tracking_link] - Tracking link URL
 * @param {string} [params.carrier_name] - Name of the carrier
 * @param {string} [params.carrier_status] - Native status from carrier
 * @param {string} [params.delivery_status] - Delivery status of the fulfillment
 * @returns {Promise<Object>} - Response containing the updated fulfillment
 */
export async function modifyFulfillment(id, params) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Fulfillment ID is required'
      };
    }

    if (!params || Object.keys(params).length === 0) {
      return {
        success: false,
        error: 'At least one field must be provided to update'
      };
    }

    const response = await fetch(`/server/fulfilment/modify/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An error occurred while modifying fulfillment'
    };
  }
} 