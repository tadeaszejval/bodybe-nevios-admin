import { InventoryOperations } from '../../../routes/Dashboard/InventoryOperations/main';
export default function Page() {
    return <InventoryOperations />;
}
export const metadata = {
    title: `Inventory Operations • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};
