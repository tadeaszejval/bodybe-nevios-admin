import { Inventory } from '../../../routes/Dashboard/Inventory/main';
export default function Page() {
    return <Inventory />;
}
export const metadata = {
    title: `Inventory • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};


