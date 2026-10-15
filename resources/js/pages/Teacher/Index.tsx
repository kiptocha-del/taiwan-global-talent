import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

export default function Index({ teacher, stats, recentModules = [] }: any) {
    return (
        <>
            <Head title="Teacher Dashboard" />
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                            <p className="text-xs font-semibold text-gray-500">Total Courses</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total_courses}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                            <p className="text-xs font-semibold text-gray-500">Your Modules</p>
                            <p className="mt-2 text-2xl font-bold text-indigo-600">{stats.total_modules}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                            <p className="text-xs font-semibold text-gray-500">Published Modules</p>
                            <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.published_modules}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                            <p className="text-xs font-semibold text-gray-500">Total Lessons</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total_lessons}</p>
                        </div>
                    </div>

                    {/* Recent Modules */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">Recent Modules</h2>
                            <Link href="/teacher/modules/create" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">
                                <Plus className="h-4 w-4" /> Create Module
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentModules.map((module: any) => (
                                <div key={module.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50">
                                    <div>
                                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 uppercase">{module.category?.name}</span>
                                        <h3 className="mt-1 text-sm font-bold text-gray-900">{module.title}</h3>
                                    </div>
                                    <Link href={`/teacher/modules/${module.id}`} className="text-xs font-bold text-indigo-600 hover:underline">
                                        View Details →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}