import { Link, usePage } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import companyRoutes from '@/routes/company';
import ProfileDropdown from '../UI/ProfileDropdown';
import ThemeToggle from '../UI/ThemeToggle';
import CompanyStatusBadge from './CompanyStatusBadge';
import type { NotificationItem } from './NotificationDropdown';
import NotificationDropdown from './NotificationDropdown';

interface CompanyNavbarProps {
    company: any;
    notifications?: NotificationItem[];
}

export default function CompanyNavbar({
    company,
    notifications,
}: CompanyNavbarProps) {
    const { url } = usePage() as any;
    const { user } = useAuth();

    const [notifOpen, setNotifOpen] = useState(false);

    const getNavClass = (path: string) => {
        const active = url.startsWith(path);

        return `rounded-control px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink ${
            active ? 'bg-brand-strong text-white shadow-sm dark:text-ink' : ''
        }`;
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-surface/95 text-ink shadow-sm backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand & Nav Links */}
                <div className="flex items-center gap-8">
                    <Link
                        href={companyRoutes.dashboard.url()}
                        className="flex items-center gap-2.5"
                    >
                        <div className="flex size-9 items-center justify-center rounded-control bg-brand-strong text-white shadow-card dark:text-ink">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <span className="text-base font-bold tracking-tight text-brand-strong">
                            Company Portal
                        </span>
                    </Link>

                    {company && (
                        <nav className="hidden items-center gap-1 md:flex">
                            <Link
                                href={companyRoutes.dashboard.url()}
                                className={getNavClass('/company/dashboard')}
                            >
                                Overview
                            </Link>
                            <Link
                                href={companyRoutes.jobs.index.url()}
                                className={getNavClass('/company/jobs')}
                            >
                                Job Postings
                            </Link>
                            <Link
                                href={companyRoutes.applicants.index.url()}
                                className={getNavClass('/company/applicants')}
                            >
                                Applicants
                            </Link>
                            <Link
                                href={companyRoutes.community.index.url()}
                                className={getNavClass('/company/community')}
                            >
                                Community
                            </Link>
                        </nav>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <ThemeToggle />
                    {company && (
                        <>
                            <CompanyStatusBadge status={company.status} />
                            <NotificationDropdown
                                isOpen={notifOpen}
                                initialNotifications={notifications}
                                onToggle={() => {
                                    setNotifOpen(!notifOpen);
                                }}
                            />
                            <ProfileDropdown user={user} />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
