import React from 'react';
import { useForm } from 'react-hook-form';
import { strategyService } from '../../services/strategyService';
import toast from 'react-hot-toast';
import { Loader } from './Loader';

interface StrategyFormProps {
    onSuccess: () => void;
}

interface StrategyFormData {
    symbol: string;
    ema_period: number;
    quantity: number;
    entry_buffer_percent: number;
    profit_targets: string;
    stop_loss: number;
}

export const StrategyForm: React.FC<StrategyFormProps> = ({ onSuccess }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<StrategyFormData>();

    const onSubmit = async (data: StrategyFormData) => {
        try {
            const targets = data.profit_targets.split(',').map(t => parseFloat(t.trim())).filter(t => !isNaN(t));
            
            await strategyService.activate({
                symbol: data.symbol.toUpperCase(),
                ema_period: Number(data.ema_period),
                quantity: Number(data.quantity),
                entry_buffer_percent: Number(data.entry_buffer_percent),
                profit_targets: targets,
                stop_loss: Number(data.stop_loss),
            });
            
            toast.success('Strategy activated successfully');
            reset();
            onSuccess();
        } catch {
            toast.error('Failed to activate strategy');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activate New Strategy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                    <input 
                        {...register('symbol', { required: 'Symbol is required' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g., INFY"
                    />
                    {errors.symbol && <span className="text-red-500 text-sm">{errors.symbol.message}</span>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EMA Period</label>
                    <input 
                        type="number" step="1"
                        {...register('ema_period', { required: true, min: 1 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input 
                        type="number" step="1"
                        {...register('quantity', { required: true, min: 1 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Buffer %</label>
                    <input 
                        type="number" step="0.01"
                        {...register('entry_buffer_percent', { required: true })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="0.0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profit Targets % (comma-separated)</label>
                    <input 
                        {...register('profit_targets', { required: true })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="0.10, 0.20, 0.30"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss %</label>
                    <input 
                        type="number" step="0.01"
                        {...register('stop_loss', { required: true, min: 0.01 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="0.15"
                    />
                </div>
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
                >
                    {isSubmitting ? <Loader className="text-white" /> : 'Activate Strategy'}
                </button>
            </div>
        </form>
    );
};
