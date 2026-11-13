import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

export default function Index({ teacher, stats, recentModules = [] }: any) {
    return (
        <>
            <Head title="Teacher Dashboard" />
            <div className="min-h-screen bg-canvas">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
                            <p className="text-xs font-semibold text-muted">Total Courses</p>
                            <p className="mt-2 text-2xl font-bold text-ink">{stats.total_courses}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
                            <p className="text-xs font-semibold text-muted">Your Modules</p>
                            <p className="mt-2 text-2xl font-bold text-accent">{stats.total_modules}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
                            <p className="text-xs font-semibold text-muted">Published Modules</p>
                            <p className="mt-2 text-2xl font-bold text-status-positive">{stats.published_modules}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
                            <p className="text-xs font-semibold text-muted">Total Lessons</p>
                            <p className="mt-2 text-2xl font-bold text-ink">{stats.total_lessons}</p>
                        </div>
                    </div>

                    {/* Recent Modules */}
                    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-base font-bold text-ink">Recent Modules</h2>
                            <Link href="/teacher/modules/create"className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-on-brand hover:bg-accent/90">
                                <Plus className="h-4 w-4"/> Create Module
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentModules.map((module: any) => (
                                <div key={module.id} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-canvas">
                                    <div>
                                        <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent uppercase">{module.category?.name}</span>
                                        <h3 className="mt-1 text-sm font-bold text-ink">{module.title}</h3>
                                    </div>
                                    <Link href={`/teacher/modules/${module.id}`} className="text-xs font-bold text-accent hover:underline">
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