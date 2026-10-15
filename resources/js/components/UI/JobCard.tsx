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
        <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
            <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {showCompany && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 font-bold text-gray-600">
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
                                className="line-clamp-1 font-semibold text-gray-900 transition-colors hover:text-blue-600"
                            >
                                {job.title}
                            </Link>
                            {showCompany && job.company_name && (
                                <p className="text-xs text-gray-500">
                                    {job.company_name}
                                </p>
                            )}
                        </div>
                    </div>
                    {job.status && <StatusBadge status={job.status} />}
                </div>

                {/* Badges Info */}
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1">
                        <Briefcase className="h-3.5 w-3.5 text-gray-400" />{' '}
                        {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1">
                        <MapPin className="h-3.5 w-3.5 text-gray-400" />{' '}
                        {job.location_type} {job.city ? `(${job.city})` : ''}
                    </span>
                    {job.salary_range && (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                            <DollarSign className="h-3.5 w-3.5" />{' '}
                            {job.salary_range}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer Stats & Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400">
                <div className="flex items-center gap-4">
                    {job.applicants_count !== undefined && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />{' '}
                            {job.applicants_count} Applicants
                        </span>
                    )}
                    {job.views_count !== undefined && (
                        <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> {job.views_count}{' '}
                            Viewer
                        </span>
                    )}
                </div>

                {actions ? (
                    actions
                ) : (
                    <Link
                        href={detailUrl}
                        className="font-medium text-blue-600 hover:underline"
                    >
                        View Detail &rarr;
                    </Link>
                )}
            </div>
        </div>
    );
}
