import {
    ArrowRight,
    BookOpenCheck,
    FileText,
    MessageCircleQuestion,
} from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import { courses } from '@/routes';

const questions = [
    {
        icon: BookOpenCheck,
        title: 'questions.q1Title',
        description: 'questions.q1Desc',
        link: 'questions.q1Link',
        borderClass: 'border-[#FF8A65]',
    },
    {
        icon: FileText,
        title: 'questions.q2Title',
        description: 'questions.q2Desc',
        link: 'questions.q2Link',
        borderClass: 'border-[#7059C7]',
    },
    {
        icon: MessageCircleQuestion,
        title: 'questions.q3Title',
        description: 'questions.q3Desc',
        link: 'questions.q3Link',
        borderClass: 'border-[#27836C]',
    },
] as const;

export default function Testimonials() {
    const { t } = useTranslation();

    return (
        <section id="stories" className="bg-white px-5 py-28">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                    <div>
                        <p className="text-sm font-extrabold text-[#C4573C]">
                            {t('questions.eyebrow')}
                        </p>
                        <h2 className="mt-4 font-display text-4xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-5xl">
                            {t('questions.title')}
                        </h2>
                    </div>
                    <p className="max-w-2xl text-base leading-8 font-semibold text-[#24458F]/58 lg:justify-self-end">
                        {t('questions.lead')}
                    </p>
                </div>

                <div className="mt-16 grid gap-10 md:grid-cols-3">
                    {questions.map((question) => (
                        <article
                            key={question.title}
                            className={`border-t-2 pt-7 ${question.borderClass}`}
                        >
                            <question.icon className="h-7 w-7 text-[#24458F]" />
                            <h3 className="mt-6 font-display text-xl font-black text-[#24458F]">
                                {t(question.title)}
                            </h3>
                            <p className="mt-4 text-sm leading-7 font-semibold text-[#24458F]/60">
                                {t(question.description)}
                            </p>
                            <a
                                href={courses.url()}
                                className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#24458F]"
                            >
                                {t(question.link)}{' '}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
