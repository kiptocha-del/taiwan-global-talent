import { Link } from '@inertiajs/react';
import { Bell, UserCheck, Briefcase, Building2, Check } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';

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

export default function NotificationDropdown({
    isOpen,
    onToggle,
    initialNotifications = [],
}: NotificationDropdownProps) {
    const { t } = useTranslation();
    const [readIds, setReadIds] = useState<Set<string | number>>(
        () => new Set(),
    );

    const notifications: NotificationItem[] = initialNotifications.map(
        (n) => ({ ...n, read: n.read || readIds.has(n.id) }),
    );

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
                return <UserCheck className="h-4 w-4 text-accent"/>;
            case 'job':
                return <Briefcase className="h-4 w-4 text-status-positive"/>;
            default:
                return <Building2 className="h-4 w-4 text-accent"/>;
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="relative rounded-lg border border-border p-2 text-muted transition-colors hover:bg-canvas hover:text-muted"
            >
                <Bell className="h-4 w-4"/>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-brand ring-2 ring-surface">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl sm:w-96">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-ink">
                                {t('notifications.title')}
                            </h3>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
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
                                className="flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
                            >
                                <Check className="h-3 w-3"/>{''}
                                {t('notifications.markAllRead')}
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 divide-y divide-border overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <Link
                                    key={notif.id}
                                    href={notif.link || '#'}
                                    onClick={() => {
                                        markAsRead(notif.id);
                                        onToggle();
                                    }}
                                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-canvas ${
                                        !notif.read
                                            ? 'bg-canvas '
                                            : ''
                                    }`}
                                >
                                    <div className="mt-0.5 rounded-lg bg-surface-muted p-2">
                                        {getNotifIcon(notif.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-ink">
                                            {notif.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">
                                            {notif.message}
                                        </p>
                                        <span className="mt-1 block text-[10px] text-muted">
                                            {notif.time}
                                        </span>
                                    </div>
                                    {!notif.read && (
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"/>
                                    )}
                                </Link>
                            ))
                        ) : (
                            <div className="p-6 text-center text-xs text-muted">
                                {t('notifications.empty')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
