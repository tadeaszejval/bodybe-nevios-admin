'use server';

/**
 * Updates a fulfillment with tracking information and marks it as fulfilled
 * @param {string} id - The ID of the fulfillment to update
 * @param {Object} params - Tracking update parameters
 * @param {string} params.tracking - Tracking number
 * @param {string} [params.tracking_link] - Link to tracking page
 * @param {string} [params.carrier_name] - Name of the carrier
 * @param {string} [params.carrier_status] - Raw carrier status
 * @returns {Promise<Object>} - Response containing the updated fulfillment
 */
export async function updateFulfillmentTracking(id, params) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Fulfillment ID is required'
      };
    }

    if (!params.tracking) {
      return {
        success: false,
        error: 'Tracking number is required to fulfill an order'
      };
    }

    const response = await fetch(`/server/fulfilment/update/tracking/${id}`, {
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
      error: error.message || 'An error occurred while updating fulfillment tracking'
    };
  }
}

/**
 * Updates the delivery status of a fulfillment
 * @param {string} id - The ID of the fulfillment to update
 * @param {Object} params - Status update parameters
 * @param {string} params.delivery_status - New delivery status
 * @param {string} [params.carrier_status] - Raw carrier status
 * @param {string} [params.notes] - Additional notes about this status update
 * @returns {Promise<Object>} - Response containing the updated fulfillment
 */
export async function updateFulfillmentStatus(id, params) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Fulfillment ID is required'
      };
    }

    if (!params.delivery_status) {
      return {
        success: false,
        error: 'Delivery status is required'
      };
    }

    const response = await fetch(`/server/fulfilment/update/status/${id}`, {
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
      error: error.message || 'An error occurred while updating fulfillment status'
    };
  }
}

/**
 * Marks a fulfillment as delivered
 * @param {string} id - The ID of the fulfillment to mark as delivered
 * @param {Object} [params] - Optional parameters
 * @param {string} [params.notes] - Additional notes about this delivery
 * @returns {Promise<Object>} - Response containing the updated fulfillment
 */
export async function markFulfillmentDelivered(id, params = {}) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Fulfillment ID is required'
      };
    }

    const response = await fetch(`/server/fulfilment/update/deliver/${id}`, {
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
      error: error.message || 'An error occurred while marking fulfillment as delivered'
    };
  }
}

/**
 * Retrieves the tracking history for a fulfillment
 * @param {string} id - The ID of the fulfillment to retrieve history for
 * @param {Object} [params] - Optional parameters
 * @param {number} [params.limit=100] - Maximum number of records to return
 * @param {number} [params.offset=0] - Number of records to skip for pagination
 * @returns {Promise<Object>} - Response containing the tracking history
 */
export async function getFulfillmentTrackingHistory(id, params = { limit: 100, offset: 0 }) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Fulfillment ID is required'
      };
    }

    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);

    const response = await fetch(`/server/fulfilment/update/tracking-history/${id}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An error occurred while retrieving tracking history'
    };
  }
} 