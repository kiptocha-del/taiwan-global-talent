import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { courses } from '@/routes';

export default function Hero() {
    return (
        <section className="landing-hero relative isolate flex min-h-180 items-center overflow-hidden bg-[#FFF8ED] pt-10">
            {/* 1. Background image (bottom layer) */}
            <img
                src="/images/landing/prof-cathy-exchange-program.webp"
                alt="A diverse group of learners studying together in a cozy Taiwan clubhouse"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-[67%_center]"
            />

            {/* 2. Gradient overlay: solid on the left, fades out to the right */}
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#FFF8ED] via-[#FFF8ED]/90 to-[#FFF8ED]/60 lg:via-[#FFF8ED]/85 lg:via-45% lg:to-transparent" />

            {/* 3. Content (text on the left) */}
            <div className="relative mx-auto w-full max-w-7xl px-5 py-14">
                <div className="max-w-xl lg:max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.1 }}
                        className="font-display text-5xl leading-[1.02] font-black tracking-[-0.04em] text-[#24458F] sm:text-6xl lg:text-7xl"
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
                        className="mt-7 max-w-xl text-lg leading-8 font-semibold text-[#24458F]/80"
                    >
                        We are a community for students and professionals in
                        Taiwan, who have walked the talk. Join us to study,
                        connect and grow professionally.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.3 }}
                        className="mt-9 flex flex-wrap gap-3"
                    >
                        <a
                            href={courses.url()}
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
                </div>
            </div>

            {/* 4. Floating badge on the open right side (desktop only) */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute right-10 bottom-12 hidden rotate-[-4deg] border border-[#9A6410]/20 bg-[#FFD86B] px-5 py-4 font-display text-sm font-extrabold text-[#24458F] shadow-lg lg:block"
            >
                你好！You belong here.
            </motion.div>
        </section>
    );
}
