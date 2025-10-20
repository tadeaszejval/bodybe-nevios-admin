import { PaymentView } from '../../../../routes/Dashboard/Payments/view';

export default function PaymentDetailPage({ params }) {
    return <PaymentView paymentId={params.id} />;
}

export const metadata = {
    title: 'Payment Details • Vasky | Nevios',
}; 