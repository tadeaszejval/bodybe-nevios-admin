import { OrderView } from "../../../../routes/Dashboard/Orders/view";

export default function OrderViewPage({ params }) {
  return <OrderView orderId={params.id} />;
}

export const metadata = {
    title: 'Order • Nevios',
  };