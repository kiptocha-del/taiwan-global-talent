import type { ReactNode } from 'react';

interface TabButtonProps {
    label: string;
    subLabel?: string;
    isActive: boolean;
    onClick: () => void;
    icon?: ReactNode;
}

export default function TabButton({
    label,
    subLabel,
    isActive,
    onClick,
    icon,
}: TabButtonProps) {
    return (
        <button
            type="button"
            aria-pressed={isActive}
            onClick={onClick}
            className={`relative flex h-full flex-col justify-center border-b-2 px-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isActive
                    ? 'border-accent font-semibold text-brand-strong'
                    : 'border-transparent text-muted hover:border-border hover:text-ink'
            }`}
        >
            <span className="flex items-center gap-1.5">
                {icon && <span className="text-sm">{icon}</span>}
                <span className="text-sm tracking-wide">{label}</span>
            </span>
            {subLabel && (
                <span className="-mt-0.5 text-[10px] font-normal tracking-wider opacity-70">
                    {subLabel}
                </span>
            )}
        </button>
    );
}
