import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import { courses } from '@/routes';

export default function Hero() {
    const { t } = useTranslation();
    const titleTrail = t('hero.titleTrail');

    return (
        <section className="landing-hero relative isolate flex min-h-150 items-start overflow-hidden bg-canvas pt-10">
            <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-t from-canvas to-transparent"/>
            {/* 1. Background image (bottom layer) */}
            <img
                src="/images/landing/prof-cathy-exchange-program.webp"
                alt={t('hero.imageAlt')}
                className="absolute inset-0 -z-20 h-full w-full object-cover object-[67%_center]"
            />

            {/* 2. Gradient overlay: solid on the left, fades out to the right */}
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-canvas via-canvas/90 to-canvas/60 lg:via-canvas/85 lg:via-45% lg:to-transparent"/>

            {/* 3. Content (text on the left) */}
            <div className="relative mx-auto w-full max-w-7xl px-5 pt-24 pb-8">
                <div className="max-w-xl lg:max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.1 }}
                        className="font-display text-5xl leading-[1.02] font-black tracking-[-0.04em] text-ink sm:text-3xl lg:text-4xl"
                    >
                        {t('hero.titleLead')}{' '}
                        <span className="relative inline-block text-accent">
                            {t('hero.titleHighlight')}
                            <span className="absolute right-0 -bottom-2 left-0 -z-10 h-3 rounded-full bg-highlight/65"/>
                        </span>
                        {titleTrail && <> {titleTrail}</>}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="mt-7 max-w-xl text-lg leading-8 font-semibold text-muted"
                    >
                        {t('hero.lead')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.3 }}
                        className="mt-9 flex flex-wrap gap-3"
                    >
                        <a
                            href={courses.url()}
                            className="group inline-flex items-center rounded-full bg-brand-strong px-7 py-4 text-sm font-extrabold text-on-brand shadow-card transition hover:-translate-y-1 hover:bg-accent"
                        >
                            {t('hero.exploreCourses')}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
                        </a>
                        <a
                            href="#journey"
                            className="inline-flex items-center rounded-full border-2 border-border bg-surface/80 px-7 py-4 text-sm font-extrabold text-ink transition hover:border-brand hover:bg-surface"
                        >
                            {t('hero.startJourney')}
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
