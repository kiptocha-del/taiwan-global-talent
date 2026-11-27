import { Head } from '@inertiajs/react';
import Footer from '@/components/Landing/Footer';
import Membership from '@/components/Landing/Membership';
import Navbar from '@/components/Landing/Navbar';
import CorePillars from '@/components/UI/CorePillars';
import { useTranslation } from '@/context/LanguageContext';

export default function Courses() {
    const { t } = useTranslation();

    return (
        <div className="landing-page min-h-screen bg-canvas font-sans text-ink antialiased selection:bg-highlight selection:text-ink">
            <Head title={t('courses.headTitle')} />
            <Navbar />
            <main className="pt-20">
                <CorePillars />
                <Membership />
            </main>
            <Footer />
        </div>
    );
}
