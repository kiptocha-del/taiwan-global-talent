import { Head, Link } from '@inertiajs/react';
import { Building2, ArrowRight } from 'lucide-react';
import CompanyHeaderBanner from '@/components/Company/CompanyHeaderBanner';
import CompanyInfoSection from '@/components/Company/CompanyInfoSection';
import CompanyMetrics from '@/components/Company/CompanyMetrics';
import CompanyNavbar from '@/components/Company/CompanyNavbar';
import CompanyVerificationAlert from '@/components/Company/CompanyVerificationAlert';
import type { CompanyProfile } from '@/types/company/type';

interface IndexProps {
    company: CompanyProfile | null;
}

export default function Index({ company }: IndexProps) {
    return (
        <div className="min-h-screen bg-canvas text-ink">
            <Head title="Company Dashboard" />

            <CompanyNavbar company={company} />

            <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                {!company ? (
                    <div className="overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-status-warning-soft text-status-warning">
                            <Building2 className="h-8 w-8"/>
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-ink">
                            Company Profile Not Registered
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-xs text-muted">
                            Your account is not connected to any business entity yet. Please complete your legal details to start hiring talent.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/company/apply"
                                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-semibold text-on-brand shadow-md shadow-indigo-500/20 hover:bg-accent/90"
                            >
                                Register Company Profile <ArrowRight className="h-4 w-4"/>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <CompanyHeaderBanner company={company} />

                        <CompanyVerificationAlert
                            status={company.status}
                            reason={company.rejection_reason}
                        />

                        <CompanyMetrics />

                        <CompanyInfoSection company={company} />
                    </>
                )}
            </main>
        </div>
    );
}