import { Link } from '@inertiajs/react';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { about, courses, home, login } from '@/routes';

const siteLinks = [
    { label: 'Home', href: home.url() },
    { label: 'Courses', href: courses.url() },
    { label: 'About', href: about.url() },
];

export default function Footer() {
    return (
        <footer className="border-t border-[#24458F]/10 bg-[#FFF8ED] px-5 pt-16 pb-8">
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
                                <span className="block font-display text-xl font-black text-[#24458F]">
                                    Taiwan Global Talent Hub
                                </span>
                                <span className="mt-1 block text-xs font-bold text-[#24458F]/50">
                                    Learn. Connect. Grow.
                                </span>
                            </span>
                        </Link>
                        <p className="mt-6 max-w-lg text-sm leading-7 font-semibold text-[#24458F]/58">
                            A welcoming starting point for Mandarin learning,
                            Taiwan scholarship planning, community support, and
                            career preparation.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 text-sm font-bold text-[#24458F]/62 sm:flex-row sm:gap-6">
                            <span className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#FF7958]" />{' '}
                                Taiwan
                            </span>
                            <a
                                href="mailto:hello@taiwanglobaltalent.org"
                                className="flex items-center gap-2 hover:text-[#24458F]"
                            >
                                <Mail className="h-4 w-4 text-[#FF7958]" />{' '}
                                hello@taiwanglobaltalent.org
                            </a>
                        </div>
                    </div>

                    <nav aria-label="Footer navigation">
                        <h2 className="font-display text-sm font-black text-[#24458F]">
                            Explore
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {siteLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-semibold text-[#24458F]/58 transition hover:text-[#24458F]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className="font-display text-sm font-black text-[#24458F]">
                            Take your next step
                        </h2>
                        <p className="mt-5 text-sm leading-7 font-semibold text-[#24458F]/58">
                            Create your profile when you are ready to save
                            courses and build your Taiwan plan.
                        </p>
                        <Link
                            href={login.url()}
                            className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#FF8A65] pb-1 text-sm font-extrabold text-[#24458F]"
                        >
                            Sign in or join <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-[#24458F]/10 pt-6 text-xs font-semibold text-[#24458F]/45 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Taiwan Global Talent Hub</p>
                    <p>
                        Designed for learners, educators, and employers building
                        futures in Taiwan.
                    </p>
                </div>
            </div>
        </footer>
    );
}
