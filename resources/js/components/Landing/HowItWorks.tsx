import { Compass, HeartHandshake, Rocket, UserRound } from 'lucide-react';

const steps = [
    {
        icon: UserRound,
        title: 'Tell us about yourself',
        description:
            'Choose whether you are preparing for study, relocation, TOCFL, or a role with a Taiwan employer.',
        backgroundClass: 'bg-accent-soft',
    },
    {
        icon: Compass,
        title: 'Learn at your own pace',
        description:
            'Work through Mandarin and preparation modules around school, work, and daily life.',
        backgroundClass: 'bg-status-info-soft',
    },
    {
        icon: HeartHandshake,
        title: 'Meet your community',
        description:
            'Ask about applications, housing, campus life, and interviews with people on a similar path.',
        backgroundClass: 'bg-status-warning-soft',
    },
    {
        icon: Rocket,
        title: 'Discover what comes next',
        description:
            'Use your progress to pursue scholarships, internships, and work opportunities across Taiwan.',
        backgroundClass: 'bg-status-positive-soft',
    },
];

export default function HowItWorks() {
    return (
        <section
    id="journey"
    className="relative scroll-mt-20 overflow-hidden bg-[#FFF8ED] px-5 py-16 md:py-20"
>
    <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-status-positive-soft px-4 pt-2 pb-1 text-sm font-extrabold text-[#27705E]">
                Your journey, your pace
            </span>
            <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-4xl">
                Your Taiwan journey starts here.
            </h2>
            <p className="mt-4 text-lg leading-8 font-semibold text-[#24458F]/75">
                From choosing a TOCFL goal to preparing a Taiwan job
                application, every stage points to a concrete next action.
            </p>
        </div>

        <div className="relative mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute top-8 right-8 left-8 hidden border-t-2 border-dashed border-[#24458F]/15 lg:block" />
            {steps.map((step, index) => (
                <article key={step.title} className="relative">
                    <div
                        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl text-[#24458F] ${step.backgroundClass}`}
                    >
                        <step.icon className="h-7 w-7" />
                        <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#24458F] text-xs font-black text-white">
                            {index + 1}
                        </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-black text-[#24458F]">
                        {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 font-semibold text-[#24458F]/75">
                        {step.description}
                    </p>
                </article>
            ))}
        </div>
    </div>
</section>
);
}
       {/* <section
            id="journey"
            className="relative overflow-hidden bg-[#FFF8ED] px-5 py-16 md:py-20"
        >
            <div className="absolute top-16 left-[8%] h-3 w-3 rounded-full bg-[#FF8A65]" />
            <div className="absolute right-[12%] bottom-20 h-5 w-5 rotate-12 rounded-md bg-[#FFD86B]" />
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                    <div>
                        <span className="inline-flex rounded-sm bg-status-positive-soft px-4 py-2 text-sm font-extrabold text-[#27705E]">
                            Your journey, your pace
                        </span>
                        <h2 className="mt-5 font-display text-4xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-6xl">
                            Your Taiwan journey starts here.
                        </h2>
                    </div>
                    <p className="max-w-2xl text-lg leading-8 font-semibold text-[#24458F]/62 lg:justify-self-end">
                        From choosing a TOCFL goal to preparing a Taiwan job
                        application, every stage points to a concrete next
                        action.
                    </p>
                </div>
                <div className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <div className="absolute top-16 right-[10%] left-[10%] hidden border-t-4 border-dashed border-[#24458F]/12 lg:block" />
                    {steps.map((step, index) => (
                        <article
                            key={step.title}
                            className={`relative border-t-2 border-[#24458F]/20 pt-7 ${index % 2 === 1 ? 'lg:mt-10' : ''} dark:border-[#f0d49b]/30`}
                        >
                            <div
                                className={`relative flex h-16 w-16 items-center justify-center rounded-sm text-[#24458F] dark:text-[#f4efe6] ${step.backgroundClass}`}
                            >
                                <step.icon className="h-7 w-7" />
                                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#24458F] text-xs font-black text-white">
                                    {index + 1}
                                </span>
                            </div>
                            <h3 className="mt-7 font-display text-xl font-black text-[#24458F]">
                                {step.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 font-semibold text-[#24458F]/64">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>*/}
        
    
