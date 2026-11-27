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
            <div className="min-h-screen bg-canvas">
                <TeacherNavbar />
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-ink">
                                Your Learning Modules
                            </h1>
                            <p className="text-xs text-muted">
                                Modules you have authored under Master Courses
                            </p>
                        </div>
                        <Link
                            href="/teacher/modules/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-on-brand transition hover:bg-accent/90"
                        >
                            <Plus className="h-4 w-4"/> Create New Module
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {modules.map((module: any) => (
                            <div
                                key={module.id}
                                className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs"
                            >
                                <div>
                                    <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent uppercase">
                                        {module.category?.name}
                                    </span>
                                    <h3 className="mt-1 text-base font-bold text-ink">
                                        {module.title}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-muted">
                                        {module.lessons_count} Lessons
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/teacher/modules/${module.id}`}
                                        className="rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-bold text-muted hover:bg-surface-muted"
                                    >
                                        View Lessons
                                    </Link>
                                    <Link
                                        href={`/teacher/modules/${module.id}/edit`}
                                        className="p-2 text-muted hover:text-accent"
                                    >
                                        <Edit3 className="h-4 w-4"/>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(module.id)}
                                        className="p-2 text-muted hover:text-status-danger"
                                    >
                                        <Trash2 className="h-4 w-4"/>
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
