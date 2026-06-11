import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export const ConfirmationModal = ({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    loading,
    onCancel,
    onConfirm,
}: ConfirmationModalProps) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                <div className="flex items-start gap-3 border-b border-gray-100 p-5">
                    <div className="rounded-lg bg-red-50 p-2 text-red-600">
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-400"
                    >
                        {loading ? 'Working...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
