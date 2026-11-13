import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import { getInvolved } from '@/routes';
import type { PartnerLogo } from '@/types/partner';
import PartnerLogos from './PartnerLogos';

interface CompaniesProps {
    partners?: PartnerLogo[];
}

export default function Companies({ partners = [] }: CompaniesProps) {
    const { t } = useTranslation();

    return (
        <section id="companies"className="bg-canvas px-5 py-16">
            <div className="mx-auto max-w-7xl border-t border-border pt-12">
                <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
                    <div>
                        <p className="text-sm font-extrabold text-accent">
                            {t('companies.eyebrow')}
                        </p>
                        <h2 className="mt-3 font-display text-3xl leading-tight font-black text-ink md:text-4xl">
                            {t('companies.title')}
                        </h2>
                        <Link
                            href={getInvolved.url()}
                            className="mt-6 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-extrabold text-ink transition hover:text-accent"
                        >
                            {t('companies.link')}{' '}
                            <ArrowRight className="h-4 w-4"/>
                        </Link>
                    </div>

                    {partners.length > 0 ? (
                        <PartnerLogos partners={partners} compact />
                    ) : (
                        <p className="max-w-xl text-sm leading-7 font-semibold text-muted lg:justify-self-end">
                            {t('companies.empty')}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
