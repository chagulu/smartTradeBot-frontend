import api from './api';
import type { Strategy, StrategyCreatePayload } from '../types';

export const strategyService = {
    getStatus: async (): Promise<{ active_strategies: Strategy[] }> => {
        const response = await api.get('/strategy/status');
        return response.data;
    },

    activate: async (payload: StrategyCreatePayload): Promise<{ message: string; strategy_id: number }> => {
        const response = await api.post(
            '/strategy/activate',
            payload
        );

        return response.data;
    },

    deactivate: async (
        strategy_id: number
    ): Promise<{
        message: string;
        strategy_id: number;
    }> => {

        const response = await api.post(
            '/strategy/deactivate',
            { strategy_id }
        );

        return response.data;
    },

    pause: async (
        strategy_id: number
    ): Promise<{
        message: string;
        strategy_id: number;
    }> => {

        const response = await api.post(
            '/strategy/pause',
            { strategy_id }
        );

        return response.data;
    },

    resume: async (
        strategy_id: number
    ): Promise<{
        message: string;
        strategy_id: number;
    }> => {

        const response = await api.post(
            '/strategy/resume',
            { strategy_id }
        );

        return response.data;
    },
};
