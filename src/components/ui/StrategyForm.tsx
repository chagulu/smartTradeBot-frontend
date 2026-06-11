import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { strategyService } from '../../services/strategyService';
import { Loader } from './Loader';

interface StrategyFormProps {
    onSuccess: () => void;
}

interface StrategyFormData {
    symbol: string;
    ema_period: number;
    buy_time_start: string;
    buy_time_end: string;
    stage_1_profit_percent: number;
    stage_2_profit_percent: number;
    stage_3_profit_percent: number;
    stop_loss_percent: number;
    max_position_size: number;
    max_capital_allocation: number;
    max_daily_loss: number;
}

export const StrategyForm: React.FC<StrategyFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<StrategyFormData>({
        defaultValues: {
            ema_period: 100,
            buy_time_start: '15:15',
            buy_time_end: '15:30',
            stage_1_profit_percent: 10,
            stage_2_profit_percent: 20,
            stage_3_profit_percent: 30,
            stop_loss_percent: 15,
            max_position_size: 1000,
            max_capital_allocation: 50000,
            max_daily_loss: 5000,
        },
    });

    const onSubmit = async (data: StrategyFormData) => {
        try {
            await strategyService.activate({
                symbol: data.symbol.trim().toUpperCase(),
                ema_period: Number(data.ema_period),
                buy_time_start: data.buy_time_start,
                buy_time_end: data.buy_time_end,
                stage_1_profit_percent: Number(data.stage_1_profit_percent),
                stage_2_profit_percent: Number(data.stage_2_profit_percent),
                stage_3_profit_percent: Number(data.stage_3_profit_percent),
                stop_loss_percent: Number(data.stop_loss_percent),
                max_position_size: Number(data.max_position_size),
                max_capital_allocation: Number(data.max_capital_allocation),
                max_daily_loss: Number(data.max_daily_loss),
            });

            toast.success('Strategy activated successfully');
            reset();
            onSuccess();
        } catch {
            toast.error('Strategy activation failed');
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6"
        >
            <div>
                <h3 className="text-lg font-semibold text-gray-800">
                    Activate EMA Strategy
                </h3>
            </div>

            <section className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-500">General Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Symbol
                        </label>
                        <input
                            {...register('symbol', {
                                required: 'Symbol is required',
                            })}
                            placeholder="INFY"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.symbol && (
                            <span className="text-red-500 text-sm">{errors.symbol.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            EMA Period
                        </label>
                        <input
                            type="number"
                            {...register('ema_period', {
                                required: 'EMA period is required',
                                min: {
                                    value: 1,
                                    message: 'EMA must be greater than 0',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.ema_period && (
                            <span className="text-red-500 text-sm">{errors.ema_period.message}</span>
                        )}
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-500">Buy Window</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buy Start Time
                        </label>
                        <input
                            type="time"
                            {...register('buy_time_start', {
                                required: 'Buy start time is required',
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.buy_time_start && (
                            <span className="text-red-500 text-sm">{errors.buy_time_start.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buy End Time
                        </label>
                        <input
                            type="time"
                            {...register('buy_time_end', {
                                required: 'Buy end time is required',
                                validate: (value) =>
                                    value > getValues('buy_time_start') || 'End time must be after start time',
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.buy_time_end && (
                            <span className="text-red-500 text-sm">{errors.buy_time_end.message}</span>
                        )}
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-500">Profit Booking Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stage 1 Profit %
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('stage_1_profit_percent', {
                                required: 'Stage 1 profit is required',
                                min: {
                                    value: 0.01,
                                    message: 'Stage 1 must be greater than 0',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.stage_1_profit_percent && (
                            <span className="text-red-500 text-sm">{errors.stage_1_profit_percent.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stage 2 Profit %
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('stage_2_profit_percent', {
                                required: 'Stage 2 profit is required',
                                min: {
                                    value: 0.01,
                                    message: 'Stage 2 must be greater than 0',
                                },
                                validate: (value) =>
                                    value > getValues('stage_1_profit_percent') || 'Stage 2 must be greater than Stage 1',
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.stage_2_profit_percent && (
                            <span className="text-red-500 text-sm">{errors.stage_2_profit_percent.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stage 3 Profit %
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('stage_3_profit_percent', {
                                required: 'Stage 3 profit is required',
                                min: {
                                    value: 0.01,
                                    message: 'Stage 3 must be greater than 0',
                                },
                                validate: (value) =>
                                    value > getValues('stage_2_profit_percent') || 'Stage 3 must be greater than Stage 2',
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.stage_3_profit_percent && (
                            <span className="text-red-500 text-sm">{errors.stage_3_profit_percent.message}</span>
                        )}
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h4 className="text-sm font-semibold uppercase text-gray-500">Risk Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stop Loss %
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('stop_loss_percent', {
                                required: 'Stop loss is required',
                                min: {
                                    value: 0.01,
                                    message: 'Stop loss must be greater than 0',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.stop_loss_percent && (
                            <span className="text-red-500 text-sm">{errors.stop_loss_percent.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Position Size
                        </label>
                        <input
                            type="number"
                            {...register('max_position_size', {
                                required: 'Maximum position size is required',
                                min: {
                                    value: 1,
                                    message: 'Position size must be greater than 0',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.max_position_size && (
                            <span className="text-red-500 text-sm">{errors.max_position_size.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Capital Allocation
                        </label>
                        <input
                            type="number"
                            {...register('max_capital_allocation', {
                                required: 'Capital allocation is required',
                                min: {
                                    value: 1,
                                    message: 'Capital allocation must be greater than 0',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.max_capital_allocation && (
                            <span className="text-red-500 text-sm">{errors.max_capital_allocation.message}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Daily Loss
                        </label>
                        <input
                            type="number"
                            {...register('max_daily_loss', {
                                required: 'Maximum daily loss is required',
                                min: {
                                    value: 1,
                                    message: 'Daily loss must be greater than 0',
                                },
                                valueAsNumber: true,
                            })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.max_daily_loss && (
                            <span className="text-red-500 text-sm">{errors.max_daily_loss.message}</span>
                        )}
                    </div>
                </div>
            </section>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
            >
                {isSubmitting ? <Loader className="text-white" /> : 'Activate Strategy'}
            </button>
        </form>
    );
};
