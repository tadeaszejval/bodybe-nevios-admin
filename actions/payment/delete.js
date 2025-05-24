'use server';

/**
 * Deletes a payment by ID
 * @param {string} id - The ID of the payment to delete
 * @returns {Promise<Object>} - Response containing the deleted payment data
 */
export async function deletePayment(id) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Payment ID is required'
      };
    }

    const response = await fetch(`/server/payment/delete/${id}`, {
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
      error: error.message || 'An error occurred while deleting payment'
    };
  }
} 