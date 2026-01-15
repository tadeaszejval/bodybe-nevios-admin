import { Customers } from '../../../routes/Dashboard/Customers/main';
export default function Page() {
    return <Customers />;
}
export const metadata = {
    title: `Customers • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};

