interface CardProps {
    title: string;
    subTitle?: string;
    value: string | number;
    footerText?: string;
    badge?: string;
    badgeColor?: string;
}

export default function Card({
    title,
    subTitle,
    value,
    footerText,
    badge,
    badgeColor = 'bg-surface-muted text-muted',
}: CardProps) {
    return (
        <article className="flex min-h-36 flex-col justify-between rounded-card border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-panel">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold tracking-wide text-muted uppercase">
                            {title}
                        </p>
                        {subTitle && (
                            <p className="mt-1 text-xs font-medium text-muted">
                                {subTitle}
                            </p>
                        )}
                    </div>
                    {badge && (
                        <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${badgeColor}`}
                        >
                            {badge}
                        </span>
                    )}
                </div>
                <p className="mt-5 font-display text-3xl font-bold tracking-tight text-brand-strong">
                    {value}
                </p>
            </div>
            {footerText && (
                <p className="mt-3 text-xs font-medium text-muted">
                    {footerText}
                </p>
            )}
        </article>
    );
}
