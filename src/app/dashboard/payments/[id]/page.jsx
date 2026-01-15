import { PaymentView } from '../../../../routes/Dashboard/Payments/view';

export default function PaymentDetailPage({ params }) {
    return <PaymentView paymentId={params.id} />;
}

export const metadata = {
    title: `Payment Details • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
}; 