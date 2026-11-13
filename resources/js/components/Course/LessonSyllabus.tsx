import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface LessonSyllabusProps {
    lessons: any[];
    activeLessonId: number | null;
    completedLessonIds?: number[];
    onSelectLesson: (lesson: any) => void;
}

export default function LessonSyllabus({
    lessons = [],
    activeLessonId,
    completedLessonIds = [],
    onSelectLesson,
}: LessonSyllabusProps) {
    return (
        <div className="sticky top-28 space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-xs">
            <h3 className="px-1 text-xs font-bold tracking-wider text-muted uppercase">
                📚 Course Syllabus
            </h3>
            <div className="space-y-1">
                {lessons.map((lesson: any, idx: number) => (
                    <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                            activeLessonId === lesson.id
                                ? 'bg-accent font-medium text-on-brand shadow-sm'
                                : 'text-muted hover:bg-canvas'
                        }`}
                    >
                        <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                activeLessonId === lesson.id
                                    ? 'bg-accent text-on-brand'
                                    : 'bg-surface-muted text-muted'
                            }`}
                        >
                            {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1 truncate text-sm font-bold">
                            {lesson.title}
                        </div>
                        {completedLessonIds.includes(lesson.id) && (
                            <CheckCircle2
                                className={`size-4 shrink-0 ${
                                    activeLessonId === lesson.id
                                        ? 'text-on-brand'
                                        : 'text-status-positive'
                                }`}
                                aria-label="Completed"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
