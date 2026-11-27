import { Head, router } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import { useState } from 'react';
import EmptyState from '@/components/UI/EmptyState';
import JobCard from '@/components/UI/JobCard';
import PageHeader from '@/components/UI/PageHeader';
import PaginationNav from '@/components/UI/PaginationNav';
import SearchAndFilterBar from '@/components/UI/SearchAndFilterBar';
import Layout from '../Layout';

interface StudentJobIndexProps {
    jobs: {
        data: any[];
        links: any[];
    };
    filters: {
        search?: string;
        type?: string;
        location_type?: string;
    };
}

export default function StudentJobIndex({
    jobs,
    filters,
}: StudentJobIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');
    const [locationType, setLocationType] = useState(
        filters.location_type || '',
    );

    const handleSearchChange = (val: string) => {
        setSearch(val);
        router.get(
            '/student/jobs',
            { search: val, type, location_type: locationType },
            { preserveState: true, replace: true },
        );
    };

    const handleTypeChange = (val: string) => {
        setType(val);
        router.get(
            '/student/jobs',
            { search, type: val, location_type: locationType },
            { preserveState: true, replace: true },
        );
    };

    return (
        <Layout>
            <div className="min-h-screen bg-canvas text-ink">
                <Head title="Career Exploration & Job Openings" />

                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <PageHeader
                        title="Explore Job Opportunities"
                        subtitle="Find the best job openings and career paths from trusted partner companies"
                    />

                    <div className="mb-6 flex w-full flex-col items-center gap-3 sm:flex-row">
                        <div className="w-full flex-1">
                            <SearchAndFilterBar
                                search={search}
                                onSearchChange={handleSearchChange}
                                searchPlaceholder="Search position or keyword..."
                            />
                        </div>

                        <div className="w-full sm:w-48">
                            <select
                                value={type}
                                onChange={(e) =>
                                    handleTypeChange(e.target.value)
                                }
                                className="w-full cursor-pointer rounded-xl border border-border bg-surface px-3 py-2.5 text-xs focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                            >
                                <option value="">All Employment Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div className="w-full sm:w-48">
                            <select
                                value={locationType}
                                onChange={(e) => {
                                    setLocationType(e.target.value);
                                    router.get(
                                        '/student/jobs',
                                        {
                                            search,
                                            type,
                                            location_type: e.target.value,
                                        },
                                        { preserveState: true, replace: true },
                                    );
                                }}
                                className="w-full cursor-pointer rounded-xl border border-border bg-surface px-3 py-2.5 text-xs focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                            >
                                <option value="">All Work Systems</option>
                                <option value="On-site">On-site</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.data.length === 0 ? (
                            <EmptyState
                                icon={Briefcase}
                                title="No Job Openings Found"
                                description="There are currently no job positions matching your search terms or filter criteria."
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {jobs.data.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        job={{
                                            ...job,
                                            company_name:
                                                job.company_profile
                                                    ?.company_name ||
                                                'Partner Company',
                                            company_logo:
                                                job.company_profile?.logo_url,
                                        }}
                                        detailUrl={`/student/jobs/${job.slug || job.id}`}
                                        showCompany={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {jobs?.links && <PaginationNav links={jobs.links} />}
                </main>
            </div>
        </Layout>
    );
}
