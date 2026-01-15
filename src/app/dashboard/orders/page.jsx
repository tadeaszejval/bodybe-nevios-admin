import { Orders } from '../../../routes/Dashboard/Orders/main';
export default function Page() {
    return <Orders />;
}
export const metadata = {
    title: `Orders • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};


