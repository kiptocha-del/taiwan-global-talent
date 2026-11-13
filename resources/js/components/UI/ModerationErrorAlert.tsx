import { usePage } from '@inertiajs/react';
import { ShieldAlert, X, Info } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface ModerationErrorAlertProps {
    message?: string | null;
    onClose?: () => void;
    title?: string;
    variant?: 'inline' | 'toast';
    autoDismiss?: number;
}

export default function ModerationErrorAlert({
    message,
    onClose,
    title = 'Community Policy Violation',
    variant = 'inline',
    autoDismiss = 0,
}: ModerationErrorAlertProps) {
    const { errors }: any = usePage().props;

    const extractInertiaError = (): string | null => {
        if (!errors) {
            return null;
        }

        if (typeof errors === 'string') {
            return errors;
        }

        if (errors.content) {
            return errors.content;
        }

        if (errors.media) {
            return errors.media;
        }

        const firstKey = Object.keys(errors)[0];

        if (firstKey && errors[firstKey]) {
            return Array.isArray(errors[firstKey])
                ? errors[firstKey][0]
                : errors[firstKey];
        }

        return null;
    };

    const activeMessage = message || extractInertiaError();
    const [dismissedMessage, setDismissedMessage] = useState<string | null>(
        null,
    );

    // Is the current message being dismissed?
    const isDismissed = activeMessage === dismissedMessage;

    const handleClose = useCallback(() => {
        if (activeMessage) {
            setDismissedMessage(activeMessage);
        }

        if (onClose) {
            onClose();
        }
    }, [activeMessage, onClose]);

    useEffect(() => {
        if (autoDismiss > 0 && activeMessage && !isDismissed) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoDismiss);

            return () => clearTimeout(timer);
        }
    }, [activeMessage, autoDismiss, isDismissed, handleClose]);

    if (!activeMessage || isDismissed) {
        return null;
    }

    if (variant === 'toast') {
        return (
            <div className="animate-in slide-in-from-top-4 fade-in fixed top-5 right-5 z-50 max-w-md duration-300">
                <div className="flex items-start gap-3 rounded-2xl border border-status-danger/30 bg-status-danger p-4 text-on-brand shadow-2xl backdrop-blur-md">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface/20">
                        <ShieldAlert className="h-5 w-5 text-on-brand"/>
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-surface/20 px-1.5 py-0.5 text-[10px] font-black tracking-wider uppercase">
                                Moderation Block
                            </span>
                        </div>
                        <p className="wrap-break-words text-xs leading-relaxed font-semibold text-status-danger">
                            {activeMessage}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-1 text-on-brand/80 transition hover:bg-surface/20 hover:text-on-brand"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-status-danger/30 bg-status-danger-soft/90 p-4 text-status-danger shadow-xs backdrop-blur-xs transition-all duration-200">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-status-danger-soft text-status-danger shadow-xs">
                    <ShieldAlert className="h-5 w-5"/>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-status-danger px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-on-brand uppercase">
                            Moderation Alert
                        </span>
                        <h4 className="truncate text-xs font-bold text-status-danger">
                            {title}
                        </h4>
                    </div>
                    <p className="wrap-break-words mt-1.5 text-xs leading-relaxed font-semibold text-status-danger">
                        {activeMessage}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-status-danger/80">
                        <Info className="h-3 w-3 shrink-0"/>
                        Please check community guidelines and adjust your text
                        or media before resubmitting.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleClose}
                    className="shrink-0 rounded-lg p-1.5 text-status-danger transition hover:bg-status-danger-soft hover:text-status-danger"
                    aria-label="Dismiss alert"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        </div>
    );
}
