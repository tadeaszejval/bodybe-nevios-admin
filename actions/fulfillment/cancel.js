'use server';

/**
 * Cancels an existing fulfillment
 * @param {string} id - The ID of the fulfillment to cancel
 * @param {Object} [params] - Optional parameters
 * @param {string} [params.reason] - Reason for cancellation
 * @returns {Promise<Object>} - Response containing the cancelled fulfillment
 */
export async function cancelFulfillment(id, params = {}) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Fulfillment ID is required'
      };
    }

    const response = await fetch(`/server/fulfilment/cancel/${id}`, {
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
      error: error.message || 'An error occurred while cancelling fulfillment'
    };
  }
} 