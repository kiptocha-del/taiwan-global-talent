import { Link } from '@inertiajs/react';
import { MapPin, Briefcase, DollarSign, Eye, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

export interface JobData {
    id: number;
    title: string;
    company_name?: string;
    company_logo?: string;
    type: string;
    location_type: string;
    city?: string;
    salary_range?: string;
    status?: string;
    applicants_count?: number;
    views_count?: number;
    created_at?: string;
}

interface JobCardProps {
    job: JobData;
    detailUrl: string;
    showCompany?: boolean;
    actions?: React.ReactNode;
}

export default function JobCard({
    job,
    detailUrl,
    showCompany = true,
    actions,
}: JobCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-accent/30 hover:shadow-md">
            <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {showCompany && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-muted font-bold text-muted">
                                {job.company_logo ? (
                                    <img
                                        src={job.company_logo}
                                        alt={job.company_name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    job.company_name?.charAt(0) || 'C'
                                )}
                            </div>
                        )}
                        <div>
                            <Link
                                href={detailUrl}
                                className="line-clamp-1 font-semibold text-ink transition-colors hover:text-accent"
                            >
                                {job.title}
                            </Link>
                            {showCompany && job.company_name && (
                                <p className="text-xs text-muted">
                                    {job.company_name}
                                </p>
                            )}
                        </div>
                    </div>
                    {job.status && <StatusBadge status={job.status} />}
                </div>

                {/* Badges Info */}
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-canvas px-2.5 py-1">
                        <Briefcase className="h-3.5 w-3.5 text-muted"/>{''}
                        {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-canvas px-2.5 py-1">
                        <MapPin className="h-3.5 w-3.5 text-muted"/>{''}
                        {job.location_type} {job.city ? `(${job.city})` : ''}
                    </span>
                    {job.salary_range && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-status-positive/30 bg-status-positive-soft px-2.5 py-1 text-status-positive">
                            <DollarSign className="h-3.5 w-3.5"/>{''}
                            {job.salary_range}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer Stats & Actions */}
            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                <div className="flex items-center gap-4">
                    {job.applicants_count !== undefined && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5"/>{''}
                            {job.applicants_count} Applicants
                        </span>
                    )}
                    {job.views_count !== undefined && (
                        <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5"/> {job.views_count}{''}
                            Viewer
                        </span>
                    )}
                </div>

                {actions ? (
                    actions
                ) : (
                    <Link
                        href={detailUrl}
                        className="font-medium text-accent hover:underline"
                    >
                        View Detail &rarr;
                    </Link>
                )}
            </div>
        </div>
    );
}
