import {
    ArrowUpRight,
    Award,
    BookOpenText,
    BriefcaseBusiness,
    MessagesSquare,
} from 'lucide-react';
import { courses } from '@/routes';

const pathways = [
    {
        icon: MessagesSquare,
        eyebrow: 'Speak with confidence',
        title: 'Mandarin',
        description:
            'Practice introductions, transport, campus life, and workplace conversations while preparing for TOCFL.',
        action: 'Find your level',
        backgroundClass: 'bg-status-info-soft',
        accentClass: 'text-status-info',
        borderClass: 'border-t-status-info',
        decoration: '你好',
        image: '/images/landing/diverse-collaboration-card.jpg',
    },
    {
        icon: BookOpenText,
        eyebrow: 'Make study possible',
        title: 'Scholarships',
        description:
            'Compare MOE, TaiwanICDF, and university funding routes, then organize documents and deadlines.',
        action: 'Explore funding',
        backgroundClass: 'bg-accent-soft',
        accentClass: 'text-accent',
        borderClass: 'border-t-accent',
        decoration: '✦',
        image: null,
    },
    {
        icon: BriefcaseBusiness,
        eyebrow: 'Meet your next step',
        title: 'Career network',
        description:
            'Present your skills clearly and prepare for internships and roles across Taiwan’s industries.',
        action: 'See opportunities',
        backgroundClass: 'bg-status-positive-soft',
        accentClass: 'text-status-positive',
        borderClass: 'border-t-status-positive',
        decoration: '↗',
        image: '/images/landing/opportunity-track-card.jpg',
    },
    {
        icon: Award,
        eyebrow: 'Celebrate your growth',
        title: 'Certificates',
        description:
            'Keep verified course progress beside your language level, portfolio, and application profile.',
        action: 'Start collecting',
        backgroundClass: 'bg-status-warning-soft',
        accentClass: 'text-accent',
        borderClass: 'border-t-status-warning',
        decoration: '★',
        image: null,
    },
];

export default function CorePillars() {
    return (
        <section
            id="learning-paths"
            className="relative overflow-hidden bg-white px-5 py-24 dark:bg-[#1b2630]"
        >
            <div className="absolute top-20 -right-12 h-40 w-40 rounded-full border-[28px] border-[#FFD86B]/35" />
            <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF3D0] px-4 py-2 text-sm font-extrabold text-[#9A6410]">
                        <span aria-hidden="true">✦</span> Pick a place to begin
                    </span>
                    <h2 className="mt-5 font-display text-4xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-6xl">
                        Four practical paths into life in Taiwan.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 font-semibold text-[#24458F]/62">
                        Begin with Mandarin, funding, career preparation, or
                        proof of progress. Each path connects to a real decision
                        students and professionals face in Taiwan.
                    </p>
                </div>
                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {pathways.map((pathway, index) => (
                        <article
                            key={pathway.title}
                            className={`group relative min-h-[360px] overflow-hidden rounded-md border border-t-4 border-[#31556a]/20 p-6 shadow-[0_12px_30px_rgba(40,45,51,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(40,45,51,0.15)] dark:border-[#f0d49b]/20 dark:shadow-[0_16px_32px_rgba(0,0,0,0.24)] ${pathway.backgroundClass} ${pathway.borderClass} ${index % 2 === 1 ? 'lg:mt-8' : ''}`}
                        >
                            <span
                                className={`absolute -right-3 -bottom-8 font-display text-[8rem] font-black opacity-[0.08] ${pathway.accentClass}`}
                            >
                                {pathway.decoration}
                            </span>
                            <div className="relative flex h-full flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-sm bg-white/85 shadow-sm dark:bg-[#111820] ${pathway.accentClass}`}
                                    >
                                        <pathway.icon className="h-8 w-8" />
                                    </div>
                                    {pathway.image ? (
                                        <div className="relative -rotate-2 border-4 border-white shadow-md transition duration-300 group-hover:rotate-1 dark:border-[#111820]">
                                            <img
                                                src={pathway.image}
                                                alt=""
                                                aria-hidden="true"
                                                loading="lazy"
                                                className="h-16 w-24 object-cover"
                                            />
                                            <span className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#24458F] text-xs font-black text-white dark:bg-[#f0c975] dark:text-[#262018]">
                                                0{index + 1}
                                            </span>
                                        </div>
                                    ) : (
                                        <span
                                            className={`rounded-sm bg-white/75 px-3 py-1 text-xs font-black dark:bg-[#111820] ${pathway.accentClass}`}
                                        >
                                            0{index + 1}
                                        </span>
                                    )}
                                </div>
                                <p
                                    className={`mt-8 text-sm font-extrabold ${pathway.accentClass}`}
                                >
                                    {pathway.eyebrow}
                                </p>
                                <h3 className="mt-2 font-display text-3xl font-black tracking-tight text-[#24458F]">
                                    {pathway.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 font-semibold text-[#24458F]/65">
                                    {pathway.description}
                                </p>
                                <a
                                    href={`${courses.url()}#course-list`}
                                    className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-extrabold text-[#24458F]"
                                >
                                    {pathway.action}
                                    <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/85 transition group-hover:-translate-y-1 dark:bg-[#111820]">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </span>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
