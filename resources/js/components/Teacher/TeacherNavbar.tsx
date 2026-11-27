import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    BookOpen,
    Layers,
    Users,
    LogOut,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '@/components/UI/ThemeToggle';
import { logout } from '@/routes';
import teacherRoutes from '@/routes/teacher';

export default function TeacherNavbar({ teacher }: { teacher?: any }) {
    const { url } = usePage();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        {
            href: teacherRoutes.dashboard.url(),
            label: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            href: teacherRoutes.courses.index.url(),
            label: 'Courses',
            icon: BookOpen,
        },
        {
            href: teacherRoutes.modules.index.url(),
            label: 'Modules',
            icon: Layers,
        },
        {
            href: teacherRoutes.community.index.url(),
            label: 'Community',
            icon: Users,
        },
    ];

    return (
        <nav className="sticky top-0 z-30 border-b border-border bg-surface text-ink shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link
                            href={teacherRoutes.dashboard.url()}
                            className="flex items-center gap-2"
                        >
                            <div className="flex size-9 items-center justify-center rounded-control bg-brand-strong text-sm font-bold text-on-brand">
                                EDU
                            </div>
                            <span className="text-base font-bold text-brand-strong">
                                Teacher Studio
                            </span>
                        </Link>

                        <div className="hidden space-x-1.5 md:flex">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = url.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                                            active
                                                ? 'bg-brand-strong text-on-brand'
                                                : 'text-muted hover:bg-surface-muted hover:text-ink'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4"/>
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 rounded-control p-1.5 text-muted hover:bg-surface-muted"
                            >
                                <div className="flex size-8 items-center justify-center rounded-control bg-accent-soft text-xs font-bold text-accent">
                                    {teacher?.name
                                        ? teacher.name.charAt(0).toUpperCase()
                                        : 'T'}
                                </div>
                                <span className="hidden text-xs font-bold text-ink sm:block">
                                    {teacher?.name}
                                </span>
                                <ChevronDown className="size-4 text-muted"/>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-48 rounded-card border border-border bg-surface py-1 text-ink shadow-panel">
                                    <Link
                                        href={logout.url()}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-status-danger hover:bg-status-danger-soft"
                                    >
                                        <LogOut className="h-3.5 w-3.5"/> Log
                                        Out
                                    </Link>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-control p-2 text-muted hover:bg-surface-muted md:hidden"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5"/>
                            ) : (
                                <Menu className="h-5 w-5"/>
                            )}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="space-y-1 border-t border-border py-3 md:hidden">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-control px-4 py-2.5 text-xs font-semibold text-muted hover:bg-surface-muted hover:text-ink"
                            >
                                <item.icon className="h-4 w-4"/>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
