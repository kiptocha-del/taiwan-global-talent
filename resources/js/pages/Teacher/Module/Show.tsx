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
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar />
                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        href="/teacher/modules"
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Modules
                    </Link>

                    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 uppercase">
                            {module.category?.name}
                        </span>
                        <h1 className="mt-2 text-xl font-bold text-gray-900">
                            {module.title}
                        </h1>
                        <p className="mt-1 text-xs text-gray-500">
                            {module.description}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">
                                Lessons Curriculum
                            </h2>
                            <Link
                                href={`/teacher/modules/${module.id}/lessons/create`}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4" /> Add Lesson
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {module.lessons?.map((lesson: any, idx: number) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-800">
                                                {lesson.title}
                                            </h4>
                                            <span className="text-[10px] text-gray-400 capitalize">
                                                {lesson.content_type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/teacher/lessons/${lesson.id}/edit`}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDeleteLesson(lesson.id)
                                            }
                                            className="p-1.5 text-gray-500 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
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
