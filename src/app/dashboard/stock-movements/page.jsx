import { StockMovements } from '../../../routes/Dashboard/StockMovements/main';
export default function Page() {
    return <StockMovements />;
}
export const metadata = {
    title: `Stock Movements • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};

