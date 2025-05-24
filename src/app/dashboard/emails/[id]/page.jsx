import { EmailView } from '../../../../routes/Dashboard/Emails/view';

export default function Page({ params }) {
  return <EmailView emailId={params.id} />;
}

export const metadata = {
  title: 'Email Details • Nevios',
}; 