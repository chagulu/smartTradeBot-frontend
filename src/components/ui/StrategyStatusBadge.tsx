import type { Strategy } from '../../types';

const statusStyles: Record<Strategy['status'], string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PAUSED: 'bg-amber-100 text-amber-700',
    STOPPED: 'bg-gray-200 text-gray-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
};

interface StrategyStatusBadgeProps {
    status: Strategy['status'];
}

export const StrategyStatusBadge = ({ status }: StrategyStatusBadgeProps) => {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
            {status}
        </span>
    );
};
