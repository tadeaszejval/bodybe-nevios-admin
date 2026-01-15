import { Marketing } from '../../../routes/Dashboard/Marketing/main';
export default function Page() {
    return <Marketing />;
}
export const metadata = {
    title: `Marketing • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};


