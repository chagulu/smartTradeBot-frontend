/* eslint-disable */
import { useEffect, useState } from 'react';
import { WorkerHealthCard } from '../components/ui/WorkerHealthCard';
import { StrategyListCard } from '../components/ui/StrategyListCard';
import { workerService } from '../services/workerService';
import { strategyService } from '../services/strategyService';
import { useAppContext } from '../context/AppContext';
import type { WorkerHealth } from '../types';

export const Dashboard = () => {
    const { workerStatus, setWorkerStatus, activeStrategies, setActiveStrategies } = useAppContext();
    const [healthDetails, setHealthDetails] = useState<WorkerHealth | null>(null);
    const [loadingHealth, setLoadingHealth] = useState(true);
    const [loadingStrategies, setLoadingStrategies] = useState(true);

    const fetchHealth = async () => {
        try {
            const health = await workerService.getHealth();
            setWorkerStatus(health.status);
            setHealthDetails(health);
        } catch (_error) {
            setWorkerStatus('Offline');
        } finally {
            setLoadingHealth(false);
        }
    };

    const fetchStrategies = async () => {
        try {
            const res = await strategyService.getStatus();
            setActiveStrategies(res.active_strategies || []);
        } catch (_error) {
            console.error('Failed to fetch strategies');
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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <WorkerHealthCard 
                    status={workerStatus} 
                    intervalSeconds={healthDetails?.interval_seconds} 
                    loading={loadingHealth} 
                />
                
                <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-sm text-white p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
                    <p className="text-blue-100">Your algorithmic trading bot is {workerStatus.toLowerCase() === 'ok' ? 'running smoothly' : 'currently offline'}. Monitor your active strategies and performance below.</p>
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
