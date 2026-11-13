import { Head, router } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { useState } from 'react';
import CompanyNavbar from '@/components/Company/CompanyNavbar';
import type { ApplicantData } from '@/components/UI/ApplicantCard';
import ApplicantCard from '@/components/UI/ApplicantCard';
import EmptyState from '@/components/UI/EmptyState';
import PageHeader from '@/components/UI/PageHeader';
// import PaginationNav from '@/components/UI/PaginationNav';
import SearchAndFilterBar from '@/components/UI/SearchAndFilterBar';

interface PageProps {
    company: any;
    applicants: ApplicantData[];
}

export default function ApplicantIndex({ company, applicants }: PageProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    console.log(applicants);
    const filteredApplicants =
        applicants?.filter((applicant) => {
            const matchesSearch =
                applicant.candidate_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                applicant.candidate_email
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (applicant.job_title &&
                    applicant.job_title
                        .toLowerCase()
                        .includes(search.toLowerCase()));
            const matchesStatus = statusFilter
                ? applicant.status === statusFilter
                : true;

            return matchesSearch && matchesStatus;
        }) || [];

    const handleStatusUpdate = (applicantId: number, newStatus: string) => {
        router.patch(
            `/company/applicants/${applicantId}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="min-h-screen bg-canvas">
            <Head title="Control Applicant" />
            <CompanyNavbar company={company} />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    title="All Applicant"
                    subtitle="Review resume, update interview status, and manage job applicants"
                />

                <SearchAndFilterBar
                    search={search}
                    onSearchChange={setSearch}
                    filterValue={statusFilter}
                    onFilterChange={setStatusFilter}
                    searchPlaceholder="Find applicant by name, email, or position..."
                    filterPlaceholder="All Status"
                    filterOptions={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Reviewed', value: 'reviewed' },
                        { label: 'Interviewed', value: 'interviewed' },
                        { label: 'Hired', value: 'hired' },
                        { label: 'Rejected', value: 'rejected' },
                    ]}
                />

                {filteredApplicants.length > 0 ? (
                    <div className="space-y-4">
                        {filteredApplicants.map((applicant) => (
                            <ApplicantCard
                                key={applicant.id}
                                applicant={applicant}
                                onStatusChange={(status) =>
                                    handleStatusUpdate(applicant.id, status)
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Users}
                        title="No Applicant Found"
                        description="There are no applicants that match your search keywords or filters."
                    />
                )}
                {/* {applicants?.links && (
                    <PaginationNav links={applicants.links} />
                )} */}
            </main>
        </div>
    );
}
