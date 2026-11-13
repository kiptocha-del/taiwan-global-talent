import { Briefcase, Users, Eye, CheckCircle } from 'lucide-react';

export default function CompanyMetrics() {
    // Placeholder metrics (to be replaced with real backend data)
    const stats = [
        {
            title: 'Active Job Openings',
            value: '0',
            change: 'Ready to post',
            icon: Briefcase,
            color: 'text-accent bg-accent-soft ',
        },
        {
            title: 'Total Applicants',
            value: '0',
            change: '0 this week',
            icon: Users,
            color: 'text-status-positive bg-status-positive-soft ',
        },
        {
            title: 'Profile Views',
            value: '124',
            change: '+12% vs last month',
            icon: Eye,
            color: 'text-accent bg-accent-soft ',
        },
        {
            title: 'Hired Candidates',
            value: '0',
            change: '0 fulfilled',
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
