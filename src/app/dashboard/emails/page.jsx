import { Emails } from '../../../routes/Dashboard/Emails/main';
export default function Page() {
    return <Emails />;
}
export const metadata = {
    title: `Emails • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};


