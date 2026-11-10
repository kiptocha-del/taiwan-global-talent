import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    HeartHandshake,
    Languages,
    Sparkles,
} from 'lucide-react';
import Footer from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';
import { useTranslation } from '@/context/LanguageContext';
import { courses, login } from '@/routes';

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
        <div className="landing-page bg-[#FFF8ED] font-sans text-[#24458F] antialiased selection:bg-[#FFD86B] selection:text-[#24458F]">
            <Head title={t('about.headTitle')} />
            <Navbar />

            <main>
                <section className="relative isolate overflow-hidden">
                    {/* Desktop: stripe (back layer) */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-y-0 right-0 hidden w-[64%] bg-linear-to-b from-[#FFE9A8] via-[#FFD86B] to-[#FF8A65] md:block"
                        style={{ clipPath: SLANT.stripe }}
                    />

                    {/* Desktop: photo (front layer) */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-y-0 right-0 hidden w-[54%] bg-[#CFE8FF] md:block"
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
                            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-black tracking-[-0.04em] text-[#24458F] sm:text-6xl lg:text-3xl">
                                {t('about.title')}
                            </h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 font-semibold text-[#24458F]/66">
                                {t('about.lead')}
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Link
                                    href={courses.url()}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#24458F] px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(36,69,143,0.2)] transition hover:-translate-y-1 hover:bg-[#FF7958]"
                                >
                                    {t('about.exploreHub')}{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={login.url()}
                                    className="rounded-full border-2 border-[#24458F]/12 bg-white/80 px-7 py-4 text-sm font-extrabold text-[#24458F] transition hover:border-[#24458F]/25"
                                >
                                    {t('about.joinCommunity')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: same two layers under the text, slanted on top */}
                    <div aria-hidden="true" className="relative h-72 md:hidden">
                        <div
                            className="absolute inset-0 bg-linear-to-b from-[#FFE9A8] to-[#FF8A65]"
                            style={{ clipPath: SLANT.stripeMobile }}
                        />
                        <div
                            className="absolute inset-0 bg-[#CFE8FF]"
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

                <section className="bg-[#edf4ff] px-5 pt-8 pb-10">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                            <div>
                                <span className="inline-flex rounded-full bg-[#CDEEDB] px-4 pt-2 pb-1 text-sm font-extrabold text-[#27705E]">
                                    {t('about.whyBadge')}
                                </span>
                                <h3 className="mt-5 font-display text-2xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-3xl">
                                    {t('about.whyTitle')}
                                </h3>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="rounded-1xl bg-[#F0F8FF] p-6 text-base leading-8 font-semibold text-[#24458F]/68 shadow-sm md:p-8">
                                    <p>{t('about.whyP1')}</p>
                                </div>
                                <div className="rounded-1xl bg-[#eef7fe] p-6 text-base leading-8 font-semibold text-[#24458F]/68 shadow-sm md:p-8">
                                    <p>{t('about.whyP2')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-2 pt-8 pb-5">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-3xl text-left">
                            <span className="inline-flex rounded-full bg-[#FFE0C2] px-4 pt-2 pb-1 text-sm font-extrabold text-[#A94A31]">
                                {t('about.valuesBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] text-[#24458F] md:text-3xl">
                                {t('about.valuesTitle')}
                            </h2>
                        </div>
                        <div className="mt-14 grid gap-6 lg:grid-cols-3">
                            {values.map((value, index) => (
                                <article
                                    key={value.title}
                                    className={`rounded-4xl border border-border p-7 shadow-card ${value.surfaceClass} ${index === 1 ? 'lg:-translate-y-5' : ''}`}
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#24458F] shadow-sm">
                                        <value.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-7 font-display text-2xl font-black text-[#24458F]">
                                        {t(value.title)}
                                    </h3>
                                    <p className="mt-4 text-sm leading-7 font-semibold text-[#24458F]/64">
                                        {t(value.description)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-[#eef7fe] px-5 py-24">
                    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-extrabold text-[#24458F]">
                                {t('about.roomBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-4xl font-black tracking-[-0.03em] text-[#24458F] md:text-3xl">
                                {t('about.roomTitle')}
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-8 font-semibold text-[#24458F]/65">
                                {t('about.roomLead')}
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {community.map((member) => (
                                <div
                                    key={member.label}
                                    className="flex items-center gap-4 rounded-3xl bg-white/75 p-5 shadow-sm"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8ED] text-[#FF7958]">
                                        <member.icon className="h-5 w-5" />
                                    </span>
                                    <span className="font-display text-lg font-black text-[#24458F]">
                                        {t(member.label)}
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
                        <h2 className="mt-4 font-display text-4xl font-black tracking-[-0.03em] md:text-3xl">
                            {t('about.ctaTitle')}
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 font-semibold text-white/70">
                            {t('about.ctaLead')}
                        </p>
                        <Link
                            href={login.url()}
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FFD86B] px-7 py-4 text-sm font-extrabold text-[#24458F] transition hover:-translate-y-1 hover:bg-white"
                        >
                            {t('about.ctaButton')}{' '}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
