import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarChart3, ClipboardList, Wallet } from 'lucide-react';
import { PositionSummaryCard } from '../components/ui/PositionSummaryCard';
import { QuickActionsCard } from '../components/ui/QuickActionsCard';
import { StrategyListCard } from '../components/ui/StrategyListCard';
import { StrategyStatusBadge } from '../components/ui/StrategyStatusBadge';
import { WorkerHealthCard } from '../components/ui/WorkerHealthCard';
import { strategyService } from '../services/strategyService';
import { workerService } from '../services/workerService';
import { useAppContext } from '../context/AppContext';
import type { DashboardSummary, WorkerHealth } from '../types';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);

export const Dashboard = () => {
    const {
        workerStatus,
        setWorkerStatus,
        activeStrategies,
        setActiveStrategies,
    } = useAppContext();

    const [healthDetails, setHealthDetails] = useState<WorkerHealth | null>(null);
    const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);
    const [lastStrategyCheck, setLastStrategyCheck] = useState<Date | null>(null);
    const [loadingHealth, setLoadingHealth] = useState(true);
    const [loadingStrategies, setLoadingStrategies] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const navigate = useNavigate();

    const fetchHealth = useCallback(async () => {
        try {
            const health = await workerService.getHealth();

            setWorkerStatus(health.status);
            setHealthDetails(health);
            setLastHealthCheck(new Date());
        } catch (error) {
            console.error('Failed to fetch worker health', error);
            setWorkerStatus('Offline');
            setLastHealthCheck(new Date());
            toast.error('Worker offline', { id: 'worker-offline' });
        } finally {
            setLoadingHealth(false);
        }
    }, [setWorkerStatus]);

    const fetchStrategies = useCallback(async () => {
        try {
            const res = await strategyService.getStatus();

            setActiveStrategies(res.active_strategies || []);
            setLastStrategyCheck(new Date());
        } catch (error) {
            console.error('Failed to fetch strategies', error);
            toast.error('Strategy status refresh failed', { id: 'strategy-refresh-failed' });
        } finally {
            setLoadingStrategies(false);
        }
    }, [setActiveStrategies]);

    const refreshDashboard = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([fetchHealth(), fetchStrategies()]);
        setRefreshing(false);
    }, [fetchHealth, fetchStrategies]);

    useEffect(() => {
        const initialDashboardTimeout = window.setTimeout(refreshDashboard, 0);
        const healthInterval = setInterval(fetchHealth, 30000);
        const strategyInterval = setInterval(fetchStrategies, 15000);
        const dashboardInterval = setInterval(refreshDashboard, 30000);

        return () => {
            clearTimeout(initialDashboardTimeout);
            clearInterval(healthInterval);
            clearInterval(strategyInterval);
            clearInterval(dashboardInterval);
        };
    }, [fetchHealth, fetchStrategies, refreshDashboard]);

    const summary: DashboardSummary = useMemo(() => {
        return activeStrategies.reduce(
            (acc, strategy) => {
                if (strategy.status === 'ACTIVE') {
                    acc.activeCount += 1;
                }

                if (strategy.status === 'PAUSED') {
                    acc.pausedCount += 1;
                }

                if (strategy.status === 'STOPPED') {
                    acc.stoppedCount += 1;
                }

                if (strategy.status === 'COMPLETED') {
                    acc.completedCount += 1;
                }

                acc.totalQuantityHeld += strategy.current_position_quantity;
                acc.totalCapitalUtilized += strategy.current_position_quantity * strategy.current_position_avg_price;
                acc.totalUnrealizedPnl += strategy.total_pnl;

                return acc;
            },
            {
                activeCount: 0,
                pausedCount: 0,
                stoppedCount: 0,
                completedCount: 0,
                totalQuantityHeld: 0,
                totalCapitalUtilized: 0,
                totalUnrealizedPnl: 0,
            }
        );
    }, [activeStrategies]);

    const recentStrategies = activeStrategies.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <WorkerHealthCard
                    status={workerStatus}
                    intervalSeconds={healthDetails?.interval_seconds}
                    lastChecked={lastHealthCheck}
                    loading={loadingHealth}
                />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Strategy Summary
                        </h3>
                    </div>

                    {loadingStrategies ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-4/5" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg bg-green-50 p-3">
                                <span className="block text-green-700">Active</span>
                                <strong className="text-xl text-green-900">{summary.activeCount}</strong>
                            </div>
                            <div className="rounded-lg bg-amber-50 p-3">
                                <span className="block text-amber-700">Paused</span>
                                <strong className="text-xl text-amber-900">{summary.pausedCount}</strong>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                                <span className="block text-gray-600">Stopped</span>
                                <strong className="text-xl text-gray-900">{summary.stoppedCount}</strong>
                            </div>
                            <div className="rounded-lg bg-blue-50 p-3">
                                <span className="block text-blue-700">Completed</span>
                                <strong className="text-xl text-blue-900">{summary.completedCount}</strong>
                            </div>
                        </div>
                    )}
                </div>

                <PositionSummaryCard summary={summary} loading={loadingStrategies} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Wallet size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Total P&L
                        </h3>
                    </div>

                    {loadingStrategies ? (
                        <div className="animate-pulse h-8 rounded bg-gray-200" />
                    ) : (
                        <div>
                            <div className={`text-3xl font-bold ${summary.totalUnrealizedPnl >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                {formatCurrency(summary.totalUnrealizedPnl)}
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Capital utilized: {formatCurrency(summary.totalCapitalUtilized)}
                            </p>
                        </div>
                    )}
                </div>

                <QuickActionsCard
                    refreshing={refreshing}
                    onActivate={() => navigate('/strategies')}
                    onManage={() => navigate('/strategies')}
                    onRefresh={refreshDashboard}
                />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
                            <ClipboardList size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Recent Activity
                        </h3>
                    </div>

                    {loadingStrategies ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-4/5" />
                            <div className="h-4 bg-gray-200 rounded w-3/5" />
                        </div>
                    ) : recentStrategies.length === 0 ? (
                        <p className="text-sm text-gray-500">No strategy activity yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentStrategies.map((strategy) => (
                                <div key={strategy.id} className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-gray-900">{strategy.symbol}</p>
                                        <p className="text-xs text-gray-500">EMA {strategy.ema_period}</p>
                                    </div>
                                    <StrategyStatusBadge status={strategy.status} />
                                </div>
                            ))}
                        </div>
                    )}

                    {lastStrategyCheck && (
                        <p className="mt-4 text-xs text-gray-400">
                            Last updated {lastStrategyCheck.toLocaleTimeString()}
                        </p>
                    )}
                </div>
            </div>

            <StrategyListCard
                strategies={activeStrategies}
                loading={loadingStrategies}
                onRefresh={fetchStrategies}
            />
        </div>
    );
};
