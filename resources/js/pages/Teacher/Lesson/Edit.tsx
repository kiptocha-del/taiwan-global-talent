import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Video,
    FileText,
    Music,
    FileCheck,
    Plus,
    Trash2,
} from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

interface AudioItem {
    id?: number;
    lesson_audio_description: string;
    lesson_audio_path?: string;
    file: File | null;
}

interface SentenceItem {
    id?: number;
    hanzi: string;
    pinyin: string;
    meaning: string;
}

interface VocabularyItem {
    id: number;
    hanzi: string;
    pinyin: string;
    meaning: string;
}

interface LessonDetail {
    id: number;
    module_id: number;
    title: string;
    order: number;
    content_type: 'text' | 'video' | 'audio' | 'pdf';
    content?: string | null;
    video_url?: string | null;
    video_path?: string | null;
    pdf_path?: string | null;
    audios?: AudioItem[];
    sentences?: SentenceItem[];
    vocabularies?: VocabularyItem[];
}

interface ModuleInfo {
    id: number;
    title: string;
    category_id: number;
}

interface EditProps {
    lesson: LessonDetail;
    module: ModuleInfo;
    vocabularies?: VocabularyItem[];
    teacher?: any;
}

export default function Edit({
    lesson,
    module,
    vocabularies = [],
    teacher,
}: EditProps) {
    const isMandarin = module.category_id === 1;

    // Explicit Type declaration for useForm
    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        title: string;
        order: number;
        content_type: 'text' | 'video' | 'audio' | 'pdf';
        content: string;
        video_url: string;
        video_file: File | null;
        pdf_file: File | null;
        audios: AudioItem[];
        sentences: SentenceItem[];
        vocabularies: number[];
    }>({
        _method: 'PUT',
        title: lesson.title || '',
        order: lesson.order ?? 1,
        content_type: (lesson.content_type || 'text') as
            | 'text'
            | 'video'
            | 'audio'
            | 'pdf',
        content: lesson.content || '',
        video_url: lesson.video_url || '',
        video_file: null,
        pdf_file: null,
        audios: (lesson.audios || []).map((a) => ({
            id: a.id,
            lesson_audio_description: a.lesson_audio_description || '',
            lesson_audio_path: a.lesson_audio_path,
            file: null,
        })),
        sentences: (lesson.sentences || []).map((s) => ({
            id: s.id,
            hanzi: s.hanzi || '',
            pinyin: s.pinyin || '',
            meaning: s.meaning || '',
        })),
        vocabularies: (lesson.vocabularies || []).map((v) => v.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/teacher/lessons/${lesson.id}`);
    };

    // Handler Repeater Audios (Sudah disesuaikan propertinya)
    const addAudioRow = () => {
        setData('audios', [
            ...data.audios,
            {
                id: undefined,
                lesson_audio_description: '',
                lesson_audio_path: undefined,
                file: null,
            },
        ]);
    };

    const removeAudioRow = (idx: number) => {
        setData(
            'audios',
            data.audios.filter((_, i) => i !== idx)
        );
    };

    // Handler Repeater Sentences (Sudah disesuaikan propertinya)
    const addSentenceRow = () => {
        setData('sentences', [
            ...data.sentences,
            { id: undefined, hanzi: '', pinyin: '', meaning: '' },
        ]);
    };

    const removeSentenceRow = (idx: number) => {
        setData(
            'sentences',
            data.sentences.filter((_, i) => i !== idx)
        );
    };

    return (
        <>
            <Head title={`Edit Lesson - ${lesson.title}`} />
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-4xl px-4 py-8">
                    <Link
                        href={`/teacher/modules/${module.id}`}
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Module ({module.title})
                    </Link>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                                Module: {module.title}
                            </span>
                            <h1 className="mt-2 text-xl font-bold text-gray-900">
                                Edit Lesson
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title & Order */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="sm:col-span-2">
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Lesson Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Order / Urutan
                                    </label>
                                    <input
                                        type="number"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData('order', Number(e.target.value))
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        required
                                    />
                                    {errors.order && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.order}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Content Type Tabs */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Tipe Konten Pembelajaran
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {[
                                        { id: 'text', label: '📝 Teks Paragraf', icon: FileText },
                                        { id: 'video', label: '🎥 Video Materi', icon: Video },
                                        { id: 'audio', label: '🎵 Audio Podcast', icon: Music },
                                        { id: 'pdf', label: '📄 Dokumen PDF', icon: FileCheck },
                                    ].map((type) => (
                                        <button
                                            type="button"
                                            key={type.id}
                                            onClick={() =>
                                                setData('content_type', type.id as any)
                                            }
                                            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                                                data.content_type === type.id
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <type.icon className="h-4 w-4" />
                                            <span>{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Conditional Rendering: Content Type */}
                            {data.content_type === 'text' && (
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Isi Artikel Materi (Text / HTML)
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={data.content}
                                        onChange={(e) =>
                                            setData('content', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                    />
                                    {errors.content && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.content}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.content_type === 'video' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                            Link URL Video (YouTube / Vimeo)
                                        </label>
                                        <input
                                            type="url"
                                            value={data.video_url}
                                            onChange={(e) =>
                                                setData('video_url', e.target.value)
                                            }
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        />
                                        {errors.video_url && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.video_url}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                            Atau Upload File Video Baru (MP4/MKV)
                                        </label>
                                        {lesson.video_path && (
                                            <p className="mb-1 text-[11px] font-semibold text-emerald-600">
                                                Current file: {lesson.video_path}
                                            </p>
                                        )}
                                        <input
                                            type="file"
                                            accept="video/mp4,video/mkv"
                                            onChange={(e) =>
                                                setData(
                                                    'video_file',
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                            className="w-full text-xs text-gray-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {data.content_type === 'pdf' && (
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Upload Dokumen PDF Baru
                                    </label>
                                    {lesson.pdf_path && (
                                        <p className="mb-1 text-[11px] font-semibold text-emerald-600">
                                            Current PDF: {lesson.pdf_path}
                                        </p>
                                    )}
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) =>
                                            setData(
                                                'pdf_file',
                                                e.target.files?.[0] || null
                                            )
                                        }
                                        className="w-full text-xs text-gray-500"
                                    />
                                </div>
                            )}

                            {data.content_type === 'audio' && (
                                <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                                            Audio Lessons (Repeater)
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addAudioRow}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add Audio
                                        </button>
                                    </div>

                                    {data.audios.map((audio, idx) => (
                                        <div
                                            key={idx}
                                            className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-3 sm:flex-row sm:items-center sm:gap-3"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Description..."
                                                value={audio.lesson_audio_description}
                                                onChange={(e) => {
                                                    const updated = [...data.audios];
                                                    updated[idx].lesson_audio_description = e.target.value;
                                                    setData('audios', updated);
                                                }}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none sm:w-1/2"
                                            />
                                            <div className="flex w-full items-center gap-2 sm:w-1/2">
                                                <input
                                                    type="file"
                                                    accept="audio/mp3,audio/wav"
                                                    onChange={(e) => {
                                                        const updated = [...data.audios];
                                                        updated[idx].file = e.target.files?.[0] || null;
                                                        setData('audios', updated);
                                                    }}
                                                    className="w-full text-xs"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeAudioRow(idx)}
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Mandarin Features (Sentences & Vocabularies) */}
                            {isMandarin && (
                                <div className="space-y-6 border-t border-gray-100 pt-6">
                                    {/* Sentences Repeater */}
                                    <div className="space-y-3 rounded-2xl border border-indigo-50 bg-indigo-50/20 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                                                List of Sentences (Chinese Hanzi)
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={addSentenceRow}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                                            >
                                                <Plus className="h-3.5 w-3.5" /> Add Sentence
                                            </button>
                                        </div>

                                        {data.sentences.map((sentence, idx) => (
                                            <div
                                                key={idx}
                                                className="relative grid grid-cols-1 gap-2 rounded-xl border border-gray-100 bg-white p-3 sm:grid-cols-3"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Chinese Hanzi..."
                                                    value={sentence.hanzi}
                                                    onChange={(e) => {
                                                        const updated = [...data.sentences];
                                                        updated[idx].hanzi = e.target.value;
                                                        setData('sentences', updated);
                                                    }}
                                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Pinyin..."
                                                    value={sentence.pinyin}
                                                    onChange={(e) => {
                                                        const updated = [...data.sentences];
                                                        updated[idx].pinyin = e.target.value;
                                                        setData('sentences', updated);
                                                    }}
                                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Meaning..."
                                                        value={sentence.meaning}
                                                        onChange={(e) => {
                                                            const updated = [...data.sentences];
                                                            updated[idx].meaning = e.target.value;
                                                            setData('sentences', updated);
                                                        }}
                                                        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSentenceRow(idx)}
                                                        className="p-1 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Vocabularies Multi Select */}
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                            Reference Vocabularies
                                        </label>
                                        <select
                                            multiple
                                            value={data.vocabularies.map(String)}
                                            onChange={(e) => {
                                                const options = Array.from(
                                                    e.target.selectedOptions,
                                                    (option) => Number(option.value)
                                                );
                                                setData('vocabularies', options);
                                            }}
                                            className="h-32 w-full rounded-xl border border-gray-200 p-2 text-xs outline-none focus:border-indigo-500"
                                        >
                                            {vocabularies.map((vocab) => (
                                                <option
                                                    key={vocab.id}
                                                    value={vocab.id}
                                                >
                                                    {vocab.hanzi} ({vocab.pinyin}) - {vocab.meaning}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <Link
                                    href={`/teacher/modules/${module.id}`}
                                    className="rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" /> Update Lesson
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}