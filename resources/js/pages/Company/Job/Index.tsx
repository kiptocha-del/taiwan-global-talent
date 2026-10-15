import { Head, Link, router } from '@inertiajs/react';
import { Plus, Briefcase } from 'lucide-react';
import { useState } from 'react';
import CompanyNavbar from '@/components/Company/CompanyNavbar';
import ConfirmationModal from '@/components/UI/ConfirmationModal';
import EmptyState from '@/components/UI/EmptyState';
import JobCard from '@/components/UI/JobCard';
import PageHeader from '@/components/UI/PageHeader';
// import PaginationNav from '@/components/UI/PaginationNav';
import SearchAndFilterBar from '@/components/UI/SearchAndFilterBar';

interface Job {
    id: number;
    title: string;
    type: string;
    location_type: string;
    city?: string;
    salary_range?: string;
    status: string;
    applicants_count?: number;
    links?: string;
    views_count?: number;
    created_at?: string;
}

interface PageProps {
    company: any;
    jobs: Job[];
}

export default function JobIndex({ company, jobs }: PageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    console.log(company)
    console.log(jobs)

    const filteredJobs = jobs?.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? job.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    }) || [];

    const handleDeleteClick = (jobId: number) => {
        setSelectedJobId(jobId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedJobId) {
            return;
        }
        
        setIsDeleting(true);

        router.delete(`/company/jobs/${selectedJobId}`, {
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedJobId(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Head title="Control Panel - Job" />
            <CompanyNavbar company={company} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Reusable Header */}
                <PageHeader
                    title="Job"
                    subtitle="Manage and monitor all job openings published by your company"
                    actionButton={
                        <Link
                            href="/company/jobs/create"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Create a New Job
                        </Link>
                    }
                />

                {/* Reusable Search & Filter Bar */}
                <SearchAndFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    filterValue={statusFilter}
                    onFilterChange={setStatusFilter}
                    searchPlaceholder="Search by job title..."
                    filterPlaceholder="All Status"
                    filterOptions={[
                        { label: 'Published (Active)', value: 'published' },
                        { label: 'Draft', value: 'draft' },
                        { label: 'Closed', value: 'closed' },
                    ]}
                />

                {/* Grid List Lowongan */}
                {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                showCompany={false}
                                detailUrl={`/company/jobs/${job.id}`}
                                actions={
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/company/jobs/${job.id}/edit`}
                                            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(job.id)}
                                            className="px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    /* Reusable Empty State */
                    <EmptyState
                        icon={Briefcase}
                        title="Job Not Found"
                        description="There are no job openings that match your search keywords or filters."
                        action={
                            <Link
                                href="/company/jobs/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" /> Create New Job
                            </Link>
                        }
                    />
                )}

                {/* Reusable Pagination */}
                {/* {jobs.links && <PaginationNav links={jobs.links} />} */}

                {/* Reusable Confirmation Modal */}
                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Job Vacancy"
                    message="Are you sure you want to delete this job opening? All applicant data for this job will be affected."
                    confirmText="Yes, Delete"
                    cancelText="Cancel"
                    isDanger={true}
                    isLoading={isDeleting}
                />
            </main>
        </div>
    );
}