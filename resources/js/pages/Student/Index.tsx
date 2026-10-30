import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    MessageCircle,
    Sparkles,
    Target,
} from 'lucide-react';
import MetricCard from '@/components/UI/MetricCard';
import { useAuth } from '@/hooks/useAuth';
import student from '@/routes/student';
import Layout from './Layout';

const quickWins = [
    {
        label: 'Profile ready',
        value: '70%',
        icon: Target,
    },
    {
        label: 'Mandarin level',
        value: 'A2',
        icon: BookOpen,
    },
    {
        label: 'Achievements',
        value: '2',
        icon: Award,
    },
];

export default function StudentDashboard() {
    const { user } = useAuth();
    const firstName = user?.name?.split(' ')[0] || 'friend';

    return (
        <Layout>
            <div className="mx-auto max-w-6xl min-w-0 space-y-8 sm:space-y-10">
                <section className="relative isolate grid min-w-0 gap-8 overflow-hidden rounded-panel bg-accent-soft p-6 shadow-card sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div className="absolute -top-16 -right-10 -z-10 size-56 rounded-full bg-surface/55" />
                    <div className="absolute -right-12 -bottom-24 -z-10 size-56 rounded-full bg-highlight/25" />
                    <div className="relative min-w-0">
                        <span className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-4 py-2 text-xs font-bold tracking-wide text-brand-strong">
                            <Sparkles
                                className="size-4 text-accent"
                                aria-hidden="true"
                            />
                            YOUR LEARNING HOME
                        </span>
                        <h1 className="mt-5 max-w-2xl font-display text-display-lg font-semibold tracking-tight break-words text-brand-strong">
                            Good morning, {firstName}.
                        </h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg">
                            You are making real progress. Pick up where you left
                            off or explore something new today.
                        </p>
                        <Link
                            href={student.courses.index.url()}
                            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-strong px-6 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-ink"
                        >
                            Continue learning <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <aside className="relative rounded-card border border-white/60 bg-surface/80 p-5 shadow-card backdrop-blur-sm sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold tracking-wide text-accent uppercase">
                                    Your next step
                                </p>
                                <h2 className="mt-2 font-display text-xl font-semibold text-brand-strong sm:text-2xl">
                                    Keep a steady rhythm
                                </h2>
                            </div>
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                                <BookOpen
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted">
                            A short lesson today brings your Taiwan plans a
                            little closer.
                        </p>
                        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4 text-sm font-semibold text-ink">
                            <span className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-brand">
                                <Target className="size-4" aria-hidden="true" />
                            </span>
                            10 minutes is a good start
                        </div>
                    </aside>
                </section>

                <section
                    aria-label="Your progress"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {quickWins.map((item) => (
                        <MetricCard
                            key={item.label}
                            title={item.label}
                            value={item.value}
                            icon={
                                <item.icon
                                    className="size-5"
                                    aria-hidden="true"
                                />
                            }
                        />
                    ))}
                </section>

                <section className="grid min-w-0 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                    <article className="min-w-0 rounded-panel border border-border bg-surface p-6 shadow-card sm:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-accent">
                                    Continue your journey
                                </p>
                                <h2 className="mt-2 font-display text-2xl font-semibold text-brand-strong sm:text-3xl">
                                    Mandarin Foundations
                                </h2>
                            </div>
                            <span className="rounded-full bg-status-positive-soft px-3 py-1.5 text-xs font-bold text-status-positive">
                                Lesson 3 of 8
                            </span>
                        </div>
                        <div className="mt-7 h-2.5 overflow-hidden rounded-full bg-surface-muted">
                            <div className="h-full w-[38%] rounded-full bg-brand" />
                        </div>
                        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs font-semibold text-muted">
                            <span>Greetings and introductions</span>
                            <span>38% complete</span>
                        </div>
                        <Link
                            href={student.courses.index.url()}
                            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-brand-strong hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            Open next lesson <ArrowRight className="size-4" />
                        </Link>
                    </article>

                    <article className="rounded-panel border border-border bg-surface-muted p-6 sm:p-8">
                        <span className="flex size-11 items-center justify-center rounded-control bg-surface text-accent shadow-sm">
                            <CalendarDays
                                className="size-5"
                                aria-hidden="true"
                            />
                        </span>
                        <h2 className="mt-5 font-display text-2xl font-semibold text-brand-strong">
                            Coming up
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-muted">
                            Taiwan Tech Career Fair community prep session
                        </p>
                        <p className="mt-4 text-xs font-bold text-accent">
                            Saturday · 10:00 AM
                        </p>
                    </article>
                </section>

                <section
                    aria-label="Explore more"
                    className="grid gap-4 md:grid-cols-2"
                >
                    <Link
                        href={student.community.index.url()}
                        className="group flex min-w-0 items-center gap-4 rounded-panel border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-panel sm:gap-5 sm:p-6"
                    >
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent sm:size-14">
                            <MessageCircle
                                className="size-5 sm:size-6"
                                aria-hidden="true"
                            />
                        </span>
                        <span className="min-w-0">
                            <span className="block font-display text-lg font-semibold text-brand-strong sm:text-xl">
                                Meet your community
                            </span>
                            <span className="mt-1 block text-sm leading-5 text-muted">
                                Questions, stories, and friendly advice
                            </span>
                        </span>
                        <ArrowRight
                            className="ml-auto size-5 shrink-0 text-brand transition group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </Link>
                    <Link
                        href={student.jobs.index.url()}
                        className="group flex min-w-0 items-center gap-4 rounded-panel border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-panel sm:gap-5 sm:p-6"
                    >
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-status-positive-soft text-status-positive sm:size-14">
                            <BriefcaseBusiness
                                className="size-5 sm:size-6"
                                aria-hidden="true"
                            />
                        </span>
                        <span className="min-w-0">
                            <span className="block font-display text-lg font-semibold text-brand-strong sm:text-xl">
                                Explore opportunities
                            </span>
                            <span className="mt-1 block text-sm leading-5 text-muted">
                                Find a next step that feels like you
                            </span>
                        </span>
                        <ArrowRight
                            className="ml-auto size-5 shrink-0 text-brand transition group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </Link>
                </section>
            </div>
        </Layout>
    );
}
