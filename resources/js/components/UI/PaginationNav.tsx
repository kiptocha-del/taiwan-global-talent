import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export default function PaginationNav({ links }: PaginationProps) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-8 flex items-center justify-center gap-1">
            {links.map((link, idx) => {
                const isPrev =
                    link.label.includes('&laquo;') ||
                    link.label.toLowerCase().includes('previous');
                const isNext =
                    link.label.includes('&raquo;') ||
                    link.label.toLowerCase().includes('next');

                let content: React.ReactNode = link.label;

                if (isPrev) {
                    content = <ChevronLeft className="h-4 w-4" />;
                }

                if (isNext) {
                    content = <ChevronRight className="h-4 w-4" />;
                }

                if (!link.url) {
                    return (
                        <span
                            key={idx}
                            aria-disabled="true"
                            className="cursor-not-allowed rounded-control bg-surface-muted px-3 py-2 text-xs font-medium text-muted opacity-60"
                        >
                            {content}
                        </span>
                    );
                }

                return (
                    <Link
                        key={idx}
                        href={link.url}
                        aria-current={link.active ? 'page' : undefined}
                        className={`rounded-control px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                            link.active
                                ? 'bg-brand-strong font-semibold text-white dark:text-ink'
                                : 'border border-border bg-surface text-muted hover:bg-surface-muted'
                        }`}
                        dangerouslySetInnerHTML={
                            !isPrev && !isNext
                                ? { __html: link.label }
                                : undefined
                        }
                    >
                        {isPrev || isNext ? content : null}
                    </Link>
                );
            })}
        </nav>
    );
}
