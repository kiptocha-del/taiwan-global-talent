import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

interface ApplyFormState {
    full_name: string;
    phone: string;
    expertise: string;
    learning_goal: string;
    bio: string;
    cv: File | null;
    certificate: File | null;
}

export default function Apply() {
    const { data, setData, post, processing, errors, reset } =
        useForm<ApplyFormState>({
            full_name: '',
            phone: '',
            expertise: '',
            learning_goal: '',
            bio: '',
            cv: null,
            certificate: null,
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('teacher.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="min-h-screen bg-surface-muted px-4 py-12 sm:px-6 lg:px-8">
            <Head title="Teacher Application Form" />

            <div className="mx-auto max-w-2xl rounded-xl bg-surface p-8 shadow-md">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-ink">
                        Teacher Application Form
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Please fill out the form below according to your profile
                        schema.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-muted">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={data.full_name}
                            onChange={(e) =>
                                setData('full_name', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-border p-2 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            placeholder="Your full name"
                        />
                        {errors.full_name && (
                            <p className="mt-1 text-sm text-status-danger">
                                {errors.full_name}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-muted">
                            Phone Number (WhatsApp)
                        </label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-border p-2 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            placeholder="(+886) 81234567xxx"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-status-danger">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    {/* Expertise */}
                    <div>
                        <label className="block text-sm font-medium text-muted">
                            Expertise
                        </label>
                        <input
                            type="text"
                            value={data.expertise}
                            onChange={(e) =>
                                setData('expertise', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-border p-2 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            placeholder="e.g. Mathematics, English, Web Development"
                        />
                        {errors.expertise && (
                            <p className="mt-1 text-sm text-status-danger">
                                {errors.expertise}
                            </p>
                        )}
                    </div>

                    {/* Learning Goal */}
                    <div>
                        <label className="block text-sm font-medium text-muted">
                            Teaching Goal
                        </label>
                        <input
                            type="text"
                            value={data.learning_goal}
                            onChange={(e) =>
                                setData('learning_goal', e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-border p-2 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            placeholder="e.g. Preparing students for IELTS, Basic Calculus"
                        />
                        {errors.learning_goal && (
                            <p className="mt-1 text-sm text-status-danger">
                                {errors.learning_goal}
                            </p>
                        )}
                    </div>

                    {/* Bio / Experience */}
                    <div>
                        <label className="block text-sm font-medium text-muted">
                            About Me / Teaching Experience
                        </label>
                        <textarea
                            rows={4}
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            className="mt-1 block w-full rounded-md border border-border p-2 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            placeholder="Tell us briefly about your profile and teaching experience..."
                        />
                        {errors.bio && (
                            <p className="mt-1 text-sm text-status-danger">
                                {errors.bio}
                            </p>
                        )}
                    </div>

                    {/* Upload CV */}
                    <div>
                        <label className="block text-sm font-medium text-muted">
                            Upload CV (PDF)
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setData(
                                    'cv',
                                    e.target.files ? e.target.files[0] : null,
                                )
                            }
                            className="mt-1 block w-full text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-accent-soft"
                        />
                        {errors.cv && (
                            <p className="mt-1 text-sm text-status-danger">
                                {errors.cv}
                            </p>
                        )}
                    </div>

                    {/* Upload Certificate */}
                    <div>
                        <label className="block text-sm font-medium text-muted">
                            Certificate (Optional)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) =>
                                setData(
                                    'certificate',
                                    e.target.files ? e.target.files[0] : null,
                                )
                            }
                            className="mt-1 block w-full text-sm text-muted file:mr-4 file:rounded-md file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-accent-soft"
                        />
                        {errors.certificate && (
                            <p className="mt-1 text-sm text-status-danger">
                                {errors.certificate}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full justify-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-on-brand shadow-sm hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
