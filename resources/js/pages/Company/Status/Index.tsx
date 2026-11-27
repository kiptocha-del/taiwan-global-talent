import { route } from 'ziggy-js';
import ApplicationStatus from '@/components/UI/ApplicationStatus';
import type { ApplicationStatusValue } from '@/components/UI/ApplicationStatus';

interface StatusProps {
    status: ApplicationStatusValue;
    rejectionReason: string | null;
    submittedAt: string | null;
}

export default function Status({
    status,
    rejectionReason,
    submittedAt,
}: StatusProps) {
    return (
        <ApplicationStatus
            applicantLabel="partner"
            status={status}
            rejectionReason={rejectionReason}
            submittedAt={submittedAt}
            reapplyHref={route('company.register')}
        />
    );
}
