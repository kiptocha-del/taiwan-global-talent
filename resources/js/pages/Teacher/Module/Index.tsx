import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

export default function Index({ modules = [] }: any) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this module?')) {
            router.delete(`/teacher/modules/${id}`);
        }
    };

    return (
        <>
            <Head title="Managed Modules" />
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar />
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Your Learning Modules
                            </h1>
                            <p className="text-xs text-gray-500">
                                Modules you have authored under Master Courses
                            </p>
                        </div>
                        <Link
                            href="/teacher/modules/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4" /> Create New Module
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {modules.map((module: any) => (
                            <div
                                key={module.id}
                                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs"
                            >
                                <div>
                                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 uppercase">
                                        {module.category?.name}
                                    </span>
                                    <h3 className="mt-1 text-base font-bold text-gray-900">
                                        {module.title}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        {module.lessons_count} Lessons
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/teacher/modules/${module.id}`}
                                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200"
                                    >
                                        View Lessons
                                    </Link>
                                    <Link
                                        href={`/teacher/modules/${module.id}/edit`}
                                        className="p-2 text-gray-500 hover:text-indigo-600"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(module.id)}
                                        className="p-2 text-gray-500 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
