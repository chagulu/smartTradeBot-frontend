import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { StrategyForm } from '../components/ui/StrategyForm';
import { StrategyListCard } from '../components/ui/StrategyListCard';
import { strategyService } from '../services/strategyService';
import { useAppContext } from '../context/AppContext';

export const Strategies = () => {
    const { activeStrategies, setActiveStrategies } = useAppContext();
    const [loading, setLoading] = useState(true);

    const fetchStrategies = useCallback(async () => {
        setLoading(true);
        try {
            const res = await strategyService.getStatus();
            setActiveStrategies(res.active_strategies || []);
        } catch (error) {
            console.error('Failed to fetch strategies', error);
            toast.error('Strategy status refresh failed', { id: 'strategy-refresh-failed' });
        } finally {
            setLoading(false);
        }
    }, [setActiveStrategies]);

    useEffect(() => {
        const initialStrategyTimeout = window.setTimeout(fetchStrategies, 0);
        const strategyInterval = setInterval(fetchStrategies, 15000);

        return () => {
            clearTimeout(initialStrategyTimeout);
            clearInterval(strategyInterval);
        };
    }, [fetchStrategies]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Strategy Management</h1>
                <p className="text-gray-500 mt-1">Activate and monitor your automated trading strategies.</p>
            </div>

            <StrategyForm onSuccess={fetchStrategies} />
            
            <StrategyListCard 
                strategies={activeStrategies} 
                loading={loading} 
                onRefresh={fetchStrategies} 
            />
        </div>
    );
};
