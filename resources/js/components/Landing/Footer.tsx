import { Link } from '@inertiajs/react';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import { about, courses, getInvolved, home, login } from '@/routes';

export default function Footer() {
    const { t } = useTranslation();
    const siteLinks = [
        { label: t('nav.home'), href: home.url() },
        { label: t('nav.courses'), href: courses.url() },
        { label: t('nav.about'), href: about.url() },
        { label: t('nav.getInvolved'), href: getInvolved.url() },
    ];

    return (
        <footer className="border-t border-border bg-canvas px-5 pt-16 pb-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.65fr_0.8fr]">
                    <div>
                        <Link
                            href={home.url()}
                            className="inline-flex items-center gap-4"
                        >
                            <img
                                src="/images/logo.png"
                                alt="Taiwan Global Talent Hub"
                                className="h-16 w-16 object-contain"
                            />
                            <span>
                                <span className="block font-display text-xl font-black text-ink">
                                    Taiwan Global Talent Hub
                                </span>
                                <span className="mt-1 block text-xs font-bold text-muted">
                                    {t('nav.tagline')}
                                </span>
                            </span>
                        </Link>
                        <p className="mt-6 max-w-lg text-sm leading-7 font-semibold text-muted">
                            {t('footer.description')}
                        </p>
                        <div className="mt-6 flex flex-col gap-3 text-sm font-bold text-muted sm:flex-row sm:gap-6">
                            <span className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-accent"/>{''}
                                {t('footer.location')}
                            </span>
                            <a
                                href="mailto:hello@taiwanglobaltalent.org"
                                className="flex items-center gap-2 hover:text-ink"
                            >
                                <Mail className="h-4 w-4 text-accent"/>{''}
                                hello@taiwanglobaltalent.org
                            </a>
                        </div>
                    </div>

                    <nav aria-label={t('footer.navLabel')}>
                        <h2 className="font-display text-sm font-black text-ink">
                            {t('footer.explore')}
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {siteLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-semibold text-muted transition hover:text-ink"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className="font-display text-sm font-black text-ink">
                            {t('footer.nextStep')}
                        </h2>
                        <p className="mt-5 text-sm leading-7 font-semibold text-muted">
                            {t('footer.nextStepDesc')}
                        </p>
                        <Link
                            href={login.url()}
                            className="mt-6 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-extrabold text-ink"
                        >
                            {t('footer.signIn')}{' '}
                            <ArrowUpRight className="h-4 w-4"/>
                        </Link>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs font-semibold text-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        {t('footer.copyright', {
                            year: new Date().getFullYear(),
                        })}
                    </p>
                    <p>{t('footer.designedFor')}</p>
                </div>
            </div>
        </footer>
    );
}
