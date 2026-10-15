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
import { useAuth } from '@/hooks/useAuth';
import Layout from './Layout';

const quickWins = [
    {
        label: 'Profile ready',
        value: '70%',
        detail: 'One section left',
        color: '#FFE0C2',
        icon: Target,
    },
    {
        label: 'Mandarin level',
        value: 'A2',
        detail: 'Keep practicing',
        color: '#CFE8FF',
        icon: BookOpen,
    },
    {
        label: 'Achievements',
        value: '2',
        detail: 'Certificates earned',
        color: '#DDD4FF',
        icon: Award,
    },
];

export default function StudentDashboard() {
    const { user } = useAuth();
    const firstName = user?.name?.split(' ')[0] || 'friend';

    return (
        <Layout>
            <div className="space-y-8">
                <section className="relative overflow-hidden rounded-[2.25rem] bg-[#CFE8FF] p-7 shadow-[0_20px_60px_rgba(36,69,143,0.12)] sm:p-10">
                    <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/45" />
                    <div className="absolute right-20 -bottom-20 h-44 w-44 rounded-full bg-[#FFD86B]/55" />
                    <div className="relative max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-extrabold text-[#24458F]">
                            <Sparkles className="h-4 w-4 text-[#FF7958]" /> Your
                            learning home
                        </span>
                        <h1 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] text-[#24458F] sm:text-5xl">
                            Good morning, {firstName} 👋
                        </h1>
                        <p className="mt-3 text-base leading-7 font-semibold text-[#24458F]/65">
                            You are making real progress. Pick up where you left
                            off or explore something new today.
                        </p>
                        <Link
                            href="/student/courses"
                            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#24458F] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#FF7958]"
                        >
                            Continue learning <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>

                <section className="grid gap-5 md:grid-cols-3">
                    {quickWins.map((item) => (
                        <article
                            key={item.label}
                            className="rounded-[1.75rem] border-4 border-white p-6 shadow-[0_14px_36px_rgba(36,69,143,0.08)]"
                            style={{ backgroundColor: item.color }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-extrabold text-[#24458F]/60">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 font-display text-4xl font-black text-[#24458F]">
                                        {item.value}
                                    </p>
                                </div>
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#24458F]">
                                    <item.icon className="h-5 w-5" />
                                </span>
                            </div>
                            <p className="mt-4 text-xs font-bold text-[#24458F]/55">
                                {item.detail}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <article className="rounded-[2rem] bg-white p-7 shadow-[0_16px_45px_rgba(36,69,143,0.08)]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-extrabold text-[#FF7958]">
                                    Continue your journey
                                </p>
                                <h2 className="mt-1 font-display text-2xl font-black text-[#24458F]">
                                    Mandarin Foundations
                                </h2>
                            </div>
                            <span className="rounded-full bg-[#CDEEDB] px-3 py-1.5 text-xs font-extrabold text-[#27705E]">
                                Lesson 3 of 8
                            </span>
                        </div>
                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#24458F]/8">
                            <div className="h-full w-[38%] rounded-full bg-[#FF8A65]" />
                        </div>
                        <div className="mt-3 flex justify-between text-xs font-bold text-[#24458F]/50">
                            <span>Greetings and introductions</span>
                            <span>38%</span>
                        </div>
                        <Link
                            href="/student/courses"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#24458F]"
                        >
                            Open next lesson <ArrowRight className="h-4 w-4" />
                        </Link>
                    </article>

                    <article className="rounded-[2rem] bg-[#FFE0C2] p-7 shadow-[0_16px_45px_rgba(36,69,143,0.08)]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/75 text-[#C4573C]">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <h2 className="mt-5 font-display text-2xl font-black text-[#24458F]">
                            Coming up
                        </h2>
                        <p className="mt-3 text-sm leading-7 font-semibold text-[#24458F]/65">
                            Taiwan Tech Career Fair community prep session
                        </p>
                        <p className="mt-4 text-xs font-extrabold text-[#C4573C]">
                            Saturday · 10:00 AM
                        </p>
                    </article>
                </section>

                <section className="grid gap-5 md:grid-cols-2">
                    <Link
                        href="/student/community"
                        className="group flex items-center gap-5 rounded-[1.75rem] bg-[#DDD4FF] p-6 transition hover:-translate-y-1"
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/75 text-[#7059C7]">
                            <MessageCircle className="h-6 w-6" />
                        </span>
                        <span>
                            <span className="block font-display text-xl font-black text-[#24458F]">
                                Meet your community
                            </span>
                            <span className="mt-1 block text-sm font-semibold text-[#24458F]/60">
                                Questions, stories, and friendly advice
                            </span>
                        </span>
                        <ArrowRight className="ml-auto h-5 w-5 text-[#24458F] transition group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/student/jobs"
                        className="group flex items-center gap-5 rounded-[1.75rem] bg-[#CDEEDB] p-6 transition hover:-translate-y-1"
                    >
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/75 text-[#27705E]">
                            <BriefcaseBusiness className="h-6 w-6" />
                        </span>
                        <span>
                            <span className="block font-display text-xl font-black text-[#24458F]">
                                Explore opportunities
                            </span>
                            <span className="mt-1 block text-sm font-semibold text-[#24458F]/60">
                                Find a next step that feels like you
                            </span>
                        </span>
                        <ArrowRight className="ml-auto h-5 w-5 text-[#24458F] transition group-hover:translate-x-1" />
                    </Link>
                </section>
            </div>
        </Layout>
    );
}
