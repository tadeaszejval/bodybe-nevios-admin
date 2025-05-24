'use server';

/**
 * Creates a new fulfillment for an order
 * @param {Object} params - Fulfillment creation parameters
 * @param {string} params.order - The order ID to create the fulfillment for
 * @param {string} [params.shipping_type] - Override shipping type (HOME, POINT, STORE)
 * @param {string|Object} [params.shipping_address] - Override shipping address ID or new shipping address data
 * @param {string} [params.customer] - Customer ID (retrieved from order if not provided)
 * @param {string} [params.type] - Fulfillment type
 * @param {string} [params.name] - Fulfillment name
 * @param {string} [params.tracking] - Tracking number (if already available)
 * @param {string} [params.tracking_link] - Tracking link (if already available)
 * @param {string} [params.carrier_name] - Carrier name (if already available)
 * @param {string} [params.carrier_status] - Native status from carrier (if already available)
 * @param {boolean} [params.fulfill_all] - If true, fulfill all remaining unfulfilled quantities for all items in the order
 * @param {Array} [params.items] - Order items to fulfill (required if fulfill_all is false)
 * @returns {Promise<Object>} - Response containing the created fulfillment
 */
export async function createFulfillment(params) {
  try {
    // Validate required fields
    if (!params.order) {
      return {
        success: false,
        error: 'Missing required field: order is required'
      };
    }

    // Validate items or fulfill_all
    if (!params.fulfill_all && (!params.items || !params.items.length)) {
      return {
        success: false,
        error: 'Either fulfill_all must be true or items must be provided'
      };
    }

    const response = await fetch('/server/fulfilment/create', {
      method: 'POST',
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
      error: error.message || 'An error occurred while creating fulfillment'
    };
  }
} 