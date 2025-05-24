'use server';

/**
 * Marks a payment as paid
 * @param {string} id - The ID of the payment to mark as paid
 * @param {Object} [params] - Optional parameters
 * @param {string} [params.paid_at] - Custom timestamp for when payment was paid (defaults to current time)
 * @param {string} [params.provider_name] - Payment provider name
 * @param {string} [params.provider_status_title] - Payment provider status title
 * @param {number} [params.provider_status_code] - Payment provider status code
 * @returns {Promise<Object>} - Response containing the updated payment
 */
export async function markPaymentAsPaid(id, params = {}) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Payment ID is required'
      };
    }

    const response = await fetch(`/server/payment/update/mark-paid/${id}`, {
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
      error: error.message || 'An error occurred while marking payment as paid'
    };
  }
}

/**
 * Refunds a paid payment
 * @param {string} id - The ID of the payment to refund
 * @param {Object} [params] - Optional parameters
 * @param {string} [params.refunded_at] - Custom timestamp for when payment was refunded (defaults to current time)
 * @param {string} [params.provider_name] - Payment provider name
 * @param {string} [params.provider_status_title] - Payment provider status title
 * @param {number} [params.provider_status_code] - Payment provider status code
 * @returns {Promise<Object>} - Response containing the updated payment
 */
export async function refundPayment(id, params = {}) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Payment ID is required'
      };
    }

    const response = await fetch(`/server/payment/update/refund/${id}`, {
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
      error: error.message || 'An error occurred while refunding payment'
    };
  }
}

/**
 * Updates the provider status information for a payment
 * @param {string} id - The ID of the payment to update provider status for
 * @param {Object} params - Provider status parameters
 * @param {string} [params.provider_name] - Payment provider name
 * @param {string} [params.provider_status_title] - Payment provider status title
 * @param {number} [params.provider_status_code] - Payment provider status code
 * @returns {Promise<Object>} - Response containing the updated payment
 */
export async function updatePaymentProviderStatus(id, params) {
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
        error: 'At least one provider status field must be provided'
      };
    }

    const response = await fetch(`/server/payment/update/provider-status/${id}`, {
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
      error: error.message || 'An error occurred while updating payment provider status'
    };
  }
} 