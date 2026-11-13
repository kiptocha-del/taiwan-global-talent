import { Link } from '@inertiajs/react';
import student from '@/routes/student';

interface CourseCategory {
    id: number;
    name: string;
    slug: string;
}

interface NavbarProps {
    currentUrl: string;
    categories?: CourseCategory[];
    isMobile?: boolean;
    onItemClick?: () => void;
}

export default function Navbar({
    currentUrl,
    isMobile = false,
    onItemClick,
}: NavbarProps) {
    const navItems = [
        { href: student.dashboard.url(), label: 'Overview', zh: '概覽' },
        { href: student.courses.index.url(), label: 'Courses', zh: '證書' },
        { href: student.community.index.url(), label: 'Community', zh: '社群' },
        { href: student.jobs.index.url(), label: 'Job Portal', zh: '職缺' },
    ];

    const getNavClass = (path: string) => {
        const active = currentUrl.startsWith(path);

        if (isMobile) {
            // Vertical layout for the mobile hamburger menu
            return `flex items-center justify-between w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                    ? 'bg-brand-strong text-on-brand shadow-sm'
                    : 'text-muted hover:bg-surface-muted hover:text-ink'
            }`;
        }

        // Horizontal layout for desktop
        return `inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
            active
                ? 'bg-brand-strong text-on-brand shadow-sm'
                : 'text-muted hover:bg-surface-muted hover:text-ink'
        }`;
    };

    return (
        <nav
            className={
                isMobile ? 'flex flex-col gap-1' : 'flex items-center gap-2'
            }
        >
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={getNavClass(item.href)}
                >
                    <span>{item.label}</span>
                    <span
                        className={`text-[11px] font-normal ${
                            isMobile && currentUrl.startsWith(item.href)
                                ? 'text-accent-soft'
                                : 'opacity-70'
                        }`}
                    >
                        {item.zh}
                    </span>
                </Link>
            ))}
        </nav>
    );
}
