import { Head, useForm, usePage } from '@inertiajs/react';
import { Building2, MapPin, CheckCircle2, Send } from 'lucide-react';
import React from 'react';
import Button from '@/components/UI/Button';
import FileUploadDropzone from '@/components/UI/FileUploadDropzone';
import InputText from '@/components/UI/InputText';
import PageHeader from '@/components/UI/PageHeader';
import TextArea from '@/components/UI/TextArea';
import Layout from '../Layout';

export default function StudentJobShow({ job, hasApplied, application }: any) {
    const { auth }: any = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        candidate_name: auth?.user?.name || '',
        candidate_email: auth?.user?.email || '',
        candidate_phone: '',
        resume: null as File | null,
        cover_letter: '',
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/student/jobs/${job.id}/apply`, {
            forceFormData: true,
        });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <Head
                    title={`${job.title} - ${job.company_profile?.company_name}`}
                />

                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <PageHeader
                        title={job.title}
                        subtitle={
                            job.company_profile?.company_name ||
                            'Partner Company'
                        }
                        backUrl="/student/jobs"
                    />

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                <Building2 className="h-4 w-4" />
                                {job.company_profile?.company_name}
                            </div>

                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {job.title}
                            </h1>

                            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold dark:bg-slate-800">
                                    {job.type}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />{' '}
                                    {job.location_type}{' '}
                                    {job.city ? `(${job.city})` : ''}
                                </span>
                                {job.salary_range && (
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {job.salary_range}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            {job.description && (
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Job Description
                                    </h2>
                                    <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                                        {job.description}
                                    </p>
                                </div>
                            )}

                            {job.requirements && (
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Requirements
                                    </h2>
                                    <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                                        {job.requirements}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            {hasApplied ? (
                                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                                    <div>
                                        <h4 className="text-xs font-bold">
                                            You Have Applied for This Position
                                        </h4>
                                        <p className="text-[11px] opacity-80">
                                            Application Status:{' '}
                                            <span className="font-semibold capitalize">
                                                {application?.status}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleApply}
                                    className="space-y-4"
                                >
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Submit Job Application
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <InputText
                                            label="Full Name *"
                                            required
                                            value={data.candidate_name}
                                            onChange={(e) =>
                                                setData(
                                                    'candidate_name',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.candidate_name}
                                        />

                                        <InputText
                                            label="Email Address *"
                                            type="email"
                                            required
                                            value={data.candidate_email}
                                            onChange={(e) =>
                                                setData(
                                                    'candidate_email',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.candidate_email}
                                        />
                                    </div>

                                    <InputText
                                        label="Phone Number / WhatsApp"
                                        value={data.candidate_phone}
                                        onChange={(e) =>
                                            setData(
                                                'candidate_phone',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="+886 912 345 678"
                                        error={errors.candidate_phone}
                                    />

                                    <FileUploadDropzone
                                        label="Upload Resume / CV (PDF, Max 5MB) *"
                                        value={data.resume}
                                        onChange={(file) =>
                                            setData('resume', file)
                                        }
                                        accept=".pdf"
                                        maxSizeMB={5}
                                        error={errors.resume}
                                    />

                                    <TextArea
                                        label="Cover Letter (Optional)"
                                        rows={3}
                                        value={data.cover_letter}
                                        onChange={(e) =>
                                            setData(
                                                'cover_letter',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Briefly explain why you are a great fit for this position..."
                                        error={errors.cover_letter}
                                    />

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            icon={Send}
                                            isLoading={processing}
                                        >
                                            Submit Application Now
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </Layout>
    );
}
