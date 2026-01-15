import { Products } from '../../../routes/Dashboard/Products/main';

export default function Page() {
    return <Products />;
}

export const metadata = {
    title: `Products • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};

