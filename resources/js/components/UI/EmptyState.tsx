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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-gray-900">
                {title}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
