import { Reports } from '../../../routes/Dashboard/Reports/main';
export default function Page() {
    return <Reports />;
}
export const metadata = {
    title: `Reports • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};


