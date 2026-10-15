import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Video, FileText, Music, FileCheck, Plus, Trash2 } from 'lucide-react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

export default function Create({ module, vocabularies = [], teacher }: any) {
    const isMandarin = module.category_id === 1;

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        order: 1,
        content_type: 'text' as 'text' | 'video' | 'audio' | 'pdf',
        content: '',
        video_url: '',
        video_file: null as File | null,
        pdf_file: null as File | null,
        audios: [] as Array<{ lesson_audio_description: string; file: File | null }>,
        sentences: [] as Array<{ hanzi: string; pinyin: string; meaning: string }>,
        vocabularies: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/teacher/modules/${module.id}/lessons`);
    };

    // Handler Repeater Audios
    const addAudioRow = () => {
        setData('audios', [...data.audios, { lesson_audio_description: '', file: null }]);
    };
    const removeAudioRow = (idx: number) => {
        setData('audios', data.audios.filter((_, i) => i !== idx));
    };

    // Handler Repeater Sentences
    const addSentenceRow = () => {
        setData('sentences', [...data.sentences, { hanzi: '', pinyin: '', meaning: '' }]);
    };
    const removeSentenceRow = (idx: number) => {
        setData('sentences', data.sentences.filter((_, i) => i !== idx));
    };

    return (
        <>
            <Head title={`Add Lesson - ${module.title}`} />
            <div className="min-h-screen bg-gray-50/50">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-4xl px-4 py-8">
                    <Link
                        href={`/teacher/modules/${module.id}`}
                        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Module ({module.title})
                    </Link>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                Module: {module.title}
                            </span>
                            <h1 className="mt-2 text-xl font-bold text-gray-900">Add New Lesson</h1>
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
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        value={data.order}
                                        onChange={(e) => setData('order', Number(e.target.value))}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Content Type Tabs */}
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Content Type
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {[
                                        { id: 'text', label: 'Text', icon: FileText },
                                        { id: 'video', label: 'Video', icon: Video },
                                        { id: 'audio', label: 'Audio', icon: Music },
                                        { id: 'pdf', label: 'PDF', icon: FileCheck },
                                    ].map((type) => (
                                        <button
                                            type="button"
                                            key={type.id}
                                            onClick={() => setData('content_type', type.id as any)}
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
                                        Lesson Content
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            )}

                            {data.content_type === 'video' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                            Video Link (YouTube / Vimeo)
                                        </label>
                                        <input
                                            type="url"
                                            value={data.video_url}
                                            onChange={(e) => setData('video_url', e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                            Or Upload Video File (MP4/MKV)
                                        </label>
                                        <input
                                            type="file"
                                            accept="video/mp4,video/mkv"
                                            onChange={(e) => setData('video_file', e.target.files?.[0] || null)}
                                            className="w-full text-xs text-gray-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {data.content_type === 'pdf' && (
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-700">
                                        Upload PDF Document
                                    </label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setData('pdf_file', e.target.files?.[0] || null)}
                                        className="w-full text-xs text-gray-500"
                                        required
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
                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add Audio
                                        </button>
                                    </div>

                                    {data.audios.map((audio, idx) => (
                                        <div key={idx} className="flex items-center gap-3 rounded-xl bg-white p-3 border border-gray-100">
                                            <input
                                                type="text"
                                                placeholder="Description..."
                                                value={audio.lesson_audio_description}
                                                onChange={(e) => {
                                                    const updated = [...data.audios];
                                                    updated[idx].lesson_audio_description = e.target.value;
                                                    setData('audios', updated);
                                                }}
                                                className="w-1/2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none"
                                            />
                                            <input
                                                type="file"
                                                accept="audio/mp3,audio/wav"
                                                onChange={(e) => {
                                                    const updated = [...data.audios];
                                                    updated[idx].file = e.target.files?.[0] || null;
                                                    setData('audios', updated);
                                                }}
                                                className="w-1/2 text-xs"
                                            />
                                            <button type="button" onClick={() => removeAudioRow(idx)} className="text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
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
                                                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600"
                                            >
                                                <Plus className="h-3.5 w-3.5" /> Add Sentence
                                            </button>
                                        </div>

                                        {data.sentences.map((sentence, idx) => (
                                            <div key={idx} className="grid grid-cols-1 gap-2 rounded-xl bg-white p-3 border border-gray-100 sm:grid-cols-3 relative">
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
                                                    <button type="button" onClick={() => removeSentenceRow(idx)} className="text-red-500">
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
                                                const options = Array.from(e.target.selectedOptions, (option) => Number(option.value));
                                                setData('vocabularies', options);
                                            }}
                                            className="h-32 w-full rounded-xl border border-gray-200 p-2 text-xs focus:border-indigo-500 outline-none"
                                        >
                                            {vocabularies.map((vocab: any) => (
                                                <option key={vocab.id} value={vocab.id}>
                                                    {vocab.hanzi} ({vocab.pinyin}) - {vocab.meaning}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
                                >
                                    <Save className="h-4 w-4" /> Save Lesson
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}