import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, HelpCircle } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

interface Category {
    id: number;
    name: string;
}

export default function Create({
    categories = [],
    selected_category_id = 1,
    teacher,
}: {
    categories: Category[];
    selected_category_id: number;
    teacher?: any;
}) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: selected_category_id,
        level: selected_category_id === 1 ? 'HSK 1' : 'General',
        description: '',
        google_slides_template_id: '',
        is_published: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/modules');
    };

    const isMandarin = Number(data.category_id) === 1;

    return (
        <>
            <Head title="Create Module" />
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-4xl px-4 py-8">
                    <Link
                        href="/teacher/modules"
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Modules
                    </Link>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
                        <h1 className="text-xl font-bold text-gray-900 mb-1">
                            Create Learning Module
                        </h1>
                        <p className="mb-8 text-xs text-gray-500">
                            Configure module details matching Filament Schema
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Module Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Chapter 1: Greetings & Basics"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>

                            {/* Category & Level */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Master Course Category
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => {
                                            const catId = Number(e.target.value);
                                            setData((prev) => ({
                                                ...prev,
                                                category_id: catId,
                                                level: catId === 1 ? 'HSK 1' : 'General',
                                            }));
                                        }}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        {isMandarin ? 'Mandarin Level (e.g. HSK 1)' : 'Course Level'}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.level}
                                        onChange={(e) => setData('level', e.target.value)}
                                        placeholder={isMandarin ? 'e.g. HSK 1, HSK 2' : 'e.g. Beginner, Intermediate'}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    />
                                    {errors.level && <p className="mt-1 text-xs text-red-500">{errors.level}</p>}
                                </div>
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
                                    placeholder="Provide a overview of what students will learn in this module..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                            </div>

                            {/* Google Slides Template ID */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Google Slides Template ID (For Certificate)
                                </label>
                                <input
                                    type="text"
                                    value={data.google_slides_template_id}
                                    onChange={(e) => setData('google_slides_template_id', e.target.value)}
                                    placeholder="1A2b3C4d5E6f7G8h9I0J..."
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                                <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                                    <HelpCircle className="h-3.5 w-3.5" /> ID dari URL: https://docs.google.com/presentation/d/<b>[TEMPLATE_ID]</b>/edit
                                </p>
                                {errors.google_slides_template_id && <p className="mt-1 text-xs text-red-500">{errors.google_slides_template_id}</p>}
                            </div>

                            {/* Toggle Publish */}
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="h-4 w-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="is_published" className="text-xs font-bold text-gray-700">
                                    Publish this module immediately
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <Link
                                    href="/teacher/modules"
                                    className="rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" /> Save Module
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}