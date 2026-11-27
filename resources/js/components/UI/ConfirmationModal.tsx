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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-xs">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-title"
                className="animate-in fade-in zoom-in relative w-full max-w-md rounded-panel border border-border bg-surface p-6 text-ink shadow-panel duration-150"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="absolute top-4 right-4 rounded-control p-1 text-muted hover:bg-surface-muted hover:text-ink"
                >
                    <X className="h-4 w-4"/>
                </button>

                <div className="mb-4 flex items-center gap-3.5">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isDanger
                                ? 'bg-status-danger-soft text-status-danger'
                                : 'bg-status-warning-soft text-status-warning'
                        }`}
                    >
                        <AlertTriangle className="h-5 w-5"/>
                    </div>
                    <h3
                        id="confirmation-title"
                        className="font-display text-xl font-semibold text-ink"
                    >
                        {title}
                    </h3>
                </div>

                <p className="mb-6 text-sm leading-6 text-muted">{message}</p>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-control bg-surface-muted px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-border"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`rounded-xl px-4 py-2 text-sm font-medium text-on-brand transition-colors ${
                            isDanger
                                ? 'bg-status-danger hover:brightness-95'
                                : 'bg-brand-strong hover:bg-brand'
                        } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
