import { Download, Mail, Phone, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

export interface ApplicantData {
    id: number;
    candidate_name: string;
    candidate_email: string;
    candidate_phone?: string;
    candidate_avatar?: string;
    applied_at: string;
    status: string;
    resume_url?: string;
    job_id?: string;
    job_title?: string;
}

interface ApplicantCardProps {
    applicant: ApplicantData;
    onStatusChange?: (newStatus: string) => void;
}

export default function ApplicantCard({
    applicant,
    onStatusChange,
}: ApplicantCardProps) {
    return (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-200 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700">
                    {applicant.candidate_avatar ? (
                        <img
                            src={applicant.candidate_avatar}
                            alt={applicant.candidate_name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        applicant.candidate_name.charAt(0)
                    )}
                </div>

                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                            {applicant.candidate_name}
                        </h4>
                        <StatusBadge status={applicant.status} />
                    </div>

                    {applicant.job_title && (
                        <p className="text-xs font-medium text-blue-600">
                            {applicant.job_title}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />{' '}
                            {applicant.candidate_email}
                        </span>
                        {applicant.candidate_phone && (
                            <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />{' '}
                                {applicant.candidate_phone}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />{' '}
                            {applicant.applied_at}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
                {applicant.resume_url && (
                    <a
                        href={applicant.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                        <Download className="h-3.5 w-3.5" /> Resume
                    </a>
                )}

                {onStatusChange && (
                    <select
                        value={applicant.status}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                    </select>
                )}
            </div>
        </div>
    );
}
