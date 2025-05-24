'use server';

/**
 * Modifies an existing payment with new values
 * @param {string} id - The ID of the payment to modify
 * @param {Object} params - Parameters to update (only included parameters will be updated)
 * @param {string} [params.name] - Payment name
 * @param {string} [params.type] - Payment type (GATEWAY, COD, BANK_TRANSFER, OTHER)
 * @param {string} [params.amount] - Payment amount
 * @param {string} [params.currency] - Currency ID
 * @param {string} [params.status] - Payment status (PAID, UNPAID, REFUNDED)
 * @param {string} [params.paid_at] - Timestamp when payment was paid
 * @param {string} [params.refunded_at] - Timestamp when payment was refunded
 * @param {string} [params.customer] - Customer ID
 * @param {string} [params.order] - Order ID
 * @param {string} [params.external_name] - External reference name/ID
 * @returns {Promise<Object>} - Response containing the updated payment
 */
export async function modifyPayment(id, params) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Payment ID is required'
      };
    }

    if (!params || Object.keys(params).length === 0) {
      return {
        success: false,
        error: 'At least one field must be provided to update'
      };
    }

    const response = await fetch(`/server/payment/modify/${id}`, {
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
      error: error.message || 'An error occurred while modifying payment'
    };
  }
} 