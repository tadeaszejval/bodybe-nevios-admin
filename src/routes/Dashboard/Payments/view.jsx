"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Button
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { TbCreditCard, TbUser, TbShoppingCart, TbReceipt, TbArrowLeft } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { supabase } from "../../../utils/supabase";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import NeviosGroupButton from "../../../components/nevios/NeviosGroupButton";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import { getCountryName } from "../../../core/countryName";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";

// Import the badge components from PaymentsTable
const PAYMENT_STATUSES = {
	PAID: {
		value: "PAID",
		label: "Paid",
		color: "green",
	},
	UNPAID: {
		value: "UNPAID",
		label: "Unpaid",
		color: "red",
	},
	REFUNDED: {
		value: "REFUNDED",
		label: "Refunded",
		color: "orange",
	},
};

const PAYMENT_TYPES = {
	GATEWAY: {
		value: "GATEWAY",
		label: "Gateway",
		color: "gray",
		icon: <TbCreditCard size={14} />
	},
	COD: {
		value: "COD",
		label: "Cash on Delivery",
		color: "gray",
		icon: <TbCreditCard size={14} />
	},
	BANK_TRANSFER: {
		value: "BANK_TRANSFER",
		label: "Bank Transfer",
		color: "gray",
		icon: <TbCreditCard size={14} />
	},
	MANUAL: {
		value: "MANUAL",
		label: "Manual",
		color: "gray",
		icon: <TbCreditCard size={14} />
	},
};

import { match } from "ts-pattern";
import { ColorDot } from "../../../components/ColorDot";

const paymentStatusMatcher = (value) =>
	match(value)
		.with("PAID", () => PAYMENT_STATUSES.PAID)
		.with("UNPAID", () => PAYMENT_STATUSES.UNPAID)
		.with("REFUNDED", () => PAYMENT_STATUSES.REFUNDED)
		.otherwise(() => PAYMENT_STATUSES.UNPAID);

const paymentTypeMatcher = (value) =>
	match(value)
		.with("GATEWAY", () => PAYMENT_TYPES.GATEWAY)
		.with("COD", () => PAYMENT_TYPES.COD)
		.with("BANK_TRANSFER", () => PAYMENT_TYPES.BANK_TRANSFER)
		.with("MANUAL", () => PAYMENT_TYPES.MANUAL)
		.otherwise(() => PAYMENT_TYPES.MANUAL);

const PaymentStatusBadge = ({ status, customSx = {} }) => {
	const normalizedStatus = status?.toUpperCase() || "UNPAID";
	const statusMeta = paymentStatusMatcher(normalizedStatus);
	
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				padding: 0,
				backgroundColor: `${statusMeta.color}.50`,
				color: `${statusMeta.color}.800`,
				fontWeight: 500,
				borderRadius: 1,
				borderColor: `${statusMeta.color}.200`,
				borderWidth: 1,
				borderStyle: "solid",
				px: 0.75,
				py: 0.25,
				fontSize: "xs",
				...customSx,
			}}
		>
			<ColorDot color={statusMeta.color} />
			{statusMeta.label}
		</Box>
	);
};

const PaymentTypeBadge = ({ type, customSx = {} }) => {
	const normalizedType = type?.toUpperCase() || "MANUAL";
	const typeMeta = paymentTypeMatcher(normalizedType);
	
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 0.5,
				padding: 0,
				backgroundColor: `${typeMeta.color}.50`,
				color: `${typeMeta.color}.800`,
				fontWeight: 500,
				borderRadius: 1,
				borderColor: `${typeMeta.color}.200`,
				borderWidth: 1,
				borderStyle: "solid",
				px: 0.75,
				py: 0.25,
				fontSize: "xs",
				...customSx,
			}}
		>
			{typeMeta.icon}
			{typeMeta.label}
		</Box>
	);
};

