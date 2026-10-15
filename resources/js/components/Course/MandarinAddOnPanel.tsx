import { Volume2, Image as ImageIcon, X } from 'lucide-react';
import React, { useState } from 'react';

export interface Vocabulary {
    id: number;
    hanzi: string;
    pinyin: string;
    meaning: string;
    audio_url?: string;
    image_url?: string;
    lesson_id?: number;
}

export interface MandarinAddOnPanelProps {
    lesson?: {
        id?: number;
        vocabularies?: Vocabulary[];
        vocabularies_data?: Vocabulary[];
        [key: string]: any;
    } | null;
    vocabularies?: Vocabulary[];
    playAudio?: (audioUrl: string | null) => void;
}

export default function MandarinAddOnPanel({
    lesson,
    vocabularies: directVocabularies,
    playAudio: externalPlayAudio,
}: MandarinAddOnPanelProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const vocabularies: Vocabulary[] =
        directVocabularies ??
        lesson?.vocabularies ??
        lesson?.vocabularies_data ??
        [];

    const handlePlayAudio = (audioUrl?: string | null) => {
        if (!audioUrl) {
            return;
        }

        if (externalPlayAudio) {
            externalPlayAudio(audioUrl);
        } else {
            const audio = new Audio(audioUrl);
            audio
                .play()
                .catch((err) => console.error('Audio play error:', err));
        }
    };

    if (!vocabularies || vocabularies.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <span>Mandarin Vocabularies</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    {vocabularies.length}
                </span>
            </h3>

            {/* Grid Vocabulary Card */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {vocabularies.map((vocab) => (
                    <div
                        key={vocab.id}
                        className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h4 className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                    {vocab.hanzi}
                                </h4>
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    {vocab.pinyin}
                                </p>
                                <p className="mt-1 text-xs text-gray-600 dark:text-slate-300">
                                    {vocab.meaning}
                                </p>
                            </div>

                            {/* Button Play Audio */}
                            {vocab.audio_url && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePlayAudio(vocab.audio_url)
                                    }
                                    className="cursor-pointer rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100 active:scale-95 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                                    title="Play Audio"
                                >
                                    <Volume2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Preview Gambar Vocabulary */}
                        {vocab.image_url && (
                            <div className="mt-3 border-t border-gray-100 pt-2 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedImage(
                                            vocab.image_url ?? null,
                                        )
                                    }
                                    className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                                >
                                    <ImageIcon className="h-3.5 w-3.5" /> View
                                    Picture
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal Image Zoom */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-lg rounded-2xl bg-white p-3 shadow-2xl dark:bg-slate-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-3 -right-3 cursor-pointer rounded-full bg-white p-1 text-gray-700 shadow-md hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Vocabulary Illustration"
                            className="max-h-96 w-full rounded-xl object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
