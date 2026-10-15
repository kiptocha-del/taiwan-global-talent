import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Clock,
    User,
    DollarSign,
    Layers,
    Plus,
    ChevronRight,
    Edit3,
} from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

interface Module {
    id: number;
    title: string;
    description?: string | null;
    level?: string | null;
    lessons_count?: number;
    status: 'draft' | 'published' | 'archived';
}

interface CourseCategoryDetail {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    instructor?: string | null;
    duration?: string | null;
    price?: number | null;
    thumbnail_url?: string | null;
    modules?: Module[];
}

interface ShowProps {
    course: CourseCategoryDetail;
    teacher?: any;
}

export default function Show({ course, teacher }: ShowProps) {
    const modules = course.modules || [];

    return (
        <>
            <Head title={`Course - ${course.name}`} />
            <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 antialiased">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                    {/* Back Button */}
                    <div>
                        <Link
                            href="/teacher/courses"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Master Courses
                        </Link>
                    </div>

                    {/* Master Course Overview Card / Hero */}
                    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xs">
                        <div className="grid grid-cols-1 lg:grid-cols-3">
                            {/* Course Thumbnail */}
                            <div className="relative h-56 lg:h-auto bg-gray-100">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-400">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Course Metadata */}
                            <div className="p-6 sm:p-8 lg:col-span-2 flex flex-col justify-between space-y-6">
                                <div>
                                    <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                        Master Course
                                    </span>
                                    <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
                                        {course.name}
                                    </h1>
                                    <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed">
                                        {course.description || 'No description provided for this master course.'}
                                    </p>
                                </div>

                                {/* Info Pill Badges */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-100 pt-6 text-xs text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-gray-50 text-indigo-600">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-medium">Instructor</p>
                                            <p className="font-bold text-gray-800 truncate">{course.instructor || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-gray-50 text-indigo-600">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-medium">Duration</p>
                                            <p className="font-bold text-gray-800">{course.duration || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-gray-50 text-indigo-600">
                                            <DollarSign className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-medium">Price</p>
                                            <p className="font-bold text-gray-800">
                                                {course.price ? `NT$ ${course.price}` : 'Free'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-gray-50 text-indigo-600">
                                            <Layers className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-medium">Modules</p>
                                            <p className="font-bold text-gray-800">{modules.length} Modules</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modules Section */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Learning Modules under this Course
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Manage modules and their lessons assigned to this course.
                                </p>
                            </div>

                            <Link
                                href={`/teacher/modules/create?category_id=${course.id}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4" /> Add Module
                            </Link>
                        </div>

                        {/* List of Modules */}
                        {modules.length === 0 ? (
                            <div className="rounded-2xl border-2 border-dashed border-gray-100 py-12 text-center">
                                <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                <h3 className="text-sm font-bold text-gray-800">No Modules Created Yet</h3>
                                <p className="mt-1 text-xs text-gray-400">
                                    Click 'Add Module' to create the first module under this course.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {modules.map((module, idx) => (
                                    <div
                                        key={module.id}
                                        className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50/80"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-bold text-gray-900">
                                                        {module.title}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                                                            module.status === 'published'
                                                                ? 'bg-emerald-50 text-emerald-600'
                                                                : 'bg-amber-50 text-amber-600'
                                                        }`}
                                                    >
                                                        {module.status}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
                                                    {module.description || 'No description.'} • {module.lessons_count ?? 0} Lessons
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/teacher/modules/${module.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-indigo-600 transition"
                                                title="Edit Module Settings"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/teacher/modules/${module.id}`}
                                                className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
                                            >
                                                Manage Lessons <ChevronRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}