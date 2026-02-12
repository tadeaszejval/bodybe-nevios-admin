import { DashboardLayout } from '../../components/DashboardLayout';
import { RequireAuth } from '../../components/RequireAuth';
import { NavigationHistoryProvider } from '../../context/NavigationHistoryContext';

export default function DashboardPageLayout({ children }) {
    return (
        <RequireAuth>
            <NavigationHistoryProvider>
                <DashboardLayout>{children}</DashboardLayout>
            </NavigationHistoryProvider>
        </RequireAuth>
    );
}

export const metadata = {
    title: 'Dashboard',
};

