import { Link } from '@inertiajs/react';
import { Bell, UserCheck, Briefcase, Building2, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import type { TranslationKey } from '@/i18n';

export interface NotificationItem {
    id: string | number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'applicant' | 'system' | 'job';
    link?: string;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
    initialNotifications?: NotificationItem[];
}

// Placeholder notifications shown until the backend provides real ones.
const SAMPLE_NOTIFICATIONS: ReadonlyArray<{
    id: number;
    title: TranslationKey;
    message: TranslationKey;
    time: TranslationKey;
    read: boolean;
    type: NotificationItem['type'];
    link: string;
}> = [
    {
        id: 1,
        title: 'notifications.sample1Title',
        message: 'notifications.sample1Message',
        time: 'notifications.sample1Time',
        read: false,
        type: 'applicant',
        link: '/company/applicants',
    },
    {
        id: 2,
        title: 'notifications.sample2Title',
        message: 'notifications.sample2Message',
        time: 'notifications.sample2Time',
        read: false,
        type: 'system',
        link: '/company/dashboard',
    },
    {
        id: 3,
        title: 'notifications.sample3Title',
        message: 'notifications.sample3Message',
        time: 'notifications.sample3Time',
        read: true,
        type: 'job',
        link: '/company/jobs',
    },
];

export default function NotificationDropdown({
    isOpen,
    onToggle,
    initialNotifications = [],
}: NotificationDropdownProps) {
    const { t } = useTranslation();
    const [readIds, setReadIds] = useState<Set<string | number>>(
        () => new Set(),
    );

    const notifications: NotificationItem[] = (
        initialNotifications.length > 0
            ? initialNotifications
            : SAMPLE_NOTIFICATIONS.map((sample) => ({
                  ...sample,
                  title: t(sample.title),
                  message: t(sample.message),
                  time: t(sample.time),
              }))
    ).map((n) => ({ ...n, read: n.read || readIds.has(n.id) }));

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllAsRead = () => {
        setReadIds(new Set(notifications.map((n) => n.id)));
    };

    const markAsRead = (id: string | number) => {
        setReadIds((prev) => new Set(prev).add(id));
    };

    const getNotifIcon = (type: string) => {
        switch (type) {
            case 'applicant':
                return <UserCheck className="h-4 w-4 text-blue-600" />;
            case 'job':
                return <Briefcase className="h-4 w-4 text-emerald-600" />;
            default:
                return <Building2 className="h-4 w-4 text-indigo-600" />;
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="relative rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-96 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                {t('notifications.title')}
                            </h3>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                    {t('notifications.newCount', {
                                        count: unreadCount,
                                    })}
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                <Check className="h-3 w-3" />{' '}
                                {t('notifications.markAllRead')}
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <Link
                                    key={notif.id}
                                    href={notif.link || '#'}
                                    onClick={() => {
                                        markAsRead(notif.id);
                                        onToggle();
                                    }}
                                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                        !notif.read
                                            ? 'bg-slate-50/70 dark:bg-slate-800/30'
                                            : ''
                                    }`}
                                >
                                    <div className="mt-0.5 rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                                        {getNotifIcon(notif.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                            {notif.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-600 dark:text-slate-400">
                                            {notif.message}
                                        </p>
                                        <span className="mt-1 block text-[10px] text-slate-400">
                                            {notif.time}
                                        </span>
                                    </div>
                                    {!notif.read && (
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                                    )}
                                </Link>
                            ))
                        ) : (
                            <div className="p-6 text-center text-xs text-slate-500">
                                {t('notifications.empty')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
