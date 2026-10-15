import { Link } from '@inertiajs/react';
import { Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { about, home, login } from '@/routes';
import LoginGoogle from '../UI/LoginGoogle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinkClasses =
        'rounded-full px-4 py-2 transition hover:bg-[#FFE0C2] hover:text-[#24458F]';
    const mobileLinks = [
        { label: 'Explore pathways', href: `${home.url()}#programs` },
        { label: 'Featured courses', href: `${home.url()}#courses` },
        { label: 'Your Taiwan journey', href: `${home.url()}#journey` },
        { label: 'Community stories', href: `${home.url()}#stories` },
        { label: 'About the hub', href: about.url() },
        { label: 'Partners', href: `${home.url()}#companies` },
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
                        className={navLinkClasses}
                        href={`${home.url()}#programs`}
                    >
                        Explore
                    </Link>
                    <Link
                        className={navLinkClasses}
                        href={`${home.url()}#courses`}
                    >
                        Courses
                    </Link>
                    <Link
                        className={navLinkClasses}
                        href={`${home.url()}#journey`}
                    >
                        Your journey
                    </Link>
                    <Link
                        className={navLinkClasses}
                        href={`${home.url()}#stories`}
                    >
                        Stories
                    </Link>
                    <Link className={navLinkClasses} href={about.url()}>
                        About
                    </Link>
                    <Link
                        className={navLinkClasses}
                        href={`${home.url()}#companies`}
                    >
                        Partners
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`${home.url()}#programs`}
                        aria-label="Explore learning pathways"
                        className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#FFD86B] text-[#24458F] transition hover:scale-105 hover:-rotate-6 sm:flex"
                    >
                        <Sparkles className="h-5 w-5" />
                    </Link>
                    <div className="hidden sm:block">
                        <LoginGoogle />
                    </div>
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
                                className="rounded-xl px-4 py-3 text-base font-extrabold text-[#24458F] transition hover:bg-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href={login.url()}
                            onClick={() => setIsOpen(false)}
                            className="mt-3 inline-flex items-center justify-center rounded-full bg-[#24458F] px-6 py-3.5 text-sm font-extrabold text-white"
                        >
                            Sign in or join
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
