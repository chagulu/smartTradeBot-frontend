/* eslint-disable */
import { useEffect, useState } from 'react';
import { StrategyForm } from '../components/ui/StrategyForm';
import { StrategyListCard } from '../components/ui/StrategyListCard';
import { strategyService } from '../services/strategyService';
import { useAppContext } from '../context/AppContext';

export const Strategies = () => {
    const { activeStrategies, setActiveStrategies } = useAppContext();
    const [loading, setLoading] = useState(true);

    const fetchStrategies = async () => {
        setLoading(true);
        try {
            const res = await strategyService.getStatus();
            setActiveStrategies(res.active_strategies || []);
        } catch (_error) {
            console.error('Failed to fetch strategies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStrategies();
    }, []);

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
