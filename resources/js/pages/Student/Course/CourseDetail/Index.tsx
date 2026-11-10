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
                <div className="relative mb-12 overflow-hidden rounded-3xl bg-slate-950 shadow-xl">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-transparent" />
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 grid grid-cols-1 gap-8 p-8 md:p-12 lg:grid-cols-3 lg:items-center">
                        <div className="lg:col-span-2">
                            <h1 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                                {category.name}
                            </h1>
                            <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                                {category.description}
                            </p>
                            <div className="mt-4 space-y-1">
                                <p className="flex max-w-2xl items-center gap-2 text-xs font-light text-slate-300">
                                    <User2
                                        size={14}
                                        className="text-amber-400"
                                    />{' '}
                                    Instructor:{' '}
                                    <span className="font-medium text-amber-300">
                                        {category.instructor ||
                                            'General Instructor'}
                                    </span>
                                </p>
                                <p className="max-w-2xl text-xs font-light text-slate-300">
                                    Last Updated:{' '}
                                    <span className="font-medium text-amber-300">
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
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    Curriculum Path
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Complete all modules sequentially to finish
                                    the course.
                                </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
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
                                        className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 transition-all duration-300 md:flex-row md:items-center dark:bg-slate-900 ${
                                            isLocked
                                                ? 'border-slate-100 opacity-80 dark:border-slate-800/80'
                                                : 'border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-800 dark:hover:border-blue-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${
                                                    isCompleted
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                                                        : module.status ===
                                                            'In Progress'
                                                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                                                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
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
                                                <span className="mb-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-300">
                                                    {module.level}
                                                </span>

                                                <h3 className="text-base font-bold text-slate-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                    {module.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-6 md:mt-0">
                                            {!isLocked && (
                                                <div className="w-28">
                                                    <div className="mb-1 flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                        <span>Progress</span>
                                                        <span>
                                                            {module.progress}%
                                                        </span>
                                                    </div>

                                                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className={`h-full transition-all duration-500 ${
                                                                isCompleted
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-blue-600'
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
                                                    className="bg-slate-950 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
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
                        <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                            {category.thumbnail_url && (
                                <img
                                    src={category.thumbnail_url}
                                    alt={category.name}
                                    className="h-56 w-full object-cover"
                                />
                            )}

                            <div className="space-y-6 p-6">
                                <div>
                                    <p className="mb-2 text-xs font-semibold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                        Course Information
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {category.name}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Instructor
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {category.instructor || 'General'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Duration
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {category.duration || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Modules
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {modules.length}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Updated
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {category.updated_at || '-'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Course Price
                                    </p>

                                    <h4 className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
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
