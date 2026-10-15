import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';
import CompanyNavbar from '@/components/Company/CompanyNavbar';
import InputText from '@/components/UI/InputText';
import PageHeader from '@/components/UI/PageHeader';
import SelectOption from '@/components/UI/SelectOption';
import TextArea from '@/components/UI/TextArea';

export default function CreateJob({ company }: { company: any }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'Full-time',
        location_type: 'On-site',
        city: '',
        salary_range: '',
        description: '',
        requirements: '',
        status: 'published',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/company/jobs');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Head title="Create New Job - Company Portal" />

            <CompanyNavbar company={company} />

            <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    title="Job"
                    subtitle="Manage and monitor all job openings published by your company"
                    backUrl="/company/jobs"
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-6 border-b border-slate-100 pb-4 dark:border-slate-800">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Create New Job
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Fill in the information for the job position you want to open.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <InputText
                            label="Job Title *"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Ex: Senior Full Stack Developer"
                            error={errors.title}
                        />

                        {/* Tipe Pekerjaan & Sistem Kerja */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SelectOption
                                label="Job Type"
                                value={data.type}
                                onChange={(value) => setData('type', value)}
                                options={[
                                    { value: 'Full-time', label: 'Full-time' },
                                    { value: 'Part-time', label: 'Part-time' },
                                    { value: 'Contract', label: 'Contract' },
                                    { value: 'Internship', label: 'Internship' },
                                ]}
                                error={errors.type}
                            />

                            <SelectOption
                                label="Work Location Type"
                                value={data.location_type}
                                onChange={(value) => setData('location_type', value)}
                                options={[
                                    { value: 'On-site', label: 'On-site' },
                                    { value: 'Remote', label: 'Remote' },
                                    { value: 'Hybrid', label: 'Hybrid' },
                                ]}
                                error={errors.location_type}
                            />
                        </div>

                        {/* Kota & Kisaran Gaji */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {data.location_type !== 'Remote' && (
                                <InputText
                                    label="City"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Contoh: Jakarta Selatan"
                                    error={errors.city}
                                />
                            )}

                            <InputText
                                label="Salary Range"
                                type="text"
                                value={data.salary_range}
                                onChange={(e) => setData('salary_range', e.target.value)}
                                placeholder="Ex: TWD 30.000 - 50.000"
                                error={errors.salary_range}
                            />
                        </div>

                        {/* Deskripsi Lowongan */}
                        <TextArea
                            label="Job Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={5}
                            placeholder="Describe the job in details..."
                            error={errors.description}
                        />

                        {/* Persyaratan */}
                        <TextArea
                            label="Requirement & Qualification"
                            rows={4}
                            value={data.requirements}
                            onChange={(e) => setData('requirements', e.target.value)}
                            placeholder="Write the requirements and qualification for the job..."
                            error={errors.requirements}
                        />

                        {/* Status Publikasi */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                Status Publikasi
                            </label>
                            <div className="mt-2 flex items-center gap-6">
                                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="published"
                                        checked={data.status === 'published'}
                                        onChange={() => setData('status', 'published')}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Publikasikan Langsung
                                </label>
                                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="draft"
                                        checked={data.status === 'draft'}
                                        onChange={() => setData('status', 'draft')}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Save Draft
                                </label>
                            </div>
                            {errors.status && (
                                <p className="mt-1 text-xs text-rose-500">{errors.status}</p>
                            )}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                            <Link
                                href="/company/jobs"
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Creating...' : 'Create Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}