import type { PartnerLogo } from '@/types/partner';

interface PartnerLogosProps {
    partners: PartnerLogo[];
    compact?: boolean;
}

export default function PartnerLogos({
    partners,
    compact = false,
}: PartnerLogosProps) {
    if (partners.length === 0) {
        return null;
    }

    const gridClasses = compact
        ? 'grid-cols-2 sm:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
    const cardClasses =
        'flex h-full flex-col items-center justify-center rounded-2xl px-5 py-6 text-center transition hover:-translate-y-0.5';

    return (
        <ul className={`grid gap-4 ${gridClasses}`}>
            {partners.map((partner) => {
                const content = (
                    <>
                        {partner.logo_url ? (
                            <img
                                src={partner.logo_url}
                                alt={`${partner.name} logo`}
                                loading="lazy"
                                decoding="async"
                                className="max-h-12 w-auto max-w-36 object-contain"
                            />
                        ) : (
                            <span className="font-display text-lg font-black text-ink">
                                {partner.name}
                            </span>
                        )}
                        <span className="mt-3 text-xs font-bold text-muted">
                            {partner.logo_url ? partner.name : partner.type}
                        </span>
                    </>
                );

                return (
                    <li key={partner.id}>
                        {partner.website_url ? (
                            <a
                                href={partner.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cardClasses}
                            >
                                {content}
                            </a>
                        ) : (
                            <div className={cardClasses}>{content}</div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
