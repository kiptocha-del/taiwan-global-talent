import { Link } from '@inertiajs/react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import { getInvolved, login } from '@/routes';

const practicalStarts = ['cta.item1', 'cta.item2', 'cta.item3'] as const;

export default function CTA() {
    const { t } = useTranslation();

    return (
        <section className="bg-white px-5 py-28">
            <div className="mx-auto grid max-w-7xl gap-12 border-y border-[#24458F]/12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
                <div>
                    <span className="flex items-center gap-2 text-sm font-extrabold text-[#C4573C]">
                        <MapPin className="h-4 w-4" /> {t('cta.eyebrow')}
                    </span>
                    <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-6xl">
                        {t('cta.title')}
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-8 font-semibold text-[#24458F]/62">
                        {t('cta.lead')}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={login.url()}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#24458F] px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(36,69,143,0.18)] transition hover:-translate-y-1 hover:bg-[#FF7958]"
                        >
                            {t('cta.createProfile')}{' '}
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={getInvolved.url()}
                            className="inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-extrabold text-[#24458F] underline decoration-[#FFD86B] decoration-4 underline-offset-4"
                        >
                            {t('cta.seePartners')}
                        </Link>
                    </div>
                </div>

                <div className="border-l-0 border-[#24458F]/12 lg:border-l lg:pl-14">
                    <p className="font-display text-xl font-black text-[#24458F]">
                        {t('cta.firstVisit')}
                    </p>
                    <ul className="mt-7 space-y-6">
                        {practicalStarts.map((item) => (
                            <li
                                key={item}
                                className="flex gap-4 text-base leading-7 font-semibold text-[#24458F]/68"
                            >
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-[#E7EBDD] text-[#27705E]">
                                    <Check className="h-4 w-4" />
                                </span>
                                {t(item)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
