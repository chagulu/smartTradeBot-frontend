
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp } from 'lucide-react';

export const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
            <div className="p-4 text-xl font-bold border-b border-gray-800">
                SmartTradeBot
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/strategies" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                    <TrendingUp size={20} />
                    <span>Strategies</span>
                </NavLink>
            </nav>
        </aside>
    );
};
