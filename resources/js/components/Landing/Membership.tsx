import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Clock3, Users } from 'lucide-react';
import { login } from '@/routes';

const courses = [
    {
        title: 'Mandarin foundations for Taiwan',
        description:
            'Everyday phrases and confidence for your first weeks in Taiwan.',
        meta: 'Flexible starter',
        price: 'Free',
        backgroundClass: 'bg-status-info-soft',
        icon: '你',
    },
    {
        title: 'Scholarship planning sprint',
        description:
            'Turn confusing requirements into a calm, practical application plan.',
        meta: 'Document roadmap',
        price: 'NT$ 990',
        backgroundClass: 'bg-accent-soft',
        icon: '✦',
    },
    {
        title: 'Taiwan interview readiness',
        description:
            'Practice your story and walk into interviews feeling prepared.',
        meta: 'Mock interview lab',
        price: 'NT$ 1,200',
        backgroundClass: 'bg-status-positive-soft',
        icon: '↗',
    },
];

export default function Membership() {
    return (
        <section id="course-offers" className="bg-white px-5 py-24">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFE0C2] px-4 py-2 text-sm font-extrabold text-[#A94A31]">
                            <BookOpen className="h-4 w-4" /> Learn something
                            useful
                        </span>
                        <h2 className="mt-5 font-display text-4xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-6xl">
                            Start with a course tied to a real Taiwan goal.
                        </h2>
                    </div>
                    <Link
                        href="#course-list"
                        className="group inline-flex items-center gap-2 self-start rounded-full bg-[#24458F] px-6 py-3 text-sm font-extrabold text-white lg:self-auto"
                    >
                        See all courses{' '}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                </div>

                <div
                    id="course-list"
                    className="mt-14 grid gap-6 lg:grid-cols-3"
                >
                    {courses.map((course, index) => (
                        <article
                            key={course.title}
                            className={`group rounded-md border border-t-4 border-[#31556a]/20 border-t-accent p-6 shadow-[0_12px_30px_rgba(40,45,51,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(40,45,51,0.15)] dark:border-[#f0d49b]/20 dark:border-t-[#ffc09b] ${course.backgroundClass} ${index === 1 ? 'lg:-translate-y-5' : index === 2 ? 'lg:translate-y-5' : ''}`}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-white font-display text-2xl font-black text-[#24458F] shadow-sm dark:bg-[#111820] dark:text-[#f0d49b]">
                                    {course.icon}
                                </span>
                                <span className="rounded-sm bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#24458F] dark:bg-[#111820] dark:text-[#f4efe6]">
                                    {course.price}
                                </span>
                            </div>
                            <h3 className="mt-7 font-display text-2xl font-black text-[#24458F]">
                                {course.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 font-semibold text-[#24458F]/65">
                                {course.description}
                            </p>
                            <div className="mt-7 flex items-center justify-between border-t border-[#24458F]/10 pt-5 text-xs font-extrabold text-[#24458F]/65">
                                <span className="flex items-center gap-2">
                                    <Clock3 className="h-4 w-4" />
                                    {course.meta}
                                </span>
                                <Link
                                    href={login.url()}
                                    aria-label={`Open ${course.title}`}
                                    className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-[#24458F] transition group-hover:translate-x-1 dark:bg-[#111820] dark:text-[#f0d49b]"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-[#24458F]/55">
                    <Users className="h-4 w-4 text-[#FF8A65]" /> Built for
                    international students, new graduates, and professionals
                    preparing for Taiwan.
                </div>
            </div>
        </section>
    );
}
