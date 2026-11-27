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
            <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                    {/* Back Button */}
                    <div>
                        <Link
                            href="/teacher/courses"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink transition"
                        >
                            <ArrowLeft className="h-4 w-4"/> Back to Master Courses
                        </Link>
                    </div>

                    {/* Master Course Overview Card / Hero */}
                    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xs">
                        <div className="grid grid-cols-1 lg:grid-cols-3">
                            {/* Course Thumbnail */}
                            <div className="relative h-56 lg:h-auto bg-surface-muted">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Course Metadata */}
                            <div className="p-6 sm:p-8 lg:col-span-2 flex flex-col justify-between space-y-6">
                                <div>
                                    <span className="inline-block rounded-md bg-accent-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                                        Master Course
                                    </span>
                                    <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-ink">
                                        {course.name}
                                    </h1>
                                    <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                                        {course.description || 'No description provided for this master course.'}
                                    </p>
                                </div>

                                {/* Info Pill Badges */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border pt-6 text-xs text-muted">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-canvas text-accent">
                                            <User className="h-4 w-4"/>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted font-medium">Instructor</p>
                                            <p className="font-bold text-ink truncate">{course.instructor ||'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-canvas text-accent">
                                            <Clock className="h-4 w-4"/>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted font-medium">Duration</p>
                                            <p className="font-bold text-ink">{course.duration ||'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-canvas text-accent">
                                            <DollarSign className="h-4 w-4"/>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted font-medium">Price</p>
                                            <p className="font-bold text-ink">
                                                {course.price ? `NT$ ${course.price}` : 'Free'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-canvas text-accent">
                                            <Layers className="h-4 w-4"/>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted font-medium">Modules</p>
                                            <p className="font-bold text-ink">{modules.length} Modules</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modules Section */}
                    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-ink">
                                    Learning Modules under this Course
                                </h2>
                                <p className="text-xs text-muted">
                                    Manage modules and their lessons assigned to this course.
                                </p>
                            </div>

                            <Link
                                href={`/teacher/modules/create?category_id=${course.id}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-on-brand shadow-xs transition hover:bg-accent/90"
                            >
                                <Plus className="h-4 w-4"/> Add Module
                            </Link>
                        </div>

                        {/* List of Modules */}
                        {modules.length === 0 ? (
                            <div className="rounded-2xl border-2 border-dashed border-border py-12 text-center">
                                <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted"/>
                                <h3 className="text-sm font-bold text-ink">No Modules Created Yet</h3>
                                <p className="mt-1 text-xs text-muted">
                                    Click 'Add Module' to create the first module under this course.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {modules.map((module, idx) => (
                                    <div
                                        key={module.id}
                                        className="flex items-center justify-between rounded-2xl border border-border p-4 transition hover:bg-canvas"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft font-bold text-accent text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-bold text-ink">
                                                        {module.title}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                                                            module.status === 'published'
                                                                ? 'bg-status-positive-soft text-status-positive'
                                                                : 'bg-status-warning-soft text-status-warning'
                                                        }`}
                                                    >
                                                        {module.status}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 text-xs text-muted line-clamp-1">
                                                    {module.description || 'No description.'} • {module.lessons_count ?? 0} Lessons
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/teacher/modules/${module.id}/edit`}
                                                className="p-2 text-muted hover:text-accent transition"
                                                title="Edit Module Settings"
                                            >
                                                <Edit3 className="h-4 w-4"/>
                                            </Link>
                                            <Link
                                                href={`/teacher/modules/${module.id}`}
                                                className="inline-flex items-center gap-1 rounded-xl bg-accent-soft px-3 py-2 text-xs font-bold text-accent hover:bg-accent-soft transition"
                                            >
                                                Manage Lessons <ChevronRight className="h-3.5 w-3.5"/>
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