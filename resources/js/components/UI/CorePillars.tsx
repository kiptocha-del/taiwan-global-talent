import {
    ArrowUpRight,
    Award,
    BookOpenText,
    BriefcaseBusiness,
    MessagesSquare,
} from 'lucide-react';

const pathways = [
    {
        icon: MessagesSquare,
        eyebrow: 'Speak with confidence',
        title: 'Mandarin',
        description:
            'Practice introductions, transport, campus life, and workplace conversations while preparing for TOCFL.',
        action: 'Find your level',
        background: '#CFE8FF',
        accent: '#3B78C8',
        decoration: '你好',
    },
    {
        icon: BookOpenText,
        eyebrow: 'Make study possible',
        title: 'Scholarships',
        description:
            'Compare MOE, TaiwanICDF, and university funding routes, then organize documents and deadlines.',
        action: 'Explore funding',
        background: '#DDD4FF',
        accent: '#7059C7',
        decoration: '✦',
    },
    {
        icon: BriefcaseBusiness,
        eyebrow: 'Meet your next step',
        title: 'Career network',
        description:
            'Present your skills clearly and prepare for internships and roles across Taiwan’s industries.',
        action: 'See opportunities',
        background: '#CDEEDB',
        accent: '#27836C',
        decoration: '↗',
    },
    {
        icon: Award,
        eyebrow: 'Celebrate your growth',
        title: 'Certificates',
        description:
            'Keep verified course progress beside your language level, portfolio, and application profile.',
        action: 'Start collecting',
        background: '#FFE0C2',
        accent: '#D85E3D',
        decoration: '★',
    },
];

export default function CorePillars() {
    return (
        <section
            id="programs"
            className="relative overflow-hidden bg-white px-5 py-24"
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
                            className={`group relative min-h-[360px] overflow-hidden rounded-[2rem] p-7 shadow-[0_18px_50px_rgba(36,69,143,0.09)] transition duration-300 hover:-translate-y-2 ${index % 2 === 1 ? 'lg:translate-y-6 lg:hover:translate-y-4' : ''}`}
                            style={{ backgroundColor: pathway.background }}
                        >
                            <span
                                className="absolute -right-3 -bottom-8 font-display text-[8rem] font-black opacity-[0.08]"
                                style={{ color: pathway.accent }}
                            >
                                {pathway.decoration}
                            </span>
                            <div className="relative flex h-full flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div
                                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-sm"
                                        style={{ color: pathway.accent }}
                                    >
                                        <pathway.icon className="h-8 w-8" />
                                    </div>
                                    <span
                                        className="rounded-full bg-white/60 px-3 py-1 text-xs font-black"
                                        style={{ color: pathway.accent }}
                                    >
                                        0{index + 1}
                                    </span>
                                </div>
                                <p
                                    className="mt-8 text-sm font-extrabold"
                                    style={{ color: pathway.accent }}
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
                                    href="#courses"
                                    className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-extrabold text-[#24458F]"
                                >
                                    {pathway.action}
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/75 transition group-hover:rotate-12">
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
