import { Shipping } from '../../../../routes/Dashboard/Settings/Shipping/main';

export default function Page() {
	return <Shipping />;
}

export const metadata = {
	title: `Shipping • Settings • ${process.env.NEXT_PUBLIC_META_TITLE || 'Vasky | Nevios'}`,
};
