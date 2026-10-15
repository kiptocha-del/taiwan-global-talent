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
                <div className="aspect-video overflow-hidden rounded-2xl border border-gray-100 bg-black shadow-xs">
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
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
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
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-900 uppercase">
                        <Music size={15} className="text-blue-600" /> Audio
                        Lessons ({lesson.audios.length})
                    </div>
                    <div className="divide-y divide-gray-100">
                        {lesson.audios.map((audio: any, index: number) => {
                            return (
                                <div
                                    key={audio.id}
                                    className="space-y-2 py-3.5 first:pt-1 last:pb-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-blue-600 uppercase">
                                            Track {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {audio.lesson_audio_description ||
                                            'Audio Track'}
                                    </p>

                                    {/* 🌟 TAMPILAN TERJEMAHAN AUDIO LESSON 🌟 */}
                                    {audio.translation && (
                                        <div className="rounded-xl border border-blue-100/80 bg-blue-50/60 p-2.5 text-xs text-blue-900 italic">
                                            <span className="font-bold text-blue-700 not-italic">
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
                <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-red-50 p-3 text-red-600">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">
                                Attachment Material File (PDF)
                            </h4>
                            <p className="text-xs text-gray-400">
                                Unduh dokumen materi pendukung modul ini
                            </p>
                        </div>
                    </div>
                    <a
                        href={`/storage/${lesson.pdf_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-gray-950 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-gray-800"
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
