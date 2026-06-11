import { PlusCircle, RefreshCcw, Settings } from 'lucide-react';

interface QuickActionsCardProps {
    refreshing?: boolean;
    onActivate: () => void;
    onManage: () => void;
    onRefresh: () => void;
}

export const QuickActionsCard = ({
    refreshing,
    onActivate,
    onManage,
    onRefresh,
}: QuickActionsCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                    <Settings size={24} />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                    Quick Actions
                </h3>
            </div>

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={onActivate}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                >
                    <PlusCircle size={18} />
                    Activate Strategy
                </button>

                <button
                    type="button"
                    onClick={onManage}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors font-medium"
                >
                    <Settings size={18} />
                    Manage Strategies
                </button>

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors font-medium disabled:opacity-60"
                >
                    <RefreshCcw size={18} className={refreshing ? 'animate-spin' : ''} />
                    Refresh Dashboard
                </button>
            </div>
        </div>
    );
};
