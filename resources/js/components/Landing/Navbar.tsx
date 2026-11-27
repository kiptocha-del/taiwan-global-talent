import { Link, usePage } from '@inertiajs/react';
import { Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { about, courses, getInvolved, home, login } from '@/routes';
import ThemeToggle from '../UI/ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const currentPath = usePage().url.split(/[?#]/, 1)[0];
    const normalizePath = (path: string) =>
        path.length > 1 ? path.replace(/\/+$/, '') : path;
    const isActive = (href: string) =>
        normalizePath(currentPath) === normalizePath(href);
    const navLinkClasses = (href: string) =>
        `relative rounded-sm px-4 py-2 transition after:absolute after:right-4 after:bottom-0 after:left-4 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform ${
            isActive(href)
                ? 'text-accent after:scale-x-100'
                : 'after:scale-x-0 hover:bg-surface-muted hover:text-ink'
        }`;
    const links = [
        { label: t('nav.home'), href: home.url() },
        { label: t('nav.courses'), href: courses.url() },
        { label: t('nav.about'), href: about.url() },
        { label: t('nav.getInvolved'), href: getInvolved.url() },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border bg-canvas/92 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
                <Link href={home.url()} className="flex items-center gap-3">
                    <img
                        src="/images/logo.png"
                        alt="Taiwan Global Talent Hub"
                        className="h-14 w-14 shrink-0 object-contain"
                    />
                    <div className="hidden leading-tight sm:block">
                        <div className="font-display text-lg font-extrabold tracking-tight text-ink">
                            Taiwan Global Talent Hub
                        </div>
                        <div className="mt-0.5 text-[11px] font-bold tracking-wide text-muted">
                            {t('nav.tagline')}
                        </div>
                    </div>
                </Link>

                <div className="hidden items-center gap-1 text-sm font-bold text-ink lg:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            className={navLinkClasses(link.href)}
                            href={link.href}
                            aria-current={
                                isActive(link.href) ? 'page' : undefined
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={home.url()}
                        aria-label="Sparkles"
                        className="hidden h-11 w-11 items-center justify-center rounded-full bg-highlight text-ink transition hover:scale-105 hover:-rotate-6 sm:flex"
                    >
                        <Sparkles className="h-5 w-5"/>
                    </Link>
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Link
                        href={login.url()}
                        className="hidden items-center justify-center rounded-sm bg-brand-strong px-5 py-2.5 text-sm font-bold text-on-brand shadow-sm transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
                    >
                        {t('nav.login')}
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-sm lg:hidden"
                        aria-expanded={isOpen}
                        aria-controls="mobile-navigation"
                        aria-label={
                            isOpen ? t('nav.closeMenu') : t('nav.openMenu')
                        }
                    >
                        {isOpen ? (
                            <X className="h-5 w-5"/>
                        ) : (
                            <Menu className="h-5 w-5"/>
                        )}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-border bg-canvas px-5 py-5 shadow-card lg:hidden"
                >
                    <div className="mx-auto grid max-w-7xl gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                aria-current={
                                    isActive(link.href) ? 'page' : undefined
                                }
                                className={`relative block rounded-sm px-4 py-3 text-base font-extrabold text-ink transition after:absolute after:right-4 after:bottom-0 after:left-4 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform ${isActive(link.href) ?'text-accent after:scale-x-100':'after:scale-x-0 hover:bg-surface'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href={login.url()}
                            onClick={() => setIsOpen(false)}
                            className="mt-3 inline-flex items-center justify-center rounded-full bg-brand-strong px-6 py-3.5 text-sm font-extrabold text-on-brand"
                        >
                            {t('nav.login')}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
