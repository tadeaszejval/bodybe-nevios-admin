import Analytics from '../../../routes/Dashboard/Analytics/main';
export default function Page() {
    return <Analytics />;
}
export const metadata = {
    title: `Analytics • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};

