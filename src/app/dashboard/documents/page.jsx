import { Documents } from '../../../routes/Dashboard/Documents/main';
export default function Page() {
    return <Documents />;
}
export const metadata = {
    title: `Documents • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};


