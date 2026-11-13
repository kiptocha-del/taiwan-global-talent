import { Link } from '@inertiajs/react';
import { ChevronDown, ExternalLink, LogOut } from 'lucide-react';

interface UserMenuDropdownProps {
    user: any;
    company: any;
    isOpen: boolean;
    onToggle: () => void;
}

export default function UserMenuDropdown({
    user,
    company,
    isOpen,
    onToggle,
}: UserMenuDropdownProps) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 rounded-lg border border-border p-1.5 transition-colors hover:bg-canvas"
            >
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-accent-soft text-xs font-bold text-accent">
                    {company?.logo_url ? (
                        <img
                            src={company.logo_url}
                            alt="Logo"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        user?.name?.charAt(0) || 'C'
                    )}
                </div>
                <span className="hidden text-xs font-semibold text-muted sm:inline-block">
                    {company?.company_display_name || user?.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted"/>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-xs font-semibold text-ink">
                            {user?.name}
                        </p>
                        <p className="truncate text-[11px] text-muted">
                            {user?.email}
                        </p>
                    </div>
                    <div className="p-1">
                        {company?.slug && (
                            <a
                                href={`/company/${company.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:bg-canvas"
                            >
                                <ExternalLink className="h-3.5 w-3.5"/> View Public Page
                            </a>
                        )}
                        <Link
                            method="post"
                            href="/logout"
                            as="button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-status-danger hover:bg-status-danger-soft"
                        >
                            <LogOut className="h-3.5 w-3.5"/> Logout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}