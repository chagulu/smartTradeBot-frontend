import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Pause, Play, RefreshCcw, Trash2 } from 'lucide-react';
import type { Strategy } from '../../types';
import { strategyService } from '../../services/strategyService';
import { ConfirmationModal } from './ConfirmationModal';
import { StageProgressBadge } from './StageProgressBadge';
import { StrategyStatusBadge } from './StrategyStatusBadge';

interface StrategyListCardProps {
    strategies: Strategy[];
    loading?: boolean;
    onRefresh: () => void;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(value);

export const StrategyListCard: React.FC<StrategyListCardProps> = ({
    strategies,
    loading,
    onRefresh,
}) => {
    const [pendingDeactivateId, setPendingDeactivateId] = useState<number | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const handleDeactivate = async () => {
        if (!pendingDeactivateId) {
            return;
        }

        setActionLoadingId(pendingDeactivateId);

        try {
            await strategyService.deactivate(pendingDeactivateId);
            toast.success('Strategy deactivated');
            setPendingDeactivateId(null);
            onRefresh();
        } catch {
            toast.error('Failed to deactivate strategy');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handlePause = async (id: number) => {
        setActionLoadingId(id);

        try {
            await strategyService.pause(id);
            toast.success('Strategy paused');
            onRefresh();
        } catch {
            toast.error('Failed to pause strategy');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleResume = async (id: number) => {
        setActionLoadingId(id);

        try {
            await strategyService.resume(id);
            toast.success('Strategy resumed');
            onRefresh();
        } catch {
            toast.error('Failed to resume strategy');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                    Active EMA Strategies
                </h3>

                <button
                    type="button"
                    onClick={onRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <RefreshCcw size={16} />
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-6 py-3">Strategy ID</th>
                            <th className="px-6 py-3">Symbol</th>
                            <th className="px-6 py-3">EMA Period</th>
                            <th className="px-6 py-3">Buy Window</th>
                            <th className="px-6 py-3">Profit Targets</th>
                            <th className="px-6 py-3">Stop Loss</th>
                            <th className="px-6 py-3">Current Position</th>
                            <th className="px-6 py-3">Average Price</th>
                            <th className="px-6 py-3">Total P&L</th>
                            <th className="px-6 py-3">Strategy Status</th>
                            <th className="px-6 py-3">Stage Progress</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={12} className="px-6 py-8 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : strategies.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                                    No active strategies found.
                                </td>
                            </tr>
                        ) : (
                            strategies.map((strategy) => {
                                const actionDisabled = actionLoadingId === strategy.id;

                                return (
                                    <tr key={strategy.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            #{strategy.id}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-blue-600">
                                            {strategy.symbol}
                                        </td>
                                        <td className="px-6 py-4">
                                            {strategy.ema_period}
                                        </td>
                                        <td className="px-6 py-4">
                                            {strategy.buy_time_start} - {strategy.buy_time_end}
                                        </td>
                                        <td className="px-6 py-4">
                                            {strategy.stage_1_profit_percent}% / {strategy.stage_2_profit_percent}% / {strategy.stage_3_profit_percent}%
                                        </td>
                                        <td className="px-6 py-4 text-red-600">
                                            {strategy.stop_loss_percent}%
                                        </td>
                                        <td className="px-6 py-4">
                                            {strategy.current_position_quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatCurrency(strategy.current_position_avg_price)}
                                        </td>
                                        <td className={`px-6 py-4 font-semibold ${strategy.total_pnl >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                            {formatCurrency(strategy.total_pnl)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StrategyStatusBadge status={strategy.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex min-w-52 flex-wrap gap-2">
                                                <StageProgressBadge stage={1} completed={strategy.stage_1_completed} />
                                                <StageProgressBadge stage={2} completed={strategy.stage_2_completed} />
                                                <StageProgressBadge stage={3} completed={strategy.stage_3_completed} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {strategy.status === 'PAUSED' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResume(strategy.id)}
                                                        disabled={actionDisabled}
                                                        title="Resume strategy"
                                                        className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                                                    >
                                                        <Play size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePause(strategy.id)}
                                                        disabled={actionDisabled || strategy.status !== 'ACTIVE'}
                                                        title="Pause strategy"
                                                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                                                    >
                                                        <Pause size={18} />
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => setPendingDeactivateId(strategy.id)}
                                                    disabled={actionDisabled}
                                                    title="Deactivate strategy"
                                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                open={pendingDeactivateId !== null}
                title="Deactivate strategy?"
                description="This will stop the selected EMA strategy. You can activate a new strategy later."
                confirmLabel="Deactivate"
                loading={actionLoadingId === pendingDeactivateId}
                onCancel={() => setPendingDeactivateId(null)}
                onConfirm={handleDeactivate}
            />
        </div>
    );
};
