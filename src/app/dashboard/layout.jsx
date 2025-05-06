import { DashboardLayout } from '../../components/DashboardLayout';
import { RequireAuth } from '../../components/RequireAuth';

export default function DashboardPageLayout({ children }) {
    return (
        <RequireAuth>
            <DashboardLayout>{children}</DashboardLayout>
        </RequireAuth>
    );
}

export const metadata = {
    title: 'Dashboard',
};
