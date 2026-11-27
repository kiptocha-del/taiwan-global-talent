import { Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import LessonContentBlock from '@/components/Course/LessonContentBlock';
import LessonSyllabus from '@/components/Course/LessonSyllabus';
import MandarinAddOnPanel from '@/components/Course/MandarinAddOnPanel';
import MediaContentManager from '@/components/Course/MediaContentManager';
import Button from '@/components/UI/Button';
import { getYouTubeEmbedUrl, playAudio } from '@/utils/media.helper';
import Layout from '../Layout';

export default function Show({ module, currentCategory, enrollment }: any) {
    const [activeLesson, setActiveLesson] = useState<any>(
        module?.lessons?.[0] || null,
    );
    const [loading, setLoading] = useState(false);
    const isMandarin = currentCategory?.id === 1;
    const completedLessonIds: number[] = enrollment?.completed_lesson_ids ?? [];

    const handleCompleteLesson = () => {
        if (!activeLesson || loading) {
            return;
        }

        setLoading(true);

        router.post(
            `/student/courses/${module.id}/lessons/${activeLesson.id}/complete`,
            {},
            {
                onSuccess: (page: any) => {
                    const flashData = page.props.flash || {};
                    alert(flashData.success || 'Progress saved.');

                    const currentIdx = module.lessons.findIndex(
                        (l: any) => l.id === activeLesson.id,
                    );

                    if (
                        currentIdx !== -1 &&
                        currentIdx + 1 < module.lessons.length
                    ) {
                        setActiveLesson(module.lessons[currentIdx + 1]);
                    } else {
                        router.get('/student/courses/certificate');
                    }
                },
                onError: (errors) => {
                    console.error(errors);
                    alert('We could not save your progress. Please try again.');
                },
                onFinish: () => setLoading(false),
                preserveScroll: true,
            },
        );
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Top Header */}
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-xs">
                    <Link
                        href={`/student/courses/${currentCategory?.slug}`}
                        className="rounded-xl border border-border p-2 text-muted transition-colors hover:bg-canvas"
                    >
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h2 className="text-base font-bold tracking-tight text-ink">
                            {module?.title}
                        </h2>
                        <p className="text-xs text-muted">
                            {currentCategory?.name} Program
                        </p>
                    </div>
                </div>

                {/* Grid Split Panel */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Panel (Syllabus) */}
                    <div className="relative lg:col-span-4">
                        <LessonSyllabus
                            lessons={module?.lessons || []}
                            activeLessonId={activeLesson?.id || null}
                            completedLessonIds={completedLessonIds}
                            onSelectLesson={(lesson) => setActiveLesson(lesson)}
                        />
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6 lg:col-span-8">
                        {activeLesson && (
                            <>
                                {/* 1. Main Text */}
                                <LessonContentBlock
                                    lesson={activeLesson}
                                    isMandarin={isMandarin}
                                />

                                {/* 2. Multimedia Player (Video/Audios/PDF) */}
                                <MediaContentManager
                                    lesson={activeLesson}
                                    getYouTubeEmbedUrl={getYouTubeEmbedUrl}
                                />

                                {/* 3. Chinese Program (Vocab & Kalimat) */}
                                <MandarinAddOnPanel
                                    lesson={activeLesson}
                                    playAudio={playAudio}
                                />

                                {/* 4. Complete Module Button */}
                                <div className="flex justify-end rounded-2xl border border-border bg-surface p-4 shadow-xs">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        icon={CheckCircle2}
                                        isLoading={loading}
                                        onClick={handleCompleteLesson}
                                    >
                                        Mark as Completed & Next
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
