import { useLayoutEffect } from 'react';
import Companies from '@/components/Landing/Companies';
import CTA from '@/components/Landing/CTA';
import Footer from '@/components/Landing/Footer';
import Hero from '@/components/Landing/Hero';
import HowItWorks from '@/components/Landing/HowItWorks';
import Navbar from '@/components/Landing/Navbar';
import Testimonials from '@/components/Landing/Testimonials';
import type { PartnerLogo } from '@/types/partner';

interface LandingProps {
    partners?: PartnerLogo[];
}

export default function Landing({ partners = [] }: LandingProps) {
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
        <div className="landing-page min-h-screen bg-canvas font-sans text-ink antialiased selection:bg-highlight selection:text-ink">
            <Navbar />
            <Hero />
            <HowItWorks />
            <Testimonials />
            <Companies partners={partners} />
            <CTA />
            <Footer />
        </div>
    );
}
