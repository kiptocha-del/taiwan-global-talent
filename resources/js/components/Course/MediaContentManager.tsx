import { Music, FileText, FileDown } from 'lucide-react';
import React from 'react';

interface MediaContentProps {
    lesson: any;
    getYouTubeEmbedUrl: (url: string) => string | null;
}

export default function MediaContentManager({
    lesson,
    getYouTubeEmbedUrl,
}: MediaContentProps) {
    if (!lesson) {
        return null;
    }

    switch (lesson.content_type) {
        case 'video': {
            const embedUrl = getYouTubeEmbedUrl(lesson.video_url);

            return (
                <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-ink shadow-xs">
                    {embedUrl ? (
                        <iframe
                            className="h-full w-full"
                            src={embedUrl}
                            title={lesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : lesson.video_path ? (
                        <video
                            className="h-full w-full"
                            controls
                            src={`/storage/${lesson.video_path}`}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted">
                            Media Video Tidak Ditemukan
                        </div>
                    )}
                </div>
            );
        }

        case 'audio': {
            if (!lesson.audios || lesson.audios.length === 0) {
                return null;
            }
            
            return (
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-ink uppercase">
                        <Music size={15} className="text-accent"/> Audio
                        Lessons ({lesson.audios.length})
                    </div>
                    <div className="divide-y divide-border">
                        {lesson.audios.map((audio: any, index: number) => {
                            return (
                                <div
                                    key={audio.id}
                                    className="space-y-2 py-3.5 first:pt-1 last:pb-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-accent uppercase">
                                            Track {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-ink">
                                        {audio.lesson_audio_description ||
                                            'Audio Track'}
                                    </p>

                                    {/* 🌟 TAMPILAN TERJEMAHAN AUDIO LESSON 🌟 */}
                                    {audio.translation && (
                                        <div className="rounded-xl border border-accent/30 bg-accent-soft/60 p-2.5 text-xs text-ink italic">
                                            <span className="font-bold text-accent not-italic">
                                                Translation:{' '}
                                            </span>
                                            {audio.translation}
                                        </div>
                                    )}

                                    <audio
                                        className="custom-audio-player mt-2 h-8 w-full"
                                        controls
                                        src={audio.lesson_audio_url}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        case 'pdf': {
            // 🌟 FIX: Menggunakan kurung kurawal curly braces pada statement IF
            if (!lesson.pdf_path) {
                return null;
            }

            return (
                <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-status-danger-soft p-3 text-status-danger">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-ink">
                                Attachment Material File (PDF)
                            </h4>
                            <p className="text-xs text-muted">
                                Unduh dokumen materi pendukung modul ini
                            </p>
                        </div>
                    </div>
                    <a
                        href={`/storage/${lesson.pdf_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-brand-strong px-4 py-2 text-xs font-bold text-on-brand transition-colors hover:bg-brand-strong"
                    >
                        <FileDown size={14} /> Open PDF
                    </a>
                </div>
            );
        }

        default:
            return null;
    }
}