export function PaymentView({ paymentId }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [payment, setPayment] = useState(null);
	const [customer, setCustomer] = useState(null);
	const [order, setOrder] = useState(null);
	const [error, setError] = useState(null);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'info'
	});

	useEffect(() => {
		if (paymentId) {
			fetchPaymentData(paymentId);
		}
	}, [paymentId]);

	const fetchPaymentData = async (id) => {
		try {
			setLoading(true);
			
			// Fetch payment details with related data
			const { data: paymentData, error: paymentError } = await supabase
				.from('payments')
				.select(`
					*,
					customer:customers(*),
					order:orders(*)
				`)
				.eq('id', id)
				.single();

			if (paymentError) throw paymentError;
			if (!paymentData) throw new Error('Payment not found');
			
			setPayment(paymentData);
			setCustomer(paymentData.customer);
			setOrder(paymentData.order);

		} catch (err) {
			console.error('Error fetching payment data:', err);
			setError(err.message || 'Failed to fetch payment data');
			setSnackbar({
				open: true,
				message: err.message || 'Failed to fetch payment data',
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

	const handleMarkAsPaid = async () => {
		// TODO: Implement with separate endpoint
		console.log('Mark as paid clicked for payment:', paymentId);
	};

	const handleRefund = async () => {
		// TODO: Implement with separate endpoint
		console.log('Refund clicked for payment:', paymentId);
	};

	const handleSendReceipt = async () => {
		// TODO: Implement with separate endpoint
		console.log('Send receipt clicked for payment:', paymentId);
	};

	const handleDownloadReceipt = async () => {
		// TODO: Implement with separate endpoint
		console.log('Download receipt clicked for payment:', paymentId);
	};

	if (loading) {
		return <ContentLoadingScreen />;
	}

	if (error || !payment) {
		return (
			<PageContainer>
				<Alert severity="error">
					{error || 'Payment not found'}
				</Alert>
				<Box sx={{ mt: 2 }}>
					<Button 
						variant="outlined" 
						color="primary" 
						startIcon={<TbArrowLeft />} 
						onClick={() => router.push('/dashboard/payments')}
					>
						Back to Payments
					</Button>
				</Box>
			</PageContainer>
		);
	}

	return (
		<PageContainer
			customSx={{
				maxWidth: "950px"
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
				title={payment.name || 'Payment Details'}
				icon={<TbCreditCard size={24} />}
				iconOnClick={() => router.push('/dashboard/payments')}
				iconTooltipTitle="Back to payments"
				actions={
					<Box sx={{ display: 'flex', gap: 1 }}>
						<NeviosGroupButton
							buttonText="Actions"
							menuItems={[
								{ 
									label: 'Mark as Paid', 
									onClick: handleMarkAsPaid,
									disabled: payment.status === 'PAID' || payment.status === 'REFUNDED'
								},
								{ 
									label: 'Refund Payment', 
									onClick: handleRefund,
									disabled: payment.status !== 'PAID'
								},
								{ label: 'Send Receipt', onClick: handleSendReceipt },
								{ label: 'Download Receipt', onClick: handleDownloadReceipt }
							]}
						/>
						<NeviosPaginationButtons
							previousButtonOnClick={() => {}}
							nextButtonOnClick={() => {}}
						/>
					</Box>
				}
				subtitle={`Created ${formatReadableDatetime(payment.created_at)}`}
				badges={
					<Box sx={{ display: 'flex', gap: 1 }}>
						<PaymentStatusBadge status={payment.status} />
						<PaymentTypeBadge type={payment.type} />
					</Box>
				}
			/>
			
			<NeviosTwoColumnFormContainer
				mainContent={
					<>
						<NeviosFormPaper title="Payment Information" titleIcon={<TbReceipt size={16} />}>
							<NeviosFormPaperBlock>
								<Typography variant="body2" fontWeight={600}>Amount</Typography>
								<Typography variant="h6" color="primary.main">
									{payment.currency} {formatCurrencyNumber(payment.amount || 0)}
								</Typography>
							</NeviosFormPaperBlock>
						</NeviosFormPaper>

						{(payment.external_name || payment.provider_name || payment.provider_status_title) && (
							<NeviosFormPaper title="Provider Information">
								{payment.external_name && (
									<NeviosFormPaperBlock>
										<Typography variant="body2" fontWeight={600}>External Reference</Typography>
										<NeviosCopyBlock copyValue={payment.external_name} />
									</NeviosFormPaperBlock>
								)}

								{payment.provider_name && (
									<NeviosFormPaperBlock>
										<Typography variant="body2" fontWeight={600}>Provider</Typography>
										<Typography variant="body2">{payment.provider_name}</Typography>
									</NeviosFormPaperBlock>
								)}

								{payment.provider_status_title && (
									<NeviosFormPaperBlock>
										<Typography variant="body2" fontWeight={600}>Provider Status</Typography>
										<Typography variant="body2">{payment.provider_status_title}</Typography>
									</NeviosFormPaperBlock>
								)}

								{payment.provider_id && (
									<NeviosFormPaperBlock>
										<Typography variant="body2" fontWeight={600}>Provider ID</Typography>
										<NeviosCopyBlock copyValue={payment.provider_id} />
									</NeviosFormPaperBlock>
								)}
							</NeviosFormPaper>
						)}

						{(payment.retry_count > 0 || payment.last_retry_at) && (
							<NeviosFormPaper title="Retry Information">
								{payment.retry_count > 0 && (
									<NeviosFormPaperBlock>
										<Typography variant="body2" fontWeight={600}>Retry Count</Typography>
										<Typography variant="body2">{payment.retry_count}</Typography>
									</NeviosFormPaperBlock>
								)}

								{payment.last_retry_at && (
									<NeviosFormPaperBlock>
										<Typography variant="body2" fontWeight={600}>Last Retry</Typography>
										<Typography variant="body2">
											{formatReadableDatetime(payment.last_retry_at)}
										</Typography>
									</NeviosFormPaperBlock>
								)}
							</NeviosFormPaper>
						)}
					</>
				}
				sideContent={
					<>
						{customer && (
							<NeviosFormPaper title="Customer" titleIcon={<TbUser size={16} />}>
								<NeviosFormPaperBlock>
									<Tooltip title="View customer profile">
										<Typography 
											onClick={() => router.push(`/dashboard/customers/${customer.id}`)} 
											variant="body2x" 
											sx={{ 
												width: 'fit-content', 
												cursor: 'pointer', 
												color: 'primary.main', 
												'&:hover': { textDecoration: 'underline' } 
											}}
										>
											{customer.first_name} {customer.last_name}
										</Typography>
									</Tooltip>
									{customer.email && <NeviosCopyBlock copyValue={customer.email} />}
									{customer.phone && <NeviosCopyBlock copyValue={customer.phone} />}
									{customer.country && (
										<Typography variant="body2" color="text.secondary">
											{getCountryName(customer.country)}
										</Typography>
									)}
								</NeviosFormPaperBlock>
							</NeviosFormPaper>
						)}

						{order && (
							<NeviosFormPaper title="Order" titleIcon={<TbShoppingCart size={16} />}>
								<NeviosFormPaperBlock>
									<Tooltip title="View order details">
										<Typography 
											onClick={() => router.push(`/dashboard/orders/${order.id}`)} 
											variant="body2x" 
											sx={{ 
												width: 'fit-content', 
												cursor: 'pointer', 
												color: 'primary.main', 
												'&:hover': { textDecoration: 'underline' } 
											}}
										>
											{order.name}
										</Typography>
									</Tooltip>
									<Typography variant="body2" color="text.secondary">
										{formatReadableDatetime(order.created_at)}
									</Typography>
									{order.total_amount && (
										<Typography variant="body2" color="text.secondary">
											Total: {order.local_currency} {formatCurrencyNumber(order.total_amount)}
										</Typography>
									)}
								</NeviosFormPaperBlock>
							</NeviosFormPaper>
						)}

						<NeviosFormPaper title="Details" titleIcon={<TbReceipt size={16} />}>
							<NeviosFormPaperBlock>
								<Typography variant="body2" fontWeight={600}>Payment ID</Typography>
								<NeviosCopyBlock copyValue={payment.id} />
							</NeviosFormPaperBlock>

							<NeviosFormPaperBlock>
								<Typography variant="body2" fontWeight={600}>Created</Typography>
								<Typography variant="body2">
									{formatReadableDatetime(payment.created_at)}
								</Typography>
							</NeviosFormPaperBlock>

							<NeviosFormPaperBlock>
								<Typography variant="body2" fontWeight={600}>Currency</Typography>
								<Typography variant="body2">{payment.currency}</Typography>
							</NeviosFormPaperBlock>
						</NeviosFormPaper>
					</>
				}
			/>
		</PageContainer>
	);
} 