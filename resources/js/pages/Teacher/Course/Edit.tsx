import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Video, Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';
import LessonManagerModal from '@/components/Teacher/LessonManagerModal';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';
import type { Course, Lesson, Teacher } from '@/types/teacher/type';

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function Edit({
    teacher,
    course,
    categories = [],
}: {
    teacher: Teacher;
    course: Course & { category_id?: number };
    categories?: Category[];
}) {
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        title: course.title,
        category_id: course.category_id || (categories[0]?.id ?? ''),
        description: course.description || '',
        price: course.price,
        status: course.status,
    });

    const handleCourseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/teacher/courses/${course.id}`);
    };

    const handleDeleteLesson = (lessonId: number) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            router.delete(`/teacher/lessons/${lessonId}`);
        }
    };

    return (
        <>
            <Head title={`Edit Course - ${course.title}`} />
            <div className="min-h-screen bg-canvas">
                <TeacherNavbar teacher={teacher} />

                <main className="max-w-6xl mx-auto px-4 py-8">
                    <Link
                        href="/teacher/dashboard"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink mb-6 transition"
                    >
                        <ArrowLeft className="w-4 h-4"/> Back to Dashboard
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Course Settings Form */}
                        <div className="lg:col-span-1 bg-surface p-6 rounded-2xl border border-border shadow-sm h-fit">
                            <h2 className="text-base font-bold text-ink mb-4">Course Settings</h2>
                            <form onSubmit={handleCourseSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase mb-1">Category</label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-accent outline-none"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase mb-1">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="w-full px-3 py-2 rounded-xl border border-border text-xs font-bold text-accent focus:ring-2 focus:ring-accent outline-none"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase mb-1">Price (TWD)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-accent outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent/90 text-on-brand text-xs font-bold rounded-xl transition"
                                >
                                    <Save className="w-4 h-4"/> Save Course Details
                                </button>
                            </form>
                        </div>

                        {/* Lessons List & CRUD Section */}
                        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-border shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-base font-bold text-ink">Course Lessons</h2>
                                    <p className="text-xs text-muted">Manage curriculum and video modules for this course.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedLesson(null);
                                        setIsLessonModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-accent hover:bg-accent/90 text-on-brand rounded-xl text-xs font-bold transition"
                                >
                                    <Plus className="w-4 h-4"/> Add Lesson
                                </button>
                            </div>

                            {/* Lessons Curriculum List */}
                            {course.lessons && course.lessons.length > 0 ? (
                                <div className="space-y-3">
                                    {course.lessons.map((lesson, idx) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-canvas transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-lg bg-surface-muted text-muted flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <div>
                                                    <h4 className="text-xs font-bold text-ink">{lesson.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] text-muted flex items-center gap-1">
                                                            <Video className="w-3 h-3 text-accent"/> Video URL Linked
                                                        </span>
                                                        {lesson.is_free_preview && (
                                                            <span className="text-[10px] font-bold text-status-positive bg-status-positive-soft px-2 py-0.5 rounded-md">
                                                                Free Preview
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLesson(lesson);
                                                        setIsLessonModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-muted hover:text-accent hover:bg-accent-soft rounded-lg transition"
                                                >
                                                    <Edit3 className="w-4 h-4"/>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLesson(lesson.id!)}
                                                    className="p-1.5 text-muted hover:text-status-danger hover:bg-status-danger-soft rounded-lg transition"
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                                    <Video className="w-10 h-10 text-muted mx-auto mb-2"/>
                                    <p className="text-xs font-bold text-muted">No lessons added yet</p>
                                    <p className="text-[11px] text-muted mt-0.5">Click'Add Lesson'to start building modules.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Modal CRUD Lesson */}
                {isLessonModalOpen && (
                    <LessonManagerModal
                        courseId={course.id}
                        lesson={selectedLesson}
                        onClose={() => setIsLessonModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
}