import {
    ArrowUpRight,
    Award,
    BookOpenText,
    BriefcaseBusiness,
    MessagesSquare,
} from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import { courses } from '@/routes';

const pathways = [
    {
        icon: MessagesSquare,
        eyebrow: 'pillars.p1Eyebrow',
        title: 'pillars.p1Title',
        description: 'pillars.p1Desc',
        action: 'pillars.p1Action',
        backgroundClass: 'bg-status-info-soft',
        accentClass: 'text-status-info',
        borderClass: 'border-t-status-info',
        decoration: '你好',
        image: '/images/landing/diverse-collaboration-card.jpg',
    },
    {
        icon: BookOpenText,
        eyebrow: 'pillars.p2Eyebrow',
        title: 'pillars.p2Title',
        description: 'pillars.p2Desc',
        action: 'pillars.p2Action',
        backgroundClass: 'bg-accent-soft',
        accentClass: 'text-accent',
        borderClass: 'border-t-accent',
        decoration: '✦',
        image: null,
    },
    {
        icon: BriefcaseBusiness,
        eyebrow: 'pillars.p3Eyebrow',
        title: 'pillars.p3Title',
        description: 'pillars.p3Desc',
        action: 'pillars.p3Action',
        backgroundClass: 'bg-status-positive-soft',
        accentClass: 'text-status-positive',
        borderClass: 'border-t-status-positive',
        decoration: '↗',
        image: '/images/landing/opportunity-track-card.jpg',
    },
    {
        icon: Award,
        eyebrow: 'pillars.p4Eyebrow',
        title: 'pillars.p4Title',
        description: 'pillars.p4Desc',
        action: 'pillars.p4Action',
        backgroundClass: 'bg-status-warning-soft',
        accentClass: 'text-accent',
        borderClass: 'border-t-status-warning',
        decoration: '★',
        image: null,
    },
] as const;

export default function CorePillars() {
    const { t } = useTranslation();

    return (
        <section
            id="learning-paths"
            className="relative overflow-hidden bg-surface px-5 py-16 md:py-20"
        >
            <div className="absolute top-20 -right-12 h-40 w-40 rounded-full border-28 border-highlight/35"/>
            <div className="relative mx-auto max-w-7xl">
                {/* Header: mx-auto removed so it aligns with the left edge of the cards */}
                <div className="max-w-3xl text-left">
                    <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-extrabold text-status-warning">
                        <span aria-hidden="true">✦</span> {t('pillars.badge')}
                    </span>
                    <h3 className="mt-5 font-display text-4xl leading-tight font-black tracking-[-0.03em] text-ink md:text-6xl">
                        {t('pillars.title')}
                    </h3>
                    <p className="mt-5 max-w-2xl text-base leading-8 font-semibold text-muted">
                        {t('pillars.lead')}
                    </p>
                </div>
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {pathways.map((pathway, index) => (
                        <article
                            key={pathway.title}
                            className={`group relative min-h-72 overflow-hidden rounded-md border border-t-4 border-border p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card ${pathway.backgroundClass} ${pathway.borderClass} ${index % 2 === 1 ?'lg:mt-6':''}`}
                        >
                            <span
                                className={`absolute -right-3 -bottom-8 font-display text-[8rem] font-black opacity-[0.08] ${pathway.accentClass}`}
                            >
                                {pathway.decoration}
                            </span>
                            <div className="relative flex h-full flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-sm bg-surface/85 shadow-sm ${pathway.accentClass}`}
                                    >
                                        <pathway.icon className="h-8 w-8"/>
                                    </div>
                                    {pathway.image ? (
                                        <div className="relative -rotate-2 border-4 border-surface shadow-md transition duration-300 group-hover:rotate-1">
                                            <img
                                                src={pathway.image}
                                                alt=""
                                                aria-hidden="true"
                                                loading="lazy"
                                                className="h-16 w-24 object-cover"
                                            />
                                            <span className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-strong text-xs font-black text-on-brand">
                                                0{index + 1}
                                            </span>
                                        </div>
                                    ) : (
                                        <span
                                            className={`rounded-sm bg-surface/75 px-3 py-1 text-xs font-black ${pathway.accentClass}`}
                                        >
                                            0{index + 1}
                                        </span>
                                    )}
                                </div>
                                <p
                                    className={`mt-5 text-sm font-extrabold ${pathway.accentClass}`}
                                >
                                    {t(pathway.eyebrow)}
                                </p>
                                {/* h4 instead of h3: card titles sit under the section heading */}
                                <h4 className="mt-2 font-display text-3xl font-black tracking-tight text-ink">
                                    {t(pathway.title)}
                                </h4>
                                <p className="mt-3 text-sm leading-7 font-semibold text-muted">
                                    {t(pathway.description)}
                                </p>
                                <a
                                    href={`${courses.url()}#course-list`}
                                    className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-ink"
                                >
                                    {t(pathway.action)}
                                    <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface/85 transition group-hover:-translate-y-1">
                                        <ArrowUpRight className="h-4 w-4"/>
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
