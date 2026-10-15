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
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center">
            <div className="space-y-1">
                {backUrl && (
                    <Link
                        href={backUrl}
                        className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </Link>
                )}
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-gray-500">{subtitle}</p>
                )}
            </div>

            {actionButton && (
                <div className="flex items-center gap-3">{actionButton}</div>
            )}
        </div>
    );
}
