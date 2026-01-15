import { Payments } from '../../../routes/Dashboard/Payments/main';
export default function Page() {
    return <Payments />;
}
export const metadata = {
    title: `Payments • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};

