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
  Tooltip
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { TbMail, TbRefreshDot, TbSettings } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { supabase } from "../../../utils/supabase";
import { formatReadableDatetime } from "../../../core/formatters";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { EmailStatusBadge } from "../../../components/dashboard/emails/EmailStatusBadge";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import NeviosConfirmDialog from "../../../components/nevios/NeviosConfirmDialog";
import { EmailActivityBar } from "../../../components/dashboard/emails/EmailActivityBar";

export function EmailView({ emailId }) {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);

  // Fetch email and its logs
  useEffect(() => {
    if (!emailId) return;

    const fetchEmail = async () => {
      try {
        setLoading(true);
        
        // Fetch the email data with optional customer and order information
        const { data, error } = await supabase
          .from('email')
          .select(`
            *,
            customer:customers(id, first_name, last_name, email),
            order:orders(id, name)
          `)
          .eq('id', emailId)
          .single();
          
        if (error) throw error;
        
        setEmail(data);
      } catch (err) {
        console.error("Error fetching email:", err);
        setSnackbar({
          open: true,
          message: "Failed to load email: " + (err.message || "Unknown error"),
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchLogs = async () => {
      try {
        setLogsLoading(true);
        
        // Fetch the email logs
        const { data, error } = await supabase
          .from('email_logs')
          .select('*')
          .eq('email', emailId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setLogs(data || []);
      } catch (err) {
        console.error("Error fetching email logs:", err);
      } finally {
        setLogsLoading(false);
      }
    };

    fetchEmail();
    fetchLogs();
  }, [emailId]);

  // Handle delete confirmation
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteEmail = async () => {
    try {
      const { error } = await supabase
        .from('email')
        .delete()
        .eq('id', emailId);
        
      if (error) throw error;
      
      setSnackbar({
        open: true,
        message: "Email deleted successfully",
        severity: "success"
      });
      
      // Navigate back to emails list
      router.push('/dashboard/emails');
    } catch (err) {
      console.error("Error deleting email:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete email: " + (err.message || "Unknown error"),
        severity: "error"
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Handle resend confirmation
  const handleOpenResendDialog = () => {
    setResendDialogOpen(true);
  };

  const handleCloseResendDialog = () => {
    setResendDialogOpen(false);
  };

  const handleResendEmail = async () => {
    try {
      // In a real app, you would call an API endpoint to resend the email
      // For now, let's just show a success message
      setSnackbar({
        open: true,
        message: "Email resent successfully",
        severity: "success"
      });
    } catch (err) {
      console.error("Error resending email:", err);
      setSnackbar({
        open: true,
        message: "Failed to resend email: " + (err.message || "Unknown error"),
        severity: "error"
      });
    } finally {
      setResendDialogOpen(false);
    }
  };

  // Format logs for email activity bar
  const formatLogsForActivityBar = () => {
    // Define base events
    const baseEvents = [];
    
    // Add sent event if email exists and there's no SENT event in logs
    if (email) {
      // Check if we have a SENT log already
      const hasSentLog = logs.some(log => log.status_type === 'SENT');
      
      // Only add a SENT event if we don't have one already
      if (!hasSentLog) {
        baseEvents.push({
          status: "SENT",
          timestamp: email.created_at
        });
      }
    }
    
    // Add scheduled event if email is scheduled
    if (email && email.scheduled_at && email.status === 'SCHEDULED') {
      baseEvents.push({
        status: "SCHEDULED",
        timestamp: email.scheduled_at
      });
    }
    
    // Map logs to events
    if (logs && logs.length > 0) {
      // Filter logs with status_type
      const statusLogs = logs
        .filter(log => log.status_type)
        .map(log => ({
          status: log.status_type,
          timestamp: log.created_at
        }));
      
      // Add status events to our array
      baseEvents.push(...statusLogs);
    }
    
    // Sort events by timestamp
    return baseEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!email) {
    return (
      <PageContainer>
        <Alert severity="error">Email not found</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      customSx={{
        maxWidth: "950px"
      }}
    >
      <DashboardHeader
        title={email.subject || "Email"}
        icon={<TbMail size={24} />}
        iconOnClick={() => {router.push('/dashboard/emails')}}
        iconTooltipTitle="Back to emails"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              startIcon={<TbRefreshDot />}
              onClick={handleOpenResendDialog}
            >
              Resend
            </Button>
            <NeviosPaginationButtons
              previousButtonOnClick={() => {}}
              nextButtonOnClick={() => {}}
            />  
          </Box>
        }
        subtitle={`Send at ${formatReadableDatetime(email.created_at)}`}
        badges={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <EmailStatusBadge status={email.status} />
          </Box>
        }
      />
      
      <EmailActivityBar events={formatLogsForActivityBar()} />
      
      <NeviosTwoColumnFormContainer
        mainContent={
          <>
            <NeviosFormPaper title="Preview">
              <Box 
                sx={{ 
                  maxHeight: '400px', 
                  overflow: 'auto', 
                  border: '1px solid', 
                  borderColor: 'grey.300', 
                  borderRadius: 1,
                  p: 2 
                }}
              >
                {email.html ? (
                  <iframe
                    srcDoc={email.html}
                    title="Email HTML Content"
                    width="100%"
                    height="400px"
                    style={{ border: 'none' }}
                  />
                ) : (
                  <Typography color="text.secondary">No HTML content</Typography>
                )}
              </Box>
            </NeviosFormPaper>
          </>
        }
        sideContent={
          <>
            <NeviosFormPaper title="Configuration" gap={3}>
                <NeviosFormPaperBlock title="Subject:">
                    <Typography variant="body2x">
                    {email.subject}
                    </Typography>
                </NeviosFormPaperBlock>
                <NeviosFormPaperBlock title="Recipient:">
                {email.customer &&(
                    <Tooltip title="View customer" placement="right">
                        <Typography 
                        variant="body2x" 
                        sx={{ width: 'fit-content', cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => router.push(`/dashboard/customers/${email.customer.id}`)}
                        >
                        {email.customer.first_name} {email.customer.last_name}
                        </Typography>
                    </Tooltip>
                )}
                <NeviosCopyBlock copyValue={email.to} />
              </NeviosFormPaperBlock>
              <NeviosFormPaperBlock title="Sender:">
                <NeviosCopyBlock copyValue={email.from} />
              </NeviosFormPaperBlock>
            </NeviosFormPaper>
            {email.order &&(
                <NeviosFormPaper title="Order" gap={3}>
                    <Typography variant="body2x">
                        {email.order.name}
                    </Typography>
                    <Typography 
                    variant="body2x" 
                    sx={{ width: 'fit-content', cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => router.push(`/dashboard/orders/${email.order.id}`)}
                    >
                    View Order
                    </Typography>
                </NeviosFormPaper>
            )}
          </>
        }
      />
      
      {/* Delete Confirmation Dialog */}
      <NeviosConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteEmail}
        title="Delete Email"
        content="Are you sure you want to delete this email? This action cannot be undone."
        confirmButtonText="Delete"
        confirmButtonColor="error"
      />
      
      {/* Resend Confirmation Dialog */}
      <NeviosConfirmDialog
        open={resendDialogOpen}
        onClose={handleCloseResendDialog}
        onConfirm={handleResendEmail}
        title="Resend Email"
        content="Are you sure you want to resend this email to the recipient?"
        confirmButtonText="Resend"
        confirmButtonColor="primary"
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
