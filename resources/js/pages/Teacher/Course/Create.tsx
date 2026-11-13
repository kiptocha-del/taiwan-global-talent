import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

export default function Create({ teacher }: { teacher?: any }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        instructor: teacher?.name || '',
        duration: '',
        price: 0,
        thumbnail: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/courses');
    };

    return (
        <>
            <Head title="Create Master Course" />
            <div className="min-h-screen bg-canvas">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-4xl px-4 py-8">
                    <Link
                        href="/teacher/courses"
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-muted transition hover:text-ink"
                    >
                        <ArrowLeft className="h-4 w-4"/> Back to Master Courses
                    </Link>

                    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
                        <h1 className="text-xl font-bold text-ink mb-1">
                            Create Master Course
                        </h1>
                        <p className="mb-8 text-xs text-muted">
                            Create a new master course card to group your learning modules.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Course Name */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                    Course Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Master Mandarin Basic to Advance"
                                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-hidden transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-status-danger">{errors.name}</p>
                                )}
                            </div>

                            {/* Instructor & Price */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                        Instructor Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.instructor}
                                        onChange={(e) => setData('instructor', e.target.value)}
                                        placeholder="e.g. Wang Laoshi"
                                        className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-hidden transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                    />
                                    {errors.instructor && (
                                        <p className="mt-1 text-xs text-status-danger">{errors.instructor}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                        Price (TWD)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-hidden transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-xs text-status-danger">{errors.price}</p>
                                    )}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    placeholder="e.g. 12 Weeks / 3 Months"
                                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-hidden transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-xs text-status-danger">{errors.duration}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Write a clear overview about this master course..."
                                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-hidden transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                            </div>

                            {/* Course Thumbnail */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                                    Course Banner / Thumbnail
                                </label>
                                <div className="relative rounded-2xl border-2 border-dashed border-border p-6 text-center transition hover:bg-canvas cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData('thumbnail', e.target.files?.[0] || null)
                                        }
                                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                    />
                                    <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted"/>
                                    <p className="text-xs font-bold text-muted">
                                        {data.thumbnail
                                            ? data.thumbnail.name
                                            : 'Click to upload course banner'}
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-muted">
                                        PNG, JPG up to 2MB
                                    </p>
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="flex justify-end gap-3 border-t border-border pt-4">
                                <Link
                                    href="/teacher/courses"
                                    className="rounded-xl bg-surface-muted px-5 py-2.5 text-xs font-bold text-muted transition hover:bg-surface-muted"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-bold text-on-brand shadow-xs transition hover:bg-accent/90 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4"/> Save Master Course
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}