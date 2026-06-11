import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WorkerHealthCard } from '../components/ui/WorkerHealthCard';
import { workerService } from '../services/workerService';
import { useAppContext } from '../context/AppContext';
import type { WorkerHealth } from '../types';

export const HealthMonitor = () => {
    const { workerStatus, setWorkerStatus } = useAppContext();
    const [healthDetails, setHealthDetails] = useState<WorkerHealth | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchHealth = useCallback(async () => {
        try {
            const health = await workerService.getHealth();

            setWorkerStatus(health.status);
            setHealthDetails(health);
            setLastUpdated(new Date());
        } catch {
            setWorkerStatus('Offline');
            setHealthDetails(null);
            setLastUpdated(new Date());
            toast.error('Worker offline', { id: 'worker-offline' });
        } finally {
            setLoading(false);
        }
    }, [setWorkerStatus]);

    useEffect(() => {
        const initialHealthTimeout = window.setTimeout(fetchHealth, 0);

        const healthInterval = setInterval(fetchHealth, 30000);

        return () => {
            clearTimeout(initialHealthTimeout);
            clearInterval(healthInterval);
        };
    }, [fetchHealth]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Health Monitor</h1>
                <p className="text-gray-500 mt-1">Worker status refreshes every 30 seconds.</p>
            </div>

            <div className="max-w-xl">
                <WorkerHealthCard
                    status={workerStatus}
                    intervalSeconds={healthDetails?.interval_seconds}
                    lastChecked={lastUpdated}
                    loading={loading}
                />
            </div>
        </div>
    );
};
