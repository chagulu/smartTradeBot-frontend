
import { Outlet, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppContext } from '../../context/AppContext';

export const Layout = () => {
    const { loggedIn } = useAppContext();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    if (!loggedIn) {
        const query = searchParams.toString();
        const loginTarget = query ? `/login?${query}` : '/login';

        return <Navigate to={loginTarget} replace state={{ from: location }} />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
