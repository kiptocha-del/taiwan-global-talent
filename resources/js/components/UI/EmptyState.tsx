import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface px-4 py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-control bg-accent-soft text-accent">
                <Icon className="h-7 w-7"/>
            </div>
            <h3 className="mb-1 text-base font-semibold text-ink">{title}</h3>
            <p className="mb-6 max-w-sm text-sm text-muted">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
