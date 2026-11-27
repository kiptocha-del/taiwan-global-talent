import { Briefcase, Users, Eye, CheckCircle } from 'lucide-react';
import type { CompanyMetricsData } from '@/types/company/type';

export default function CompanyMetrics({
    metrics,
}: {
    metrics: CompanyMetricsData;
}) {
    const stats = [
        {
            title: 'Active Job Openings',
            value: metrics.active_jobs,
            change: 'Currently published',
            icon: Briefcase,
            color: 'text-accent bg-accent-soft ',
        },
        {
            title: 'Total Applicants',
            value: metrics.total_applicants,
            change: `${metrics.applicants_this_week} in the last 7 days`,
            icon: Users,
            color: 'text-status-positive bg-status-positive-soft ',
        },
        {
            title: 'Job Views',
            value: metrics.job_views,
            change: 'Across all your postings',
            icon: Eye,
            color: 'text-accent bg-accent-soft ',
        },
        {
            title: 'Hired Candidates',
            value: metrics.hired,
            change: 'Applications marked hired',
            icon: CheckCircle,
            color: 'text-accent bg-accent-soft ',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={idx}
                        className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted">
                                {stat.title}
                            </span>
                            <div className={`rounded-xl p-2.5 ${stat.color}`}>
                                <Icon className="h-5 w-5"/>
                            </div>
                        </div>
                        <div className="mt-3">
                            <h3 className="text-2xl font-bold text-ink">
                                {stat.value}
                            </h3>
                            <p className="mt-1 text-[11px] font-medium text-muted">
                                {stat.change}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
