import { Home } from '../../../routes/Dashboard/Home/main';
export default function Page() {
    return <Home />;
}
export const metadata = {
    title: `Dashboard • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};
