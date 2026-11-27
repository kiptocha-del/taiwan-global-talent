import { FileText } from 'lucide-react';
import React from 'react';

interface ContentBlockProps {
    lesson: any;
    isMandarin: boolean;
}

export default function LessonContentBlock({ lesson, isMandarin }: ContentBlockProps) {
    if (!lesson || !lesson.content) {
        return null;
    }

    return (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <h3 className="flex items-center gap-2 text-xs font-bold text-ink uppercase">
                <FileText size={15} /> Lesson Content
            </h3>

            {isMandarin && lesson.sentence_hanzi && (
                <div className="mb-2 rounded-xl border border-status-warning/30 bg-status-warning-soft p-4">
                    <span className="mb-1 block text-[10px] font-bold text-status-warning uppercase">Target Sentence</span>
                    <h1 className="font-mono text-2xl font-bold text-ink">{lesson.sentence_hanzi}</h1>
                </div>
            )}

            <div
                className="prose prose-blue raw-html-content max-w-none text-sm whitespace-pre-line text-muted"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
            />
        </div>
    );
}