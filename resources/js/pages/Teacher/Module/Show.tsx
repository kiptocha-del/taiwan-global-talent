import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Edit3 } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

export default function Show({ module }: any) {
    const handleDeleteLesson = (lessonId: number) => {
        if (confirm('Delete this lesson?')) {
            router.delete(`/teacher/lessons/${lessonId}`);
        }
    };

    return (
        <>
            <Head title={`Module - ${module.title}`} />
            <div className="min-h-screen bg-canvas">
                <TeacherNavbar />
                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        href="/teacher/modules"
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink"
                    >
                        <ArrowLeft className="h-4 w-4"/> Back to Modules
                    </Link>

                    <div className="mb-6 rounded-2xl border border-border bg-surface p-6 shadow-xs">
                        <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent uppercase">
                            {module.category?.name}
                        </span>
                        <h1 className="mt-2 text-xl font-bold text-ink">
                            {module.title}
                        </h1>
                        <p className="mt-1 text-xs text-muted">
                            {module.description}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-base font-bold text-ink">
                                Lessons Curriculum
                            </h2>
                            <Link
                                href={`/teacher/modules/${module.id}/lessons/create`}
                                className="inline-flex items-center gap-2 rounded-xl bg-accent px-3.5 py-2 text-xs font-bold text-on-brand hover:bg-accent/90"
                            >
                                <Plus className="h-4 w-4"/> Add Lesson
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {module.lessons?.map((lesson: any, idx: number) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center justify-between rounded-xl border border-border p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold text-muted">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-xs font-bold text-ink">
                                                {lesson.title}
                                            </h4>
                                            <span className="text-[10px] text-muted capitalize">
                                                {lesson.content_type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/teacher/lessons/${lesson.id}/edit`}
                                            className="p-1.5 text-muted hover:text-accent"
                                        >
                                            <Edit3 className="h-4 w-4"/>
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDeleteLesson(lesson.id)
                                            }
                                            className="p-1.5 text-muted hover:text-status-danger"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
