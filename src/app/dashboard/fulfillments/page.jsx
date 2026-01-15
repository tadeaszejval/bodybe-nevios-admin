import { Fulfillments } from '../../../routes/Dashboard/Fulfillments/main';
export default function Page() {
    return <Fulfillments />;
}
export const metadata = {
    title: `Fulfillments • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};