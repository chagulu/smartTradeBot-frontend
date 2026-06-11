
import { useAppContext } from '../../context/AppContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const { userId, setLoggedIn, setUserId } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        setLoggedIn(false);
        setUserId(null);
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 min-h-16 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <span className="text-sm text-gray-600">Logged in as: <strong className="text-gray-900">{userId}</strong></span>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    );
};
