import { Returns } from '../../../routes/Dashboard/Returns/main';
export default function Page() {
    return <Returns />;
}
export const metadata = {
    title: `Returns • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};
