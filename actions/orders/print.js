/**
 * Generate and view/download a PDF for a single order confirmation
 * @param {string} orderId - The order UUID to generate PDF for
 * @param {Object} options - PDF generation options (format, margin, etc.)
 * @returns {Promise<Blob>} - The PDF as a blob for viewing/downloading
 */
export const printOrderView = async (orderId, options = {}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEVIOS_EXPRESS_URL}/server/order/print/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        options: {
          format: 'A4',
          margin: {
            top: '20px',
            bottom: '20px',
            left: '20px',
            right: '20px'
          },
          printBackground: true,
          ...options
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`PDF generation failed: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Print order view failed:', error);
    throw error;
  }
};

/**
 * Generate and view/download a bulk PDF for multiple order confirmations
 * @param {string[]} orderIds - Array of order UUIDs to include in batch PDF (max 50)
 * @param {Object} options - PDF generation options (format, margin, etc.)
 * @returns {Promise<Blob>} - The PDF as a blob for viewing/downloading
 */
export const printOrdersBulkView = async (orderIds, options = {}) => {
  try {
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      throw new Error('Order IDs array is required and cannot be empty');
    }

    if (orderIds.length > 50) {
      throw new Error('Maximum 50 orders allowed per bulk generation');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_NEVIOS_EXPRESS_URL}/server/order/print/bulk-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderIds,
        options: {
          format: 'A4',
          margin: {
            top: '20px',
            bottom: '20px',
            left: '20px',
            right: '20px'
          },
          ...options
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Bulk PDF generation failed: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Print orders bulk view failed:', error);
    throw error;
  }
};

/**
 * Helper function to download a PDF blob as a file
 * @param {Blob} pdfBlob - The PDF blob to download
 * @param {string} filename - The filename for the download
 */
export const downloadPDF = (pdfBlob, filename = 'order-confirmation.pdf') => {
  try {
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download PDF failed:', error);
    throw error;
  }
};

/**
 * Helper function to open a PDF blob in a new browser tab
 * @param {Blob} pdfBlob - The PDF blob to view
 */
export const viewPDFInBrowser = (pdfBlob) => {
  try {
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
    // Note: URL will be cleaned up when the tab is closed
  } catch (error) {
    console.error('View PDF in browser failed:', error);
    throw error;
  }
};

/**
 * Complete workflow: Generate PDF and download it
 * @param {string} orderId - The order UUID
 * @param {string} filename - Optional filename for download
 * @param {Object} options - PDF generation options
 */
export const generateAndDownloadOrderPDF = async (orderId, filename, options = {}) => {
  try {
    const pdfBlob = await printOrderView(orderId, options);
    const downloadFilename = filename || `order-confirmation-${orderId}.pdf`;
    downloadPDF(pdfBlob, downloadFilename);
  } catch (error) {
    console.error('Generate and download order PDF failed:', error);
    throw error;
  }
};

/**
 * Complete workflow: Generate PDF and view it in browser
 * @param {string} orderId - The order UUID
 * @param {Object} options - PDF generation options
 */
export const generateAndViewOrderPDF = async (orderId, options = {}) => {
  try {
    const pdfBlob = await printOrderView(orderId, options);
    viewPDFInBrowser(pdfBlob);
  } catch (error) {
    console.error('Generate and view order PDF failed:', error);
    throw error;
  }
};

/**
 * Complete workflow: Generate bulk PDF and download it
 * @param {string[]} orderIds - Array of order UUIDs
 * @param {string} filename - Optional filename for download
 * @param {Object} options - PDF generation options
 */
export const generateAndDownloadBulkOrderPDF = async (orderIds, filename, options = {}) => {
  try {
    const pdfBlob = await printOrdersBulkView(orderIds, options);
    const downloadFilename = filename || `bulk-order-confirmations-${Date.now()}.pdf`;
    downloadPDF(pdfBlob, downloadFilename);
  } catch (error) {
    console.error('Generate and download bulk order PDF failed:', error);
    throw error;
  }
};

/**
 * Complete workflow: Generate bulk PDF and view it in browser
 * @param {string[]} orderIds - Array of order UUIDs
 * @param {Object} options - PDF generation options
 */
export const generateAndViewBulkOrderPDF = async (orderIds, options = {}) => {
  try {
    const pdfBlob = await printOrdersBulkView(orderIds, options);
    viewPDFInBrowser(pdfBlob);
  } catch (error) {
    console.error('Generate and view bulk order PDF failed:', error);
    throw error;
  }
};
