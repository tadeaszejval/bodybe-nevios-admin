import { Kit } from '../../../routes/Dashboard/Kit/main';
export default function Page() {
    return <Kit />;
}
export const metadata = {
    title: `Kit • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};
