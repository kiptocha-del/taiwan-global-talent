import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    HeartHandshake,
    Languages,
    MapPin,
    Sparkles,
} from 'lucide-react';
import Footer from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';
import { home, login } from '@/routes';

const values = [
    {
        icon: HeartHandshake,
        title: 'Belong before you arrive',
        description:
            'Moving toward a new country can feel uncertain. We create a friendly place to ask questions, meet people, and feel less alone.',
        color: '#FFE0C2',
    },
    {
        icon: BookOpen,
        title: 'Learn what helps in real life',
        description:
            'From Mandarin to applications and interviews, every pathway is designed around practical next steps—not busywork.',
        color: '#CFE8FF',
    },
    {
        icon: Sparkles,
        title: 'Celebrate every small win',
        description:
            'Confidence grows one lesson, conversation, and application at a time. Progress deserves to feel visible and joyful.',
        color: '#DDD4FF',
    },
];

const community = [
    { icon: Languages, label: 'Language learners' },
    { icon: BookOpen, label: 'Students and graduates' },
    { icon: BriefcaseBusiness, label: 'Working talent' },
    { icon: HeartHandshake, label: 'Teachers and partners' },
];

export default function About() {
    return (
        <div className="bg-[#FFF8ED] font-sans text-[#24458F] antialiased selection:bg-[#FFD86B] selection:text-[#24458F]">
            <Head title="About Taiwan Global Talent Hub" />
            <Navbar />

            <main>
                <section className="relative overflow-hidden px-5 pt-36 pb-20">
                    <div className="absolute -top-10 -left-20 h-80 w-80 rounded-full bg-[#FFD86B]/35 blur-3xl" />
                    <div className="absolute top-28 -right-28 h-96 w-96 rounded-full bg-[#CFE8FF]/70 blur-3xl" />
                    <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#C4573C] shadow-sm">
                                <MapPin className="h-4 w-4" /> Our story starts
                                in Taiwan
                            </span>
                            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-black tracking-[-0.04em] text-[#24458F] sm:text-6xl lg:text-7xl">
                                A softer place to plan a bold future.
                            </h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 font-semibold text-[#24458F]/66">
                                Taiwan Global Talent Hub brings learning,
                                community, scholarships, and career support
                                together so your next step feels clearer—and a
                                lot less lonely.
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link
                                    href={`${home.url()}#programs`}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#24458F] px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(36,69,143,0.2)] transition hover:-translate-y-1 hover:bg-[#FF7958]"
                                >
                                    Explore the hub{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={login.url()}
                                    className="rounded-full border-2 border-[#24458F]/12 bg-white/80 px-7 py-4 text-sm font-extrabold text-[#24458F] transition hover:border-[#24458F]/25"
                                >
                                    Join the community
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-white shadow-[0_28px_75px_rgba(36,69,143,0.16)]">
                                <img
                                    src="/images/landing/cozy-taiwan-clubhouse.webp"
                                    alt="Learners sharing ideas in the Taiwan Global Talent clubhouse"
                                    className="aspect-[4/3] w-full object-cover object-[68%_center]"
                                />
                            </div>
                            <div className="absolute -bottom-5 left-8 rotate-[-3deg] rounded-2xl bg-[#CDEEDB] px-5 py-4 font-display text-sm font-black text-[#24458F] shadow-lg">
                                Learn. Connect. Grow.
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white px-5 py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                            <div>
                                <span className="inline-flex rounded-full bg-[#CDEEDB] px-4 py-2 text-sm font-extrabold text-[#27705E]">
                                    Why we exist
                                </span>
                                <h2 className="mt-5 font-display text-4xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-6xl">
                                    Talent is everywhere. Opportunity should
                                    feel closer.
                                </h2>
                            </div>
                            <div className="rounded-[2rem] bg-[#FFF8ED] p-8 text-lg leading-9 font-semibold text-[#24458F]/68 md:p-10">
                                <p>
                                    Planning a future in Taiwan often means
                                    navigating language learning, scholarship
                                    requirements, cultural questions, and career
                                    decisions across many disconnected places.
                                </p>
                                <p className="mt-5">
                                    We are building one welcoming home where
                                    international talent can understand the
                                    journey, build useful skills, connect with
                                    people, and move forward with confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-5 py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="inline-flex rounded-full bg-[#FFE0C2] px-4 py-2 text-sm font-extrabold text-[#A94A31]">
                                What guides us
                            </span>
                            <h2 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] text-[#24458F] md:text-6xl">
                                Helpful, human, and full of possibility.
                            </h2>
                        </div>
                        <div className="mt-14 grid gap-6 lg:grid-cols-3">
                            {values.map((value, index) => (
                                <article
                                    key={value.title}
                                    className={`rounded-[2rem] border-4 border-white p-7 shadow-[0_16px_45px_rgba(36,69,143,0.08)] ${index === 1 ? 'lg:-translate-y-5' : ''}`}
                                    style={{ backgroundColor: value.color }}
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#24458F] shadow-sm">
                                        <value.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-7 font-display text-2xl font-black text-[#24458F]">
                                        {value.title}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 font-semibold text-[#24458F]/64">
                                        {value.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-[#CFE8FF] px-5 py-24">
                    <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-extrabold text-[#24458F]">
                                There is room for you here
                            </span>
                            <h2 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] text-[#24458F] md:text-6xl">
                                A hub built around people, not profiles.
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-8 font-semibold text-[#24458F]/65">
                                Whether you are just curious about Taiwan or
                                already building a life here, you should be able
                                to find a useful next step and a community that
                                welcomes you.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {community.map((member) => (
                                <div
                                    key={member.label}
                                    className="flex items-center gap-4 rounded-[1.5rem] bg-white/75 p-5 shadow-sm"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8ED] text-[#FF7958]">
                                        <member.icon className="h-5 w-5" />
                                    </span>
                                    <span className="font-display text-lg font-black text-[#24458F]">
                                        {member.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white px-5 py-24">
                    <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[#24458F] p-9 text-center text-white shadow-[0_24px_70px_rgba(36,69,143,0.2)] md:p-14">
                        <span className="text-3xl" aria-hidden="true">
                            ✨
                        </span>
                        <h2 className="mt-4 font-display text-4xl font-black tracking-[-0.03em] md:text-6xl">
                            Your Taiwan story can start here.
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 font-semibold text-white/70">
                            Come learn something useful, meet someone kind, and
                            discover a next step that feels possible.
                        </p>
                        <Link
                            href={login.url()}
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FFD86B] px-7 py-4 text-sm font-extrabold text-[#24458F] transition hover:-translate-y-1 hover:bg-white"
                        >
                            Join Taiwan Global Talent Hub{' '}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
