import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backUrl?: string;
    actionButton?: React.ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    backUrl,
    actionButton,
}: PageHeaderProps) {
    return (
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
            <div className="space-y-1">
                {backUrl && (
                    <Link
                        href={backUrl}
                        className="mb-1 inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-brand"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </Link>
                )}
                <h1 className="font-display text-display-md font-bold tracking-tight text-ink">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-2 text-sm leading-6 text-muted">
                        {subtitle}
                    </p>
                )}
            </div>

            {actionButton && (
                <div className="flex items-center gap-3">{actionButton}</div>
            )}
        </header>
    );
}
