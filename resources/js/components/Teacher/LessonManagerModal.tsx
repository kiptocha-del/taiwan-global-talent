import { useForm } from '@inertiajs/react';
import { X, Save } from 'lucide-react';
import type { Lesson } from '@/types/teacher/type';

interface Props {
    courseId: number;
    lesson: Lesson | null;
    onClose: () => void;
}

export default function LessonManagerModal({ courseId, lesson, onClose }: Props) {
    const isEdit = !!lesson;

    const { data, setData, post, put, processing, errors } = useForm({
        module_id: courseId,
        title: lesson?.title || '',
        video_url: lesson?.video_url || '',
        content: lesson?.content || '',
        sort_order: lesson?.sort_order || 1,
        is_free_preview: lesson?.is_free_preview || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit) {
            put(`/teacher/lessons/${lesson.id}`, {
                onSuccess: () => onClose(),
            });
        } else {
            post('/teacher/lessons', {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl overflow-hidden transition-all">
                <div className="flex justify-between items-center px-6 py-4 border-b border-border">
                    <h3 className="font-bold text-ink text-sm">
                        {isEdit ? 'Edit Lesson Module' : 'Add New Lesson Module'}
                    </h3>
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="p-1 text-muted hover:text-muted rounded-lg"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">
                            Lesson Title
                        </label>
                        <input
                            type="text"
                            required
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Lesson 1: Introduction to Tones"
                            className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-accent outline-none"
                        />
                        {errors.title && (
                            <p className="mt-1 text-[11px] text-status-danger">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">
                            Video Stream URL
                        </label>
                        <input
                            type="url"
                            value={data.video_url}
                            onChange={(e) => setData('video_url', e.target.value)}
                            placeholder="https://youtube.com/embed/... or Vimeo Link"
                            className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-accent outline-none"
                        />
                        {errors.video_url && (
                            <p className="mt-1 text-[11px] text-status-danger">{errors.video_url}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-muted uppercase mb-1">
                            Content / Notes
                        </label>
                        <textarea
                            rows={3}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Lesson summary or downloadable resource links..."
                            className="w-full px-3 py-2 rounded-xl border border-border text-xs focus:ring-2 focus:ring-accent outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_free_preview"
                            checked={data.is_free_preview}
                            onChange={(e) => setData('is_free_preview', e.target.checked)}
                            className="rounded border-border text-accent focus:ring-accent cursor-pointer"
                        />
                        <label htmlFor="is_free_preview"className="text-xs font-semibold text-muted cursor-pointer">
                            Allow Free Preview for Non-enrolled Students
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-bold text-muted bg-surface-muted rounded-xl hover:bg-surface-muted transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 px-5 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-on-brand text-xs font-bold rounded-xl transition"
                        >
                            <Save className="w-4 h-4"/> {processing ?'Saving...':'Save Lesson'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}