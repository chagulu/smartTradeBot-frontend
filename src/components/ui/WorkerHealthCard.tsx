import React from 'react';
import { Activity } from 'lucide-react';

interface WorkerHealthCardProps {
    status: string;
    intervalSeconds?: number;
    lastChecked?: Date | null;
    loading?: boolean;
}

export const WorkerHealthCard: React.FC<WorkerHealthCardProps> = ({ status, intervalSeconds, lastChecked, loading }) => {
    const isRunning = status.toLowerCase() === 'ok' || status.toLowerCase() === 'running';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Activity size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Worker Status</h3>
            </div>
            
            {loading ? (
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isRunning ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isRunning ? 'Running' : status}
                        </span>
                    </div>
                    {intervalSeconds && (
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">Evaluation Interval</span>
                            <span className="text-gray-900 font-medium">{intervalSeconds} seconds</span>
                        </div>
                    )}
                    {lastChecked && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-gray-500">Last Checked</span>
                            <span className="text-right text-gray-900 font-medium">
                                {lastChecked.toLocaleTimeString()}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
