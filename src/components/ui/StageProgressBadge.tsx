import { CheckCircle2, CircleDashed } from 'lucide-react';

interface StageProgressBadgeProps {
    stage: 1 | 2 | 3;
    completed: boolean;
}

export const StageProgressBadge = ({ stage, completed }: StageProgressBadgeProps) => {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
            }`}
        >
            {completed ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
            {completed ? `Stage ${stage}` : `Pending ${stage}`}
        </span>
    );
};
