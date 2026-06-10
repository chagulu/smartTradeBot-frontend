import api from './api';
import type { WorkerHealth } from '../types';

export const workerService = {
    getHealth: async (): Promise<WorkerHealth> => {
        const response = await api.get<WorkerHealth>('/worker/health');
        return response.data;
    },
};
