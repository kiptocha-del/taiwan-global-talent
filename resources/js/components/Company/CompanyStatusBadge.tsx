import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface CompanyStatusBadgeProps {
    status: 'approved' | 'rejected' | 'pending' | string;
}

export default function CompanyStatusBadge({ status }: CompanyStatusBadgeProps) {
    switch (status) {
        case 'approved':
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-status-positive-soft px-2.5 py-1 text-xs font-medium text-status-positive ring-1 ring-status-positive/20 ring-inset">
                    <CheckCircle2 className="h-3.5 w-3.5"/> Verified
                </span>
            );
        case 'rejected':
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-status-danger-soft px-2.5 py-1 text-xs font-medium text-status-danger ring-1 ring-status-danger/20 ring-inset">
                    <XCircle className="h-3.5 w-3.5"/> Rejected
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-status-warning-soft px-2.5 py-1 text-xs font-medium text-status-warning ring-1 ring-status-warning/20 ring-inset">
                    <Clock className="h-3.5 w-3.5"/> Pending Review
                </span>
            );
    }
}