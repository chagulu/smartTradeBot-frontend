
import { Outlet, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppContext } from '../../context/AppContext';

export const Layout = () => {
    const { loggedIn, setLoggedIn, setUserId } = useAppContext();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        if (searchParams.get('status') === 'success' || searchParams.get('user_id')) {
            setLoggedIn(true);
            if (searchParams.get('user_id')) {
                setUserId(searchParams.get('user_id'));
            }
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [searchParams, setLoggedIn, setUserId, location.pathname]);

    // Allow rendering temporarily if we have query parameters so useEffect can run
    const isAuthRedirect = searchParams.get('status') === 'success' || searchParams.get('user_id');

    if (!loggedIn && !isAuthRedirect) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
