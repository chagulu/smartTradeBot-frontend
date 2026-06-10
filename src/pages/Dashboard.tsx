import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerHealthCard } from '../components/ui/WorkerHealthCard';
import { StrategyListCard } from '../components/ui/StrategyListCard';
import { workerService } from '../services/workerService';
import { strategyService } from '../services/strategyService';
import { useAppContext } from '../context/AppContext';
import type { WorkerHealth } from '../types';
import { TrendingUp, Activity, PlusCircle, Settings } from 'lucide-react';

export const Dashboard = () => {
    const {
        workerStatus,
        setWorkerStatus,
        activeStrategies,
        setActiveStrategies,
    } = useAppContext();

    const [healthDetails, setHealthDetails] =
        useState<WorkerHealth | null>(null);

    const [loadingHealth, setLoadingHealth] = useState(true);
    const [loadingStrategies, setLoadingStrategies] = useState(true);

    const navigate = useNavigate();

    const fetchHealth = async () => {
        try {
            const health = await workerService.getHealth();

            setWorkerStatus(health.status);
            setHealthDetails(health);
        } catch (error) {
            console.error('Failed to fetch worker health', error);
            setWorkerStatus('Offline');
        } finally {
            setLoadingHealth(false);
        }
    };

    const fetchStrategies = async () => {
        try {
            const res = await strategyService.getStatus();

            setActiveStrategies(res.active_strategies || []);
        } catch (error) {
            console.error('Failed to fetch strategies', error);
        } finally {
            setLoadingStrategies(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        fetchStrategies();

        const healthInterval = setInterval(fetchHealth, 30000);
        const strategyInterval = setInterval(fetchStrategies, 15000);

        return () => {
            clearInterval(healthInterval);
            clearInterval(strategyInterval);
        };
    }, []);

    const totalQuantity = activeStrategies.reduce(
        (sum, strategy) => sum + strategy.quantity,
        0
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <WorkerHealthCard
                    status={workerStatus}
                    intervalSeconds={healthDetails?.interval_seconds}
                    loading={loadingHealth}
                />

                {/* Position Summary Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800">
                            Position Summary
                        </h3>
                    </div>

                    {loadingStrategies ? (
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">
                                    Active Strategies
                                </span>

                                <span className="text-xl font-bold text-gray-900">
                                    {activeStrategies.length}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">
                                    Total Quantity
                                </span>

                                <span className="text-xl font-bold text-gray-900">
                                    {totalQuantity}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions Widget */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <Activity size={24} />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800">
                            Quick Actions
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/strategies')}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                        >
                            <PlusCircle size={18} />
                            Activate Strategy
                        </button>

                        <button
                            onClick={() => navigate('/strategies')}
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors font-medium"
                        >
                            <Settings size={18} />
                            Manage Strategies
                        </button>
                    </div>
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