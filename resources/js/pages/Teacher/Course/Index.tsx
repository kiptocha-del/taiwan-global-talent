import { Head, Link } from '@inertiajs/react';
import { Layers, Plus } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

export default function Index({ courses = [] }: any) {
    return (
        <>
            <Head title="All Master Courses" />
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar />
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Title & Button Create */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Master Courses
                            </h1>
                            <p className="text-xs text-gray-500">
                                High-level course categories containing learning modules
                            </p>
                        </div>
                        <Link
                            href="/teacher/courses/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4" /> Create New Course
                        </Link>
                    </div>

                    {/* Master Course Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course: any) => (
                            <div
                                key={course.id}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition hover:shadow-sm"
                            >
                                <div className="h-40 bg-gray-100">
                                    {course.thumbnail_url ? (
                                        <img
                                            src={course.thumbnail_url}
                                            alt={course.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-gray-400 font-medium">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="text-base font-bold text-gray-900">
                                        {course.name}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                        {course.description || 'No description provided.'}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Layers className="h-3.5 w-3.5 text-indigo-500" />{' '}
                                            {course.modules_count ?? 0} Modules
                                        </span>
                                        <Link
                                            href={`/teacher/courses/${course.slug}`}
                                            className="font-bold text-indigo-600 hover:underline"
                                        >
                                            Manage Modules →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}