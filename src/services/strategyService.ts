import api from './api';
import type { Strategy } from '../types';

export const strategyService = {
    getStatus: async (): Promise<{ active_strategies: Strategy[] }> => {
        const response = await api.get<{ active_strategies: Strategy[] }>('/strategy/status');
        return response.data;
    },
    activate: async (payload: Omit<Strategy, 'id'>): Promise<{ message: string; strategy_id: number }> => {
        const response = await api.post('/strategy/activate', payload);
        return response.data;
    },
    deactivate: async (strategy_id: number): Promise<{ message: string; strategy_id: number }> => {
        const response = await api.post('/strategy/deactivate', { strategy_id });
        return response.data;
    },
};
