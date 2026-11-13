import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    Check,
    HeartHandshake,
    Languages,
    Sparkles,
} from 'lucide-react';
import Footer from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';
import { useTranslation } from '@/context/LanguageContext';
import { courses, getInvolved, login } from '@/routes';

const values = [
    {
        icon: HeartHandshake,
        title: 'about.v1Title',
        description: 'about.v1Desc',
        surfaceClass: 'bg-accent-soft',
    },
    {
        icon: BookOpen,
        title: 'about.v2Title',
        description: 'about.v2Desc',
        surfaceClass: 'bg-surface-muted',
    },
    {
        icon: Sparkles,
        title: 'about.v3Title',
        description: 'about.v3Desc',
        surfaceClass: 'bg-accent-soft',
    },
] as const;

const community = [
    { icon: Languages, label: 'about.c1' },
    { icon: BookOpen, label: 'about.c2' },
    { icon: BriefcaseBusiness, label: 'about.c3' },
    { icon: HeartHandshake, label: 'about.c4' },
] as const;

const practicalStarts = ['cta.item1', 'cta.item2', 'cta.item3'] as const;

const SLANT = {
    // desktop: a narrow colored stripe peeks out behind the photo wedge
    stripe: 'polygon(35% 0, 100% 0, 100% 100%, 11% 100%)',
    photo: 'polygon(35% 0, 100% 0, 100% 100%, 0 100%)',
    // mobile: top edge slopes up to the right
    stripeMobile: 'polygon(0 22%, 100% 6%, 100% 100%, 0 100%)',
    photoMobile: 'polygon(0 34%, 100% 18%, 100% 100%, 0 100%)',
};

export default function About() {
    const { t } = useTranslation();

    return (
        <div className="landing-page bg-canvas font-sans text-ink antialiased selection:bg-highlight selection:text-ink">
            <Head title={t('about.headTitle')} />
            <Navbar />

            <main>
                <section className="relative isolate overflow-hidden">
                    {/* Desktop: stripe (back layer) */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-y-0 right-0 hidden w-[64%] bg-linear-to-b from-surface-muted via-highlight to-accent md:block"
                        style={{ clipPath: SLANT.stripe }}
                    />

                    {/* Desktop: photo (front layer) */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-y-0 right-0 hidden w-[54%] bg-accent-soft md:block"
                        style={{ clipPath: SLANT.photo }}
                    >
                        <img
                            src="/images/landing/diverse-collaboration.png"
                            alt=""
                            className="h-full w-full object-cover object-[68%_center]"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 mx-auto flex min-h-120 max-w-7xl items-start px-5 pt-18 pb-20 md:px-16">
                        <div className="max-w-140">
                            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-black tracking-[-0.04em] text-ink sm:text-6xl lg:text-3xl">
                                {t('about.title')}
                            </h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 font-semibold text-muted">
                                {t('about.lead')}
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link
                                    href={courses.url()}
                                    className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-7 py-4 text-sm font-extrabold text-on-brand shadow-card transition hover:-translate-y-1 hover:bg-accent"
                                >
                                    {t('about.exploreHub')}{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={login.url()}
                                    className="rounded-full border-2 border-border bg-surface/80 px-7 py-4 text-sm font-extrabold text-ink transition hover:border-brand"
                                >
                                    {t('about.joinCommunity')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: same two layers under the text, slanted on top */}
                    <div aria-hidden="true" className="relative h-72 md:hidden">
                        <div
                            className="absolute inset-0 bg-linear-to-b from-surface-muted to-accent"
                            style={{ clipPath: SLANT.stripeMobile }}
                        />
                        <div
                            className="absolute inset-0 bg-accent-soft"
                            style={{ clipPath: SLANT.photoMobile }}
                        >
                            <img
                                src="/images/landing/diverse-collaboration.png"
                                alt=""
                                className="h-full w-full object-cover object-[68%_center]"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-accent-soft px-5 pt-8 pb-10">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                            <div>
                                <span className="inline-flex rounded-full bg-status-positive-soft px-4 pt-2 pb-1 text-sm font-extrabold text-status-positive">
                                    {t('about.whyBadge')}
                                </span>
                                <h3 className="mt-5 font-display text-2xl leading-tight font-black tracking-[-0.03em] text-ink md:text-3xl">
                                    {t('about.whyTitle')}
                                </h3>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="rounded-1xl bg-accent-soft p-6 text-base leading-8 font-semibold text-muted shadow-sm md:p-8">
                                    <p>{t('about.whyP1')}</p>
                                </div>
                                <div className="rounded-1xl bg-accent-soft p-6 text-base leading-8 font-semibold text-muted shadow-sm md:p-8">
                                    <p>{t('about.whyP2')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-2 pt-8 pb-5">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-3xl text-left">
                            <span className="inline-flex rounded-full bg-surface-muted px-4 pt-2 pb-1 text-sm font-extrabold text-accent">
                                {t('about.valuesBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] text-ink md:text-3xl">
                                {t('about.valuesTitle')}
                            </h2>
                        </div>
                        <div className="mt-14 grid gap-6 lg:grid-cols-3">
                            {values.map((value, index) => (
                                <article
                                    key={value.title}
                                    className={`rounded-4xl border border-border p-7 shadow-card ${value.surfaceClass} ${index === 1 ? 'lg:-translate-y-5' : ''}`}
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface/80 text-ink shadow-sm">
                                        <value.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-7 font-display text-2xl font-black text-ink">
                                        {t(value.title)}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 font-semibold text-muted">
                                        {t(value.description)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-accent-soft px-5 py-24">
                    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <span className="inline-flex rounded-full bg-surface/70 px-4 py-2 text-sm font-extrabold text-ink">
                                {t('about.roomBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] text-ink md:text-3xl">
                                {t('about.roomTitle')}
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-8 font-semibold text-muted">
                                {t('about.roomLead')}
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {community.map((member) => (
                                <div
                                    key={member.label}
                                    className="flex items-center gap-4 rounded-3xl bg-surface/75 p-5 shadow-sm"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-accent">
                                        <member.icon className="h-5 w-5" />
                                    </span>
                                    <span className="font-display text-lg font-black text-ink">
                                        {t(member.label)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-surface px-5 py-24">
                    <div className="mx-auto grid max-w-7xl gap-12 border-y border-border py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 pt-2 pb-1 text-sm font-extrabold text-accent">
                                <Sparkles
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                {t('about.ctaBadge')}
                            </span>
                            <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight font-black tracking-[-0.03em] text-ink md:text-5xl">
                                {t('about.ctaTitle')}
                            </h2>
                            <p className="mt-6 max-w-xl text-base leading-8 font-semibold text-muted">
                                {t('about.ctaLead')}
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={login.url()}
                                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-strong px-7 py-4 text-sm font-extrabold text-on-brand shadow-card transition hover:-translate-y-1 hover:bg-accent"
                                >
                                    {t('about.ctaButton')}{' '}
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href={getInvolved.url()}
                                    className="inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-extrabold text-ink underline decoration-highlight decoration-4 underline-offset-4"
                                >
                                    {t('cta.seePartners')}
                                </Link>
                            </div>
                        </div>

                        <div className="border-l-0 border-border lg:border-l lg:pl-14">
                            <p className="font-display text-xl font-black text-ink">
                                {t('cta.firstVisit')}
                            </p>
                            <ul className="mt-7 space-y-6">
                                {practicalStarts.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-4 text-base leading-7 font-semibold text-muted"
                                    >
                                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-status-positive-soft text-status-positive">
                                            <Check className="h-4 w-4" />
                                        </span>
                                        {t(item)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
