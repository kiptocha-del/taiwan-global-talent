import { Compass, HeartHandshake, Rocket, UserRound } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';

const steps = [
    {
        icon: UserRound,
        title: 'journey.step1Title',
        description: 'journey.step1Desc',
        backgroundClass: 'bg-accent-soft',
    },
    {
        icon: Compass,
        title: 'journey.step2Title',
        description: 'journey.step2Desc',
        backgroundClass: 'bg-status-info-soft',
    },
    {
        icon: HeartHandshake,
        title: 'journey.step3Title',
        description: 'journey.step3Desc',
        backgroundClass: 'bg-status-warning-soft',
    },
    {
        icon: Rocket,
        title: 'journey.step4Title',
        description: 'journey.step4Desc',
        backgroundClass: 'bg-status-positive-soft',
    },
] as const;

export default function HowItWorks() {
    const { t } = useTranslation();

    return (
        <section
            id="journey"
            className="relative scroll-mt-20 overflow-hidden bg-canvas px-5 py-16 md:py-20"
        >
            <div className="mx-auto max-w-7xl">
                <div className="max-w-2xl">
                    <span className="inline-flex rounded-full bg-status-positive-soft px-4 pt-2 pb-1 text-sm font-extrabold text-status-positive">
                        {t('journey.badge')}
                    </span>
                    <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-ink md:text-4xl">
                        {t('journey.title')}
                    </h2>
                    <p className="mt-4 text-lg leading-8 font-semibold text-muted">
                        {t('journey.lead')}
                    </p>
                </div>

                <div className="relative mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="absolute top-8 right-8 left-8 hidden border-t-2 border-dashed border-border lg:block"/>
                    {steps.map((step, index) => (
                        <article key={step.title} className="relative">
                            <div
                                className={`relative flex h-16 w-16 items-center justify-center rounded-2xl text-ink ${step.backgroundClass}`}
                            >
                                <step.icon className="h-7 w-7"/>
                                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-strong text-xs font-black text-on-brand">
                                    {index + 1}
                                </span>
                            </div>
                            <h3 className="mt-6 font-display text-xl font-black text-ink">
                                {t(step.title)}
                            </h3>
                            <p className="mt-3 text-base leading-7 font-semibold text-muted">
                                {t(step.description)}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
