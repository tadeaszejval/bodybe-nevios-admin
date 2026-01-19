import { Backorders } from '../../../routes/Dashboard/Backorders/main';
export default function Page() {
    return <Backorders />;
}
export const metadata = {
    title: `Backorders • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};
