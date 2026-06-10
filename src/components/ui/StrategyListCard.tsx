import React from 'react';
import type { Strategy } from '../../types';
import { strategyService } from '../../services/strategyService';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

interface StrategyListCardProps {
    strategies: Strategy[];
    loading?: boolean;
    onRefresh: () => void;
}

export const StrategyListCard: React.FC<StrategyListCardProps> = ({ strategies, loading, onRefresh }) => {
    const handleDeactivate = async (id: number) => {
        try {
            await strategyService.deactivate(id);
            toast.success('Strategy deactivated');
            onRefresh();
        } catch {
            toast.error('Failed to deactivate strategy');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Active Strategies</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Symbol</th>
                            <th className="px-6 py-3">EMA Period</th>
                            <th className="px-6 py-3">Quantity</th>
                            <th className="px-6 py-3">Profit Targets (%)</th>
                            <th className="px-6 py-3">Stop Loss (%)</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center">
                                    <div className="animate-pulse h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                                </td>
                            </tr>
                        ) : strategies.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No active strategies found.
                                </td>
                            </tr>
                        ) : (
                            strategies.map((strategy) => (
                                <tr key={strategy.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">#{strategy.id}</td>
                                    <td className="px-6 py-4 font-bold text-blue-600">{strategy.symbol}</td>
                                    <td className="px-6 py-4">{strategy.ema_period}</td>
                                    <td className="px-6 py-4">{strategy.quantity}</td>
                                    <td className="px-6 py-4">{strategy.profit_targets.join(', ')}</td>
                                    <td className="px-6 py-4 text-red-500">{strategy.stop_loss}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeactivate(strategy.id)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                            title="Deactivate Strategy"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
