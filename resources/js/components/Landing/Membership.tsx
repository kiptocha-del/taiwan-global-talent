import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Clock3, Users } from 'lucide-react';

const courses = [
    {
        title: 'Mandarin foundations for Taiwan',
        description:
            'Everyday phrases and confidence for your first weeks in Taiwan.',
        meta: 'Flexible starter',
        price: 'Free',
        color: '#CFE8FF',
        icon: '你',
    },
    {
        title: 'Scholarship planning sprint',
        description:
            'Turn confusing requirements into a calm, practical application plan.',
        meta: 'Document roadmap',
        price: 'NT$ 990',
        color: '#DDD4FF',
        icon: '✦',
    },
    {
        title: 'Taiwan interview readiness',
        description:
            'Practice your story and walk into interviews feeling prepared.',
        meta: 'Mock interview lab',
        price: 'NT$ 1,200',
        color: '#CDEEDB',
        icon: '↗',
    },
];

export default function Membership() {
    return (
        <section id="courses" className="bg-white px-5 py-24">
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
                        href="/login"
                        className="group inline-flex items-center gap-2 self-start rounded-full bg-[#24458F] px-6 py-3 text-sm font-extrabold text-white lg:self-auto"
                    >
                        See all courses{' '}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-3">
                    {courses.map((course, index) => (
                        <article
                            key={course.title}
                            className={`group rounded-[2rem] border-4 border-white p-7 shadow-[0_18px_55px_rgba(36,69,143,0.10)] ${index === 1 ? 'lg:-translate-y-4' : ''}`}
                            style={{ backgroundColor: course.color }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white font-display text-2xl font-black text-[#24458F] shadow-sm">
                                    {course.icon}
                                </span>
                                <span className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-extrabold text-[#24458F]">
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
                                    href="/login"
                                    aria-label={`Open ${course.title}`}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#24458F] transition group-hover:translate-x-1"
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
