import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Heart, MapPin, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative isolate overflow-hidden bg-[#FFF8ED] pt-28">
            <div className="absolute -top-20 -left-20 -z-10 h-72 w-72 rounded-full bg-[#FFD86B]/45 blur-3xl" />
            <div className="absolute top-20 right-0 -z-10 h-96 w-96 rounded-full bg-[#CFE8FF]/70 blur-3xl" />
            <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[0.86fr_1.14fr]">
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#24458F]/10 bg-white/80 px-4 py-2 text-sm font-extrabold text-[#24458F] shadow-[0_8px_24px_rgba(36,69,143,0.08)]"
                    >
                        <Sparkles className="h-4 w-4 text-[#FF8A65]" />
                        <span className="sm:hidden">
                            Plan your future in Taiwan
                        </span>
                        <span className="hidden sm:inline">
                            Mandarin, scholarships, and careers in Taiwan
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.1 }}
                        className="mt-7 max-w-3xl font-display text-5xl leading-[1.02] font-black tracking-[-0.04em] text-[#24458F] sm:text-6xl lg:text-7xl"
                    >
                        Learn, connect, and find your path in{' '}
                        <span className="relative inline-block text-[#FF7958]">
                            Taiwan.
                            <span className="absolute right-0 -bottom-2 left-0 -z-10 h-3 rounded-full bg-[#FFD86B]/65" />
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="mt-7 max-w-xl text-lg leading-8 font-semibold text-[#24458F]/68"
                    >
                        Practice Mandarin for daily life, understand Taiwan’s
                        scholarship routes, and prepare for study or work with
                        people who know the journey.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.3 }}
                        className="mt-9 flex flex-wrap gap-3"
                    >
                        <a
                            href="#courses"
                            className="group inline-flex items-center rounded-full bg-[#24458F] px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(36,69,143,0.22)] transition hover:-translate-y-1 hover:bg-[#FF7958]"
                        >
                            Start exploring
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                        <a
                            href="#journey"
                            className="inline-flex items-center rounded-full border-2 border-[#24458F]/12 bg-white/80 px-7 py-4 text-sm font-extrabold text-[#24458F] transition hover:border-[#24458F]/25 hover:bg-white"
                        >
                            See how it works
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.4 }}
                        className="mt-9 flex flex-wrap gap-3"
                    >
                        {[
                            [BookOpen, 'TOCFL-ready learning'],
                            [Heart, 'International community'],
                            [MapPin, 'Study and work in Taiwan'],
                        ].map(([Icon, audience]) => (
                            <div
                                key={audience as string}
                                className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-2.5 text-sm font-bold text-[#24458F]/75 shadow-sm"
                            >
                                <Icon className="h-4 w-4 text-[#FF7958]" />
                                {audience as string}
                            </div>
                        ))}
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="relative"
                >
                    <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-white bg-[#CFE8FF] shadow-[0_30px_80px_rgba(36,69,143,0.18)]">
                        <img
                            src="/images/landing/cozy-taiwan-clubhouse.webp"
                            alt="A diverse group of learners studying together in a cozy Taiwan clubhouse"
                            className="aspect-[4/3] h-full w-full object-cover object-[67%_center]"
                        />
                    </div>
                    <div className="absolute -bottom-5 -left-5 rotate-[-4deg] rounded-2xl bg-[#FFD86B] px-5 py-4 font-display text-sm font-extrabold text-[#24458F] shadow-lg">
                        你好！You belong here.
                    </div>
                    <div className="absolute -top-5 -right-3 rotate-6 rounded-full bg-[#DDD4FF] p-4 text-[#24458F] shadow-lg">
                        <Sparkles className="h-6 w-6" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
