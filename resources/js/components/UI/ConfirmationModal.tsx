import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = true,
    isLoading = false,
}: ConfirmationModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="animate-in fade-in zoom-in relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl duration-150">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="mb-4 flex items-center gap-3.5">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isDanger
                                ? 'bg-rose-50 text-rose-600'
                                : 'bg-amber-50 text-amber-600'
                        }`}
                    >
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                </div>

                <p className="mb-6 text-sm text-gray-600">{message}</p>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors ${
                            isDanger
                                ? 'bg-rose-600 hover:bg-rose-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
