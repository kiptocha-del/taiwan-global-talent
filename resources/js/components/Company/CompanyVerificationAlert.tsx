import { Link } from '@inertiajs/react';
import { XCircle, Clock, ArrowRight } from 'lucide-react';

interface AlertProps {
    status: string;
    reason?: string | null;
}

export default function CompanyVerificationAlert({
    status,
    reason,
}: AlertProps) {
    if (status === 'approved') {
        return null;
    }

    if (status === 'rejected') {
        return (
            <div className="rounded-2xl border border-status-danger/30 bg-status-danger-soft/80 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-status-danger-soft p-2.5 text-status-danger">
                        <XCircle className="h-6 w-6"/>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-status-danger">
                            Verification Application Rejected
                        </h3>
                        <p className="mt-1 text-xs text-status-danger">
                            {reason ||
                                'Your submitted business documents did not meet our verification criteria.'}
                        </p>
                        <div className="mt-3">
                            <Link
                                href="/company/apply"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-status-danger underline hover:text-status-danger"
                            >
                                Re-submit Application{' '}
                                <ArrowRight className="h-3.5 w-3.5"/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-status-warning/30 bg-status-warning-soft/80 p-5 shadow-sm">
            <div className="flex items-start gap-4">
                <div className="rounded-xl bg-status-warning-soft p-2.5 text-status-warning">
                    <Clock className="h-6 w-6"/>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-status-warning">
                        Verification Under Review
                    </h3>
                    <p className="mt-1 text-xs text-status-warning">
                        Our administrative team is currently reviewing your
                        company legal documents. Job postings will be unlocked
                        once approved.
                    </p>
                </div>
            </div>
        </div>
    );
}
