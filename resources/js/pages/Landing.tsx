import { useLayoutEffect } from 'react';
import Companies from '@/components/Landing/Companies';
import CTA from '@/components/Landing/CTA';
import Footer from '@/components/Landing/Footer';
import Hero from '@/components/Landing/Hero';
import HowItWorks from '@/components/Landing/HowItWorks';
import Membership from '@/components/Landing/Membership';
import Navbar from '@/components/Landing/Navbar';
import Testimonials from '@/components/Landing/Testimonials';
import CorePillars from '@/components/UI/CorePillars';

export default function Landing() {
    useLayoutEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration;
        const scrollToFirstSection = () => {
            window.scrollTo({ left: 0, top: 0, behavior: 'auto' });
        };

        window.history.scrollRestoration = 'manual';
        scrollToFirstSection();

        const firstFrame = window.requestAnimationFrame(() => {
            scrollToFirstSection();

            window.requestAnimationFrame(scrollToFirstSection);
        });
        const fallbackTimeout = window.setTimeout(scrollToFirstSection, 100);

        return () => {
            window.cancelAnimationFrame(firstFrame);
            window.clearTimeout(fallbackTimeout);
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, []);

    return (
        <div className="bg-clubhouse-cream font-sans text-clubhouse-blue antialiased selection:bg-clubhouse-yellow selection:text-clubhouse-blue">
            <Navbar />
            <Hero />
            <CorePillars />
            <HowItWorks />
            <Membership />
            <Testimonials />
            <Companies />
            <CTA />
            <Footer />
        </div>
    );
}
