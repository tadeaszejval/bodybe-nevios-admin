import { FulfillmentView } from '../../../../routes/Dashboard/Fulfillments/view';

export default function Page({ params }) {
  return <FulfillmentView fulfillmentId={params.id} />;
}

export const metadata = {
  title: 'Fulfillment Details • Nevios',
}; 