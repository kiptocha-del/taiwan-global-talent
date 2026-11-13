import { Link, router } from '@inertiajs/react';
import {
    PlayIcon,
    PlusCircleIcon,
    CheckCircle2,
    Lock,
    Award,
    User2,
} from 'lucide-react';
import { route } from 'ziggy-js';
import Button from '@/components/UI/Button';
import PageHeader from '@/components/UI/PageHeader';
import { useTranslation } from '@/context/LanguageContext';
import Layout from '../../Layout';

interface Module {
    id: number;
    title: string;
    level: string;
    progress: number;
    status: 'Locked' | 'In Progress' | 'Completed';
}

interface Props {
    category: {
        id: number;
        name: string;
        slug: string;
        description?: string | null;
        instructor?: string | null;
        duration?: string | null;
        price: number | string;
        thumbnail_url?: string | null;
        updated_at?: string | null;
    };
    modules: Module[];
}

export default function CourseDetail({ category, modules }: Props) {
    const { t } = useTranslation();

    return (
        <Layout>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Back Navigation Header */}
                <PageHeader
                    title={category.name}
                    subtitle="Explore modules and curriculum path for this course"
                    backUrl={route('student.courses.index')}
                />

                {/* Immersive Hero Section */}
                <div className="relative mb-12 overflow-hidden rounded-3xl bg-brand-strong shadow-xl">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-linear-to-r from-brand-strong via-brand-strong/90 to-transparent"/>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 grid grid-cols-1 gap-8 p-8 md:p-12 lg:grid-cols-3 lg:items-center">
                        <div className="lg:col-span-2">
                            <h1 className="mb-4 text-3xl font-black tracking-tight text-on-brand sm:text-4xl lg:text-5xl">
                                {category.name}
                            </h1>
                            <p className="max-w-2xl text-base leading-relaxed text-on-brand/80 sm:text-lg">
                                {category.description}
                            </p>
                            <div className="mt-4 space-y-1">
                                <p className="flex max-w-2xl items-center gap-2 text-xs font-light text-muted">
                                    <User2
                                        size={14}
                                        className="text-status-warning"
                                    />{' '}
                                    Instructor:{' '}
                                    <span className="font-medium text-status-warning">
                                        {category.instructor ||
                                            'General Instructor'}
                                    </span>
                                </p>
                                <p className="max-w-2xl text-xs font-light text-muted">
                                    Last Updated:{' '}
                                    <span className="font-medium text-status-warning">
                                        {category.updated_at || 'Recently'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum Section */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* LEFT CONTENT - Curriculum Path */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-ink">
                                    Curriculum Path
                                </h2>
                                <p className="text-sm text-muted">
                                    Complete all modules sequentially to finish
                                    the course.
                                </p>
                            </div>

                            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-muted">
                                {modules.length} Modules
                            </span>
                        </div>

                        <div className="space-y-4">
                            {modules.map((module, index) => {
                                const isCompleted =
                                    module.status === 'Completed';
                                const isLocked = module.status === 'Locked';

                                return (
                                    <div
                                        key={module.id}
                                        className={`group relative flex flex-col justify-between rounded-2xl border bg-surface p-5 transition-all duration-300 md:flex-row md:items-center ${
                                            isLocked
                                                ? 'border-border opacity-80 '
                                                : 'border-border hover:border-accent/30 hover:shadow-lg hover:shadow-blue-500/10 '
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${
                                                    isCompleted
                                                        ? 'bg-status-positive-soft text-status-positive '
                                                        : module.status ===
                                                            'In Progress'
                                                          ? 'bg-accent-soft text-accent '
                                                          : 'bg-surface-muted text-muted '
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 size={22} />
                                                ) : isLocked ? (
                                                    <Lock size={20} />
                                                ) : (
                                                    <span>0{index + 1}</span>
                                                )}
                                            </div>

                                            <div>
                                                <span className="mb-1 inline-block rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted uppercase">
                                                    {module.level}
                                                </span>

                                                <h3 className="text-base font-bold text-ink transition group-hover:text-accent">
                                                    {module.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-6 md:mt-0">
                                            {!isLocked && (
                                                <div className="w-28">
                                                    <div className="mb-1 flex justify-between text-[10px] font-semibold text-muted">
                                                        <span>Progress</span>
                                                        <span>
                                                            {module.progress}%
                                                        </span>
                                                    </div>

                                                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                                                        <div
                                                            className={`h-full transition-all duration-500 ${
                                                                isCompleted
                                                                    ? 'bg-status-positive'
                                                                    : 'bg-accent'
                                                            }`}
                                                            style={{
                                                                width: `${module.progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {isLocked ? (
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    size="sm"
                                                    icon={PlusCircleIcon}
                                                    onClick={() =>
                                                        router.post(
                                                            route(
                                                                'student.courses.enroll',
                                                                module.id,
                                                            ),
                                                        )
                                                    }
                                                    className="bg-brand-strong hover:bg-brand-strong"
                                                >
                                                    Daftar Modul
                                                </Button>
                                            ) : (
                                                <Link
                                                    href={route(
                                                        'student.courses.show',
                                                        [
                                                            category.slug,
                                                            module.id,
                                                        ],
                                                    )}
                                                >
                                                    <Button
                                                        type="button"
                                                        variant={
                                                            isCompleted
                                                                ? 'secondary'
                                                                : 'primary'
                                                        }
                                                        size="sm"
                                                        icon={
                                                            isCompleted
                                                                ? Award
                                                                : PlayIcon
                                                        }
                                                    >
                                                        {isCompleted
                                                            ? t('course.review')
                                                            : t('course.startLearning')}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - Course Info Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 overflow-hidden rounded-3xl border border-border bg-surface shadow-lg">
                            {category.thumbnail_url && (
                                <img
                                    src={category.thumbnail_url}
                                    alt={category.name}
                                    className="h-56 w-full object-cover"
                                />
                            )}

                            <div className="space-y-6 p-6">
                                <div>
                                    <p className="mb-2 text-xs font-semibold tracking-widest text-accent uppercase">
                                        Course Information
                                    </p>

                                    <h3 className="text-2xl font-bold text-ink">
                                        {category.name}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-muted">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-border pt-5">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted">
                                            Instructor
                                        </span>
                                        <span className="font-semibold text-ink">
                                            {category.instructor || 'General'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted">
                                            Duration
                                        </span>
                                        <span className="font-semibold text-ink">
                                            {category.duration || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted">
                                            Modules
                                        </span>
                                        <span className="font-semibold text-ink">
                                            {modules.length}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted">
                                            Updated
                                        </span>
                                        <span className="font-semibold text-ink">
                                            {category.updated_at || '-'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-5">
                                    <p className="text-sm text-muted">
                                        Course Price
                                    </p>

                                    <h4 className="mt-1 text-3xl font-black text-ink">
                                        Rp{' '}
                                        {Number(
                                            category.price || 0,
                                        ).toLocaleString('id-ID')}
                                    </h4>
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                >
                                    Enroll Course
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
