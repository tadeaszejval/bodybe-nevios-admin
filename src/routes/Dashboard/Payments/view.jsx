"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	Box,
	Typography,
	Alert,
	Snackbar,
	Tooltip,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { NeviosFormPaperBlock } from "../../../components/nevios/NeviosFormPaperBlock";
import { TbCreditCard, TbUser, TbShoppingCart, TbReceipt, TbArrowLeft, TbClock } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import { formatReadableDatetime, formatCurrencyNumber } from "../../../core/formatters";
import { NeviosCopyBlock } from "../../../components/nevios/NeviosCopyBlock";
import NeviosGroupButton from "../../../components/nevios/NeviosGroupButton";
import NeviosPaginationButtons from "../../../components/nevios/NeviosPaginationButtons";
import { getCountryName } from "../../../core/countryName";
import { ContentLoadingScreen } from "../../../components/ContentLoadingScreen";
import { useModuleRetrieve } from "../../../hooks/useModuleRetrieve";
import { NeviosCustomerCard } from "../../../components/nevios/NeviosCustomerCard";
import { NeviosOrderCard } from "../../../components/nevios/NeviosOrderCard";
import { NeviosBadge } from "../../../components/nevios/NeviosBadge";

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
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'info'
	});

	// ✅ NEW: Use useModuleRetrieve hook to fetch payment data via Express API
	const {
		data: payment,
		loading,
		error: fetchError,
		refreshData
	} = useModuleRetrieve('payment', paymentId, {
		expand: ['customer', 'order', 'status_history']
	});

	// Extract related data from payment object
	const customer = payment?.customer;
	const order = payment?.order;

	// Build complete status history including initial creation (newest first)
	const completeStatusHistory = useMemo(() => {
		if (!payment) return [];

		const history = payment.status_history || [];
		const allStatuses = [];

		// Add initial "Created" status using payment creation date
		allStatuses.push({
			id: 'created',
			new_status: 'CREATED',
			created_at: payment.created_at
		});

		// Add all status history entries
		allStatuses.push(...history);

		// Reverse to show newest first (latest at top)
		return allStatuses.reverse();
	}, [payment]);

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

	if (fetchError || !payment) {
		return (
			<PageContainer>
				<Alert severity="error">
					{fetchError || 'Payment not found'}
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
							previousButtonOnClick={() => { }}
							nextButtonOnClick={() => { }}
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
								<Typography variant="h6" color="text.primary" fontWeight={600}>
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

						{completeStatusHistory.length > 0 && (
							<NeviosFormPaper title="Payment Status History" titleIcon={<TbClock size={16} />}>
								<TableContainer component={Paper} elevation={0}>
									<Table size="small">
										<TableBody>
											{completeStatusHistory.map((history, index) => (
												<TableRow 
													key={history.id}
													sx={{
														"&:last-child td": {
															borderBottom: "none",
														}
													}}
												>
													<TableCell sx={{ padding: "10px 15px", borderBottom: index !== completeStatusHistory.length - 1 ? "1px solid" : "none", borderColor: "grey.200" }}>
														<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
															<NeviosBadge 
																value={history.new_status} 
																configKey="paymentStatus" 
															/>
														</Box>
													</TableCell>
													<TableCell align="right" sx={{ padding: "10px 15px", borderBottom: index !== completeStatusHistory.length - 1 ? "1px solid" : "none", borderColor: "grey.200" }}>
														<Typography variant="body2" color="text.secondary">
															{formatReadableDatetime(history.created_at)}
														</Typography>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</NeviosFormPaper>
						)}
					</>
				}
				sideContent={
					<>

						<NeviosFormPaper title="Details" titleIcon={<TbReceipt size={16} />}>
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
						<NeviosCustomerCard
							customer={customer}
							showBillingAddress={false}
						/>

						<NeviosOrderCard
							order={order}
							showTotalAmount={true}
							showCreatedDate={true}
							showOrderStatus={true}
						/>

					</>
				}
			/>
		</PageContainer>
	);
} 