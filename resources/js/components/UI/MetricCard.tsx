import type { ReactNode } from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    graph?: ReactNode;
    className?: string;
}

export default function MetricCard({
    title,
    value,
    icon,
    graph,
    className = '',
}: MetricCardProps) {
    return (
        <article
            className={`flex items-center justify-between rounded-card border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-panel sm:p-6 ${className}`}
        >
            <div>
                <p className="text-sm font-semibold tracking-wide text-muted uppercase">
                    {title}
                </p>
                <p className="mt-2 font-display text-4xl font-bold text-ink">
                    {value}
                </p>
            </div>
            {graph && (
                <div className="size-20 shrink-0 sm:size-24">{graph}</div>
            )}
            {!graph && icon && (
                <div className="rounded-full bg-accent-soft p-3 text-accent sm:p-4">
                    {icon}
                </div>
            )}
        </article>
    );
}
