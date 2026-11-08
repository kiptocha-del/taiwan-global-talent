import { Link, usePage } from '@inertiajs/react';
import { Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { about, courses, getInvolved, home, login } from '@/routes';
import ThemeToggle from '../UI/ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
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
                : 'after:scale-x-0 hover:bg-[#FFE0C2] hover:text-[#24458F]'
        }`;
    const mobileLinks = [
        { label: 'Home', href: home.url() },
        { label: 'Courses', href: courses.url() },
        { label: 'About', href: about.url() },
        { label: 'Get Involved', href: getInvolved.url() },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-[#24458F]/8 bg-[#FFF8ED]/92 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
                <Link href={home.url()} className="flex items-center gap-3">
                    <img
                        src="/images/logo.png"
                        alt="Taiwan Global Talent Hub"
                        className="h-14 w-14 shrink-0 object-contain"
                    />
                    <div className="hidden leading-tight sm:block">
                        <div className="font-display text-lg font-extrabold tracking-tight text-[#24458F]">
                            Taiwan Global Talent Hub
                        </div>
                        <div className="mt-0.5 text-[11px] font-bold tracking-wide text-[#24458F]/55">
                            Learn. Connect. Grow.
                        </div>
                    </div>
                </Link>

                <div className="hidden items-center gap-1 text-sm font-bold text-[#24458F] lg:flex">
                    <Link
                        className={navLinkClasses(home.url())}
                        href={home.url()}
                        aria-current={isActive(home.url()) ? 'page' : undefined}
                    >
                        Home
                    </Link>
                    <Link
                        className={navLinkClasses(courses.url())}
                        href={courses.url()}
                        aria-current={
                            isActive(courses.url()) ? 'page' : undefined
                        }
                    >
                        Courses
                    </Link>
                    <Link
                        className={navLinkClasses(about.url())}
                        href={about.url()}
                        aria-current={
                            isActive(about.url()) ? 'page' : undefined
                        }
                    >
                        About
                    </Link>
                    <Link
                        className={navLinkClasses(getInvolved.url())}
                        href={getInvolved.url()}
                        aria-current={
                            isActive(getInvolved.url()) ? 'page' : undefined
                        }
                    >
                        Get Involved
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={home.url()}
                        aria-label="Sparkles"
                        className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#FFD86B] text-[#24458F] transition hover:scale-105 hover:-rotate-6 sm:flex"
                    >
                        <Sparkles className="h-5 w-5" />
                    </Link>
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <Link
                        href={login.url()}
                        className="hidden items-center justify-center rounded-sm bg-[#24458F] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#FF7958] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24458F] sm:inline-flex dark:hover:bg-[#f0c975] dark:hover:text-[#262018]"
                    >
                        Login
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#24458F]/10 bg-white text-[#24458F] shadow-sm lg:hidden"
                        aria-expanded={isOpen}
                        aria-controls="mobile-navigation"
                        aria-label={
                            isOpen
                                ? 'Close navigation menu'
                                : 'Open navigation menu'
                        }
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-[#24458F]/8 bg-[#FFF8ED] px-5 py-5 shadow-[0_18px_40px_rgba(36,69,143,0.12)] lg:hidden"
                >
                    <div className="mx-auto grid max-w-7xl gap-1">
                        {mobileLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                aria-current={
                                    isActive(link.href) ? 'page' : undefined
                                }
                                className={`relative block rounded-sm px-4 py-3 text-base font-extrabold text-[#24458F] transition after:absolute after:right-4 after:bottom-0 after:left-4 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform ${isActive(link.href) ? 'text-accent after:scale-x-100' : 'after:scale-x-0 hover:bg-white'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href={login.url()}
                            onClick={() => setIsOpen(false)}
                            className="mt-3 inline-flex items-center justify-center rounded-full bg-[#24458F] px-6 py-3.5 text-sm font-extrabold text-white"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
