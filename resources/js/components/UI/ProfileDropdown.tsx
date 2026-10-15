import { Link, router } from '@inertiajs/react';
import {
    Award,
    ExternalLink,
    LogOut,
    User as UserIcon,
    ChevronDown,
    Building2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { route } from 'ziggy-js';

interface UnifiedUserDropdownProps {
    user: any;
    company?: any;
    isCompanySide?: boolean;
}

export default function ProfileDropdown({
    user,
    company,
    isCompanySide = false,
}: UnifiedUserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Safe Role Normalization
    const roleMapping: Record<number, string> = {
        1: 'admin',
        2: 'teacher',
        3: 'student',
    };

    const rawRole =
        user?.role_name ||
        roleMapping[user?.role as unknown as number] ||
        'student';

    const role = String(rawRole).toLowerCase();

    // Determine target profile URL based on Role & Context
    const getProfileUrl = () => {
        if (role === 'company' || isCompanySide) {
            return '/company/profile';
        }

        if (role === 'teacher') {
            return '/teacher/profile';
        }

        return '/student/profile';
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center gap-2 rounded-xl p-1 text-left transition duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-slate-700 dark:text-indigo-300">
                    {company?.logo_url ? (
                        <img
                            src={company.logo_url}
                            alt="Company Logo"
                            className="h-full w-full object-cover"
                        />
                    ) : user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                </div>

                <div className="hidden max-w-32 text-left md:block">
                    <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {company?.company_display_name || user?.name}
                    </p>
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        {role}
                    </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* POPUP DROPDOWN */}
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 duration-200 dark:border-slate-800 dark:bg-slate-900">
                    {/* Header Info */}
                    <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                            {company?.company_display_name || user?.name}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                            {user?.email}
                        </p>
                    </div>

                    {/* Navigation Menu Items */}
                    <div className="mt-1 space-y-0.5">

                        {/* Profile Link */}
                        <Link
                            href={getProfileUrl()}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            {role === 'company' || isCompanySide ? (
                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            ) : (
                                <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                            )}
                            <span>
                                {role === 'company' || isCompanySide
                                    ? 'Company Profile'
                                    : 'My Profile'}
                            </span>
                        </Link>

                        {/* Student Specific Links */}
                        {role === 'student' && !isCompanySide && (
                            <Link
                                href={route(
                                    'student.courses.certificate.index',
                                )}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <Award className="h-3.5 w-3.5 text-slate-400" />
                                <span>My Certificates</span>
                            </Link>
                        )}

                        {/* Company Public Page Link */}
                        {company?.slug && (
                            <a
                                href={`/company/${company.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                <span>Public Page</span>
                            </a>
                        )}
                    </div>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log Out</span>
                    </button>
                </div>
            )}
        </div>
    );
}
