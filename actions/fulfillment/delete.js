'use server';

/**
 * Deletes a fulfillment by ID
 * @param {string} id - The ID of the fulfillment to delete
 * @returns {Promise<Object>} - Response containing the deleted fulfillment data
 */
export async function deleteFulfillment(id) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Fulfillment ID is required'
      };
    }

    const response = await fetch(`/server/fulfilment/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An error occurred while deleting fulfillment'
    };
  }
} 