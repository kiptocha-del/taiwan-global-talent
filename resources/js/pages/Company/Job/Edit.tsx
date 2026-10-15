import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';
import CompanyNavbar from '@/components/Company/CompanyNavbar';
import InputText from '@/components/UI/InputText';
import PageHeader from '@/components/UI/PageHeader';
import SelectOption from '@/components/UI/SelectOption';
import TextArea from '@/components/UI/TextArea';

export default function EditJob({ company, job }: { company: any; job: any }) {
    const { data, setData, put, processing, errors } = useForm({
        title: job.title || '',
        type: job.type || 'Full-time',
        location_type: job.location_type || 'On-site',
        city: job.city || '',
        salary_range: job.salary_range || '',
        description: job.description || '',
        requirements: job.requirements || '',
        status: job.status || 'published',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/company/jobs/${job.id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Head title={`Edit - ${job.title}`} />
            <CompanyNavbar company={company} />

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Reusable Header */}
                <PageHeader
                    title="Edit Job Opening"
                    subtitle="Update information and requirements for this position"
                    backUrl="/company/jobs"
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Position Title */}
                        <InputText
                            label="Position Title *"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Ex: Senior Software Engineer"
                            error={errors.title}
                        />

                        {/* Job Type & Work Location Type */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SelectOption
                                label="Job Type"
                                value={data.type}
                                onChange={(value) => setData('type', value)}
                                options={[
                                    { value: 'Full-time', label: 'Full-time' },
                                    { value: 'Part-time', label: 'Part-time' },
                                    { value: 'Contract', label: 'Contract' },
                                    {
                                        value: 'Internship',
                                        label: 'Internship',
                                    },
                                ]}
                                error={errors.type}
                            />

                            <SelectOption
                                label="Work Location Type"
                                value={data.location_type}
                                onChange={(value) =>
                                    setData('location_type', value)
                                }
                                options={[
                                    { value: 'On-site', label: 'On-site' },
                                    { value: 'Remote', label: 'Remote' },
                                    { value: 'Hybrid', label: 'Hybrid' },
                                ]}
                                error={errors.location_type}
                            />
                        </div>

                        {/* Location City & Salary Range */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {data.location_type !== 'Remote' && (
                                <InputText
                                    label="Location City"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    placeholder="Ex: Taipei City"
                                    error={errors.city}
                                />
                            )}

                            <InputText
                                label="Salary Range"
                                type="text"
                                value={data.salary_range}
                                onChange={(e) =>
                                    setData('salary_range', e.target.value)
                                }
                                placeholder="Ex: TWD 30,000 - 50,000"
                                error={errors.salary_range}
                            />
                        </div>

                        {/* Job Description */}
                        <TextArea
                            label="Job Description"
                            rows={5}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Describe the job duties and responsibilities..."
                            error={errors.description}
                        />

                        {/* Job Requirements */}
                        <TextArea
                            label="Requirements & Qualifications"
                            rows={4}
                            value={data.requirements}
                            onChange={(e) =>
                                setData('requirements', e.target.value)
                            }
                            placeholder="List necessary skills, qualifications, and experience..."
                            error={errors.requirements}
                        />

                        {/* Publication Status */}
                        <SelectOption
                            label="Publication Status"
                            value={data.status}
                            onChange={(value) => setData('status', value)}
                            options={[
                                { value: 'published', label: 'Published' },
                                { value: 'draft', label: 'Draft' },
                                { value: 'closed', label: 'Closed' },
                            ]}
                            error={errors.status}
                        />

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <Link
                                href="/company/jobs"
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing
                                    ? 'Updating...'
                                    : 'Update Job Opening'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
