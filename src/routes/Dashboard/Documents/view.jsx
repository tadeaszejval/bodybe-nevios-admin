"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Button,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { TbArrowLeft, TbFileText, TbUser, TbBuilding, TbTruck, TbFileInvoice } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { supabase } from "../../../utils/supabase";
import { NeviosBadge } from "../../../components/nevios/NeviosBadge";
import { getCountryName } from "../../../core/countryName";
import { formatReadableDatetime, formatCurrencyNumber, formatReadableDate } from "../../../core/formatters";
import NeviosGroupButton from "../../../components/nevios/NeviosGroupButton";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";
import { NeviosDangerButton } from "../../../components/nevios/NeviosButtons";

export function DocumentView({ documentId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [documentItems, setDocumentItems] = useState([]);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    if (documentId) {
      fetchDocumentData(documentId);
    }
  }, [documentId]);

  const fetchDocumentData = async (id) => {
    try {
      setLoading(true);
      
      // Fetch document details with related data
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('id', id)
        .single();

      if (documentError) throw documentError;
      if (!documentData) throw new Error('Document not found');
      
      setDocument(documentData);
      setCustomer(documentData.customer);

      // Fetch document items
      const { data: itemsData, error: itemsError } = await supabase
        .from('document_items')
        .select(`
          *,
          product:products(title),
          variant:product_variants(title)
        `)
        .eq('document', id)
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;
      setDocumentItems(itemsData || []);

    } catch (err) {
      console.error('Error fetching document data:', err);
      setError(err.message || 'Failed to fetch document data');
      setSnackbar({
        open: true,
        message: err.message || 'Failed to fetch document data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  if (loading) {
    return <ContentLoadingScreen />;
  }

  if (error || !document) {
    return (
      <PageContainer>
        <Alert severity="error">
          {error || 'Document not found'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<TbArrowLeft />} 
            onClick={() => router.push('/dashboard/documents')}
          >
            Back to Documents
          </Button>
        </Box>
      </PageContainer>
    );
  }

  // Calculate totals and remaining amount
  const totalGross = document.total_price_gross || 0;
  const totalNet = document.total_price_net || 0;
  const totalVat = document.total_price_vat || 0;
  const totalPaid = document.total_paid_price_gross || 0;
  const remainingAmount = totalGross - totalPaid;

  return (
    <PageContainer
      customSx={{
        maxWidth: "1000px"
      }}
    >
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <DashboardHeader
        title={document.name || document.external_name || 'Untitled Document'}
        icon={<TbFileText size={24} />}
        iconOnClick={() => router.push('/dashboard/documents')}
        iconTooltipTitle="Back to list of documents"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <NeviosGroupButton
              buttonText="Actions"
              menuItems={[
                { label: 'Download PDF', onClick: () => {} },
                { label: 'Send by email', onClick: () => {} },
                { label: 'Mark as paid', onClick: () => {} },
                { label: 'Duplicate document', onClick: () => {} }
              ]}
            /> 
            <NeviosDangerButton
              onClick={() => {}}
            >
              Delete
            </NeviosDangerButton>
            <NeviosPaginationButtons
              previousButtonOnClick={() => {}}
              nextButtonOnClick={() => {}}
            />  
          </Box>
        }
        subtitle={`Created ${formatReadableDatetime(document.created_at)}`}
        badges={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <NeviosBadge value={document.doc_type} configKey="documentType" />
            <NeviosBadge value={document.status} configKey="documentStatus" showDot={true} />
          </Box>
        }
      />
      
      <NeviosTwoColumnFormContainer
        mainContent={
          <>
            <NeviosFormPaper title="Document Items">
              {documentItems.length === 0 ? (
                <Typography color="text.secondary">No items found</Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <TableContainer sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "12px",
                  }}>
                    <Table size="small" sx={{ minWidth: 650 }}>
                      <TableHead sx={{
                        backgroundColor: "gray.50"
                      }}>
                        <TableRow>
                          <TableCell sx={{ minWidth: 200 }}>Item</TableCell>
                          <TableCell align="right" sx={{ minWidth: 70 }}>Quantity</TableCell>
                          <TableCell align="right" sx={{ minWidth: 120 }}>Unit Price</TableCell>
                          <TableCell align="right" sx={{ minWidth: 120 }}>VAT Rate</TableCell>
                          <TableCell align="right" sx={{ minWidth: 120 }}>Total Price</TableCell>
                          <TableCell align="right" sx={{ minWidth: 120 }}>VAT Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documentItems.map((item) => (
                          <TableRow key={item.id} sx={{
                            "&:last-child td, &:last-child th": {
                              borderBottom: "none",
                            }
                          }}>
                            <TableCell sx={{ minWidth: 200, padding: "10px 15px" }}>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {item.item_name || item.product?.title || item.variant?.title || 'Unnamed Item'}
                                </Typography>
                                {item.product?.name && item.variant?.name && (
                                  <Typography variant="caption" color="text.secondary">
                                    {item.product.title} - {item.variant.title}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell align="right" variant="body2" sx={{ minWidth: 70 }}>{item.quantity || 1} x</TableCell>
                            <TableCell align="right" variant="body2" sx={{ minWidth: 120 }}>
                              {document.currency} {formatCurrencyNumber(item.unit_price_gross || 0)}
                            </TableCell>
                            <TableCell align="right" variant="body2" sx={{ minWidth: 120 }}>{item.vat_rate || 0}%</TableCell>
                            <TableCell align="right" variant="body2" sx={{ minWidth: 120 }}>
                              <Typography variant="body2x">
                                {document.currency} {formatCurrencyNumber(item.line_price_gross || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" variant="body2" sx={{ minWidth: 120 }}>
                              {document.currency} {formatCurrencyNumber(item.line_price_vat || 0)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </NeviosFormPaper>

            <NeviosFormPaper title="Financial Summary">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Net Amount:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {document.currency} {formatCurrencyNumber(totalNet)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">VAT ({document.vat_rate}%):</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {document.currency} {formatCurrencyNumber(totalVat)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', pt: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>Total Gross:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {document.currency} {formatCurrencyNumber(totalGross)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Paid:</Typography>
                  <Typography variant="body2" fontWeight={600} color="green.600">
                    {document.currency} {formatCurrencyNumber(totalPaid)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Remaining:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight={600} 
                    color={remainingAmount <= 0 ? "green.600" : "red.600"}
                  >
                    {document.currency} {formatCurrencyNumber(remainingAmount)}
                  </Typography>
                </Box>
              </Box>
            </NeviosFormPaper>

            {(document.note || document.internal_note) && (
              <NeviosFormPaper title="Notes">
                {document.note && (
                  <NeviosFormPaperBlock title="Customer Note">
                    <Typography variant="body2">{document.note}</Typography>
                  </NeviosFormPaperBlock>
                )}
                {document.internal_note && (
                  <NeviosFormPaperBlock title="Internal Note">
                    <Typography variant="body2">{document.internal_note}</Typography>
                  </NeviosFormPaperBlock>
                )}
              </NeviosFormPaper>
            )}
          </>
        }
        sideContent={
          <>
            <NeviosFormPaper title="Details" titleIcon={<TbFileInvoice size={16} />} >
              <NeviosFormPaperBlock>
                <Typography variant="body2" fontWeight={600}>Document Number</Typography>
                <Typography variant="body2">{document.name}</Typography>
                {document.external_name && (
                  <>
                    <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>External Name</Typography>
                    <Typography variant="body2">{document.external_name}</Typography>
                  </>
                )}
              </NeviosFormPaperBlock>

              <NeviosFormPaperBlock>
                <Typography variant="body2" fontWeight={600}>Issued</Typography>
                <Typography variant="body2">{formatReadableDate(document.issued_at)}</Typography>
                
                {document.vat_date && (
                  <>
                    <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>VAT Date</Typography>
                    <Typography variant="body2">{formatReadableDate(document.vat_date)}</Typography>
                  </>
                )}
                
                {document.due_at && (
                  <>
                    <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>Due Date</Typography>
                    <Typography variant="body2">{formatReadableDate(document.due_at)}</Typography>
                  </>
                )}
              </NeviosFormPaperBlock>
            </NeviosFormPaper>

            {customer && (
              <NeviosFormPaper title="Customer" titleIcon={<TbUser size={16} />}>
                <NeviosFormPaperBlock>
                  <Typography variant="body2" fontWeight={600}>
                    {customer.first_name} {customer.last_name}
                  </Typography>
                  {customer.email && (
                    <NeviosCopyBlock copyValue={customer.email} />
                  )}
                  {customer.phone && (
                    <NeviosCopyBlock copyValue={customer.phone} />
                  )}
                </NeviosFormPaperBlock>
              </NeviosFormPaper>
            )}

            {document.billing_address_log && (
              <NeviosFormPaper title="Billing Address" titleIcon={<TbBuilding size={16} />}>
                <NeviosFormPaperBlock>
                <Typography variant="body2" fontWeight={600}>
                  {document.billing_address_log.first_name} {document.billing_address_log.last_name}
                </Typography>
                {document.billing_address_log.company && (
                  <Typography variant="body2" fontWeight={600}>
                    {document.billing_address_log.company}
                  </Typography>
                )}
                <Typography variant="body2">{document.billing_address_log.address}</Typography>
                <Typography variant="body2">
                  {document.billing_address_log.city}, {document.billing_address_log.zip}
                </Typography>
                <Typography variant="body2">
                  {getCountryName(document.billing_address_log.country)}
                </Typography>
                {document.billing_address_log.company_id && (
                  <Typography variant="body2" fontWeight={600}>
                    ID: {document.billing_address_log.company_id}
                  </Typography>
                )}
                {document.billing_address_log.company_vat && (
                  <Typography variant="body2" fontWeight={600}>
                    VAT: {document.billing_address_log.company_vat}
                  </Typography>
                )}
                </NeviosFormPaperBlock>
              </NeviosFormPaper>
            )}

            {document.shipping_address_log && (
              <NeviosFormPaper title="Shipping Address" titleIcon={<TbTruck size={16} />}>
                <NeviosFormPaperBlock>
                <Typography variant="body2" fontWeight={600}>
                  {document.shipping_address_log.first_name} {document.shipping_address_log.last_name}
                </Typography>
                <Typography variant="body2">{document.shipping_address_log.address}</Typography>
                <Typography variant="body2">
                  {document.shipping_address_log.city}, {document.shipping_address_log.zip}
                </Typography>
                <Typography variant="body2">
                  {getCountryName(document.shipping_address_log.country)}
                </Typography>
                </NeviosFormPaperBlock>
              </NeviosFormPaper>
            )}
          </>
        }
      />
    </PageContainer>
  );
} 