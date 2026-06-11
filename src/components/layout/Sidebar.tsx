
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, TrendingUp } from 'lucide-react';

export const Sidebar = () => {
    return (
        <aside className="w-16 sm:w-64 bg-gray-900 text-white min-h-screen flex flex-col">
            <div className="h-16 px-3 sm:px-4 flex items-center justify-center sm:justify-start text-xl font-bold border-b border-gray-800">
                <span className="sm:hidden">ST</span>
                <span className="hidden sm:inline">SmartTradeBot</span>
            </div>
            <nav className="flex-1 p-2 sm:p-4 space-y-2">
                <NavLink to="/" className={({isActive}) => `flex items-center justify-center sm:justify-start gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                    <LayoutDashboard size={20} />
                    <span className="hidden sm:inline">Dashboard</span>
                </NavLink>
                <NavLink to="/strategies" className={({isActive}) => `flex items-center justify-center sm:justify-start gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                    <TrendingUp size={20} />
                    <span className="hidden sm:inline">Strategies</span>
                </NavLink>
                <NavLink to="/health" className={({isActive}) => `flex items-center justify-center sm:justify-start gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                    <Activity size={20} />
                    <span className="hidden sm:inline">Health Monitor</span>
                </NavLink>
            </nav>
        </aside>
    );
};
