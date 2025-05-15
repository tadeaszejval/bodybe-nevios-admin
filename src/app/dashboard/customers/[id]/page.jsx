import React from 'react';
import { CustomerView } from '../../../../routes/Dashboard/Customers/view';

export const metadata = {
  title: 'Customer Details | Nevios',
  description: 'View and manage customer details',
};

export default function CustomerDetailPage({ params }) {
  return <CustomerView customerId={params.id} />;
}
