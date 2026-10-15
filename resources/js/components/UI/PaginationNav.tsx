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
                            className="cursor-not-allowed rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-300"
                        >
                            {content}
                        </span>
                    );
                }

                return (
                    <Link
                        key={idx}
                        href={link.url}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                            link.active
                                ? 'bg-blue-600 font-semibold text-white'
                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
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
