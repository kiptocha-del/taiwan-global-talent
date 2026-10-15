import {
    ArrowRight,
    BookOpenCheck,
    FileText,
    MessageCircleQuestion,
} from 'lucide-react';

const questions = [
    {
        icon: BookOpenCheck,
        title: 'How should I prepare for TOCFL?',
        description:
            'Build a study rhythm around the vocabulary and situations you will actually meet on campus, at work, and around town.',
        link: 'Explore Mandarin learning',
    },
    {
        icon: FileText,
        title: 'Which scholarship documents come first?',
        description:
            'Organize transcripts, recommendations, language proof, and application dates for MOE, TaiwanICDF, and university routes.',
        link: 'Understand scholarship paths',
    },
    {
        icon: MessageCircleQuestion,
        title: 'What do Taiwan employers need to see?',
        description:
            'Prepare a clear profile, explain your skills across cultures, and understand expectations before an internship or interview.',
        link: 'Prepare for opportunities',
    },
];

export default function Testimonials() {
    return (
        <section id="stories" className="bg-white px-5 py-28">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                    <div>
                        <p className="text-sm font-extrabold text-[#C4573C]">
                            Questions worth asking
                        </p>
                        <h2 className="mt-4 font-display text-4xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-5xl">
                            Practical guidance for decisions people face in
                            Taiwan.
                        </h2>
                    </div>
                    <p className="max-w-2xl text-base leading-8 font-semibold text-[#24458F]/58 lg:justify-self-end">
                        The community space is designed around specific
                        questions—not generic inspiration. Verified learner
                        stories can be added here once participants approve
                        their words and images.
                    </p>
                </div>

                <div className="mt-16 grid gap-10 md:grid-cols-3">
                    {questions.map((question, index) => (
                        <article
                            key={question.title}
                            className={`border-t-2 pt-7 ${index === 0 ? 'border-[#FF8A65]' : index === 1 ? 'border-[#7059C7]' : 'border-[#27836C]'}`}
                        >
                            <question.icon className="h-7 w-7 text-[#24458F]" />
                            <h3 className="mt-6 font-display text-xl font-black text-[#24458F]">
                                {question.title}
                            </h3>
                            <p className="mt-4 text-sm leading-7 font-semibold text-[#24458F]/60">
                                {question.description}
                            </p>
                            <a
                                href="#programs"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#24458F]"
                            >
                                {question.link}{' '}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
