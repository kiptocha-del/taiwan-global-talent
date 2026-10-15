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
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-4xl px-4 py-8">
                    <Link
                        href="/teacher/courses"
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-gray-800"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Master Courses
                    </Link>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
                        <h1 className="text-xl font-bold text-gray-900 mb-1">
                            Create Master Course
                        </h1>
                        <p className="mb-8 text-xs text-gray-500">
                            Create a new master course card to group your learning modules.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Course Name */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Course Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Master Mandarin Basic to Advance"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-hidden transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Instructor & Price */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Instructor Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.instructor}
                                        onChange={(e) => setData('instructor', e.target.value)}
                                        placeholder="e.g. Wang Laoshi"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-hidden transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    {errors.instructor && (
                                        <p className="mt-1 text-xs text-red-500">{errors.instructor}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Price (TWD)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-hidden transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                                    )}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    placeholder="e.g. 12 Weeks / 3 Months"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-hidden transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-xs text-red-500">{errors.duration}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Write a clear overview about this master course..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-hidden transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>

                            {/* Course Thumbnail */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Course Banner / Thumbnail
                                </label>
                                <div className="relative rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center transition hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData('thumbnail', e.target.files?.[0] || null)
                                        }
                                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                    />
                                    <ImageIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                    <p className="text-xs font-bold text-gray-700">
                                        {data.thumbnail
                                            ? data.thumbnail.name
                                            : 'Click to upload course banner'}
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-gray-400">
                                        PNG, JPG up to 2MB
                                    </p>
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <Link
                                    href="/teacher/courses"
                                    className="rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" /> Save Master Course
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}