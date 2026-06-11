import { BriefcaseBusiness } from 'lucide-react';
import type { DashboardSummary } from '../../types';

interface PositionSummaryCardProps {
    summary: DashboardSummary;
    loading?: boolean;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

export const PositionSummaryCard = ({ summary, loading }: PositionSummaryCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <BriefcaseBusiness size={24} />
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                    Position Summary
                </h3>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 rounded w-3/5" />
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-500">Total Active Strategies</span>
                        <span className="font-semibold text-gray-900">{summary.activeCount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-500">Total Quantity Held</span>
                        <span className="font-semibold text-gray-900">{summary.totalQuantityHeld}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-500">Capital Utilized</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(summary.totalCapitalUtilized)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-gray-500">Unrealized P&L</span>
                        <span className={`font-semibold ${summary.totalUnrealizedPnl >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                            {formatCurrency(summary.totalUnrealizedPnl)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
