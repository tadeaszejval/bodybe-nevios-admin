import { Stores } from '../../../routes/Dashboard/Stores/main';
export default function Page() {
    return <Stores />;
}
export const metadata = {
    title: `Stores • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};


