import { Head, Link, router } from '@inertiajs/react';
import { Ban, Clock, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ApplicationStatusValue = 'pending' | 'rejected' | 'suspended';

interface ApplicationStatusProps {
    /** Shown in the copy, e.g. "partner" or "teacher". */
    applicantLabel: string;
    status: ApplicationStatusValue;
    rejectionReason?: string | null;
    submittedAt?: string | null;
    /** Where a denied applicant corrects and resubmits the form. */
    reapplyHref: string;
}

const ADMIN_WHATSAPP = '886905787970';

const STATUS_COPY: Record<
    ApplicationStatusValue,
    {
        icon: LucideIcon;
        badge: string;
        title: string;
        iconClasses: string;
        badgeClasses: string;
    }
> = {
    pending: {
        icon: Clock,
        badge: 'Pending review',
        title: 'Your application is under review',
        iconClasses: 'bg-status-warning-soft text-status-warning',
        badgeClasses:
            'bg-status-warning-soft text-status-warning ring-status-warning/20',
    },
    rejected: {
        icon: XCircle,
        badge: 'Denied',
        title: 'Your application was not approved',
        iconClasses: 'bg-status-danger-soft text-status-danger',
        badgeClasses:
            'bg-status-danger-soft text-status-danger ring-status-danger/20',
    },
    suspended: {
        icon: Ban,
        badge: 'Suspended',
        title: 'Your account is suspended',
        iconClasses: 'bg-surface-muted text-muted',
        badgeClasses: 'bg-surface-muted text-muted ring-border',
    },
};

export default function ApplicationStatus({
    applicantLabel,
    status,
    rejectionReason,
    submittedAt,
    reapplyHref,
}: ApplicationStatusProps) {
    const copy = STATUS_COPY[status] ?? STATUS_COPY.pending;
    const Icon = copy.icon;
    const whatsappText = encodeURIComponent(
        `Hello Admin, I would like to ask about my ${applicantLabel} application.`,
    );

    return (
        <div className="flex min-h-screen flex-col justify-center bg-canvas px-4 py-12 sm:px-6 lg:px-8">
            <Head title="Application Status" />

            <div className="w-full max-w-md sm:mx-auto">
                <div className="rounded-2xl border border-border bg-surface px-4 py-8 text-center shadow-xl sm:px-10">
                    <div
                        className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${copy.iconClasses}`}
                    >
                        <Icon className="h-10 w-10" />
                    </div>

                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${copy.badgeClasses}`}
                    >
                        {copy.badge}
                    </span>

                    <h1 className="mt-4 text-2xl font-extrabold text-ink">
                        {copy.title}
                    </h1>

                    {status === 'pending' && (
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            Thank you for applying. Our team is reviewing your
                            details and documents, which usually takes{' '}
                            <strong className="text-ink">
                                1–2 business days
                            </strong>
                            . Sign in again any time to check this page; once
                            you are approved it opens your dashboard instead.
                        </p>
                    )}

                    {status === 'rejected' && (
                        <>
                            <div className="mt-4 rounded-lg border border-status-danger/30 bg-status-danger-soft p-4 text-left">
                                <h2 className="text-xs font-bold tracking-wide text-status-danger uppercase">
                                    Reason from our team
                                </h2>
                                <p className="mt-1 text-sm leading-relaxed text-status-danger">
                                    {rejectionReason ||
                                        'Your application did not meet our verification criteria.'}
                                </p>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                                You can correct your details and send the
                                application again.
                            </p>
                            <Link
                                href={reapplyHref}
                                className="mt-5 flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-brand shadow-sm transition hover:bg-accent/90"
                            >
                                Fix and resubmit
                            </Link>
                        </>
                    )}

                    {status === 'suspended' && (
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            Access to your dashboard is paused. Please contact
                            the admin team to find out more.
                        </p>
                    )}

                    {submittedAt && status === 'pending' && (
                        <p className="mt-4 text-xs text-muted">
                            Submitted on{' '}
                            {new Date(submittedAt).toLocaleDateString(
                                undefined,
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                },
                            )}
                        </p>
                    )}

                    <a
                        href={`https://wa.me/${ADMIN_WHATSAPP}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 flex w-full items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-canvas"
                    >
                        Contact admin via WhatsApp
                    </a>

                    <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                        <span className="text-xs text-muted">
                            Signed in with the wrong account?
                        </span>
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="text-xs font-semibold text-status-danger transition focus:outline-none"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
