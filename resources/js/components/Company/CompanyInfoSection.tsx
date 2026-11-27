import { FileText, User, Mail } from 'lucide-react';

interface CompanyInfoSectionProps {
    company: any;
}

export default function CompanyInfoSection({ company }: CompanyInfoSectionProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column: Legal & Overview */}
            <div className="space-y-6 lg:col-span-2">
                {/* Legal & Overview Card */}
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-border pb-4">
                        <FileText className="h-5 w-5 text-accent"/>
                        <h3 className="text-sm font-bold text-ink">
                            Overview & Legal Information
                        </h3>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <span className="text-[11px] font-medium text-muted uppercase">
                                Legal Entity Name
                            </span>
                            <p className="mt-0.5 text-xs font-semibold text-ink">
                                {company.company_legal_name}
                            </p>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-muted uppercase">
                                Tax ID / NIB
                            </span>
                            <p className="mt-0.5 text-xs font-semibold text-ink">
                                {company.tax_id || '-'}
                            </p>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-muted uppercase">
                                Company Size
                            </span>
                            <p className="mt-0.5 text-xs font-semibold text-ink">
                                {company.company_size} Employees
                            </p>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-muted uppercase">
                                Founded Year
                            </span>
                            <p className="mt-0.5 text-xs font-semibold text-ink">
                                {company.founded_year || '-'}
                            </p>
                        </div>
                    </div>

                    {/* Bio & Description */}
                    <div className="mt-6 border-t border-border pt-4">
                        <span className="text-[11px] font-medium text-muted uppercase">
                            Tagline / Bio
                        </span>
                        <p className="mt-1 text-xs text-muted italic">
                            "{company.bio || 'No tagline set.'}"
                        </p>
                    </div>

                    <div className="mt-4">
                        <span className="text-[11px] font-medium text-muted uppercase">
                            Company Overview
                        </span>
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                            {company.description || 'No detailed description provided.'}
                        </p>
                    </div>
                </div>

                {/* PIC Card */}
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-border pb-4">
                        <User className="h-5 w-5 text-accent"/>
                        <h3 className="text-sm font-bold text-ink">
                            Person In Charge (PIC)
                        </h3>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <span className="text-[11px] font-medium text-muted">Name</span>
                            <p className="text-xs font-semibold text-ink">
                                {company.pic_name}
                            </p>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-muted">Position</span>
                            <p className="text-xs font-semibold text-ink">
                                {company.pic_position}
                            </p>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-muted">Phone</span>
                            <p className="text-xs font-semibold text-ink">
                                {company.pic_phone}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Contact & Location */}
            <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center gap-2 border-b border-border pb-4">
                        <Mail className="h-5 w-5 text-accent"/>
                        <h3 className="text-sm font-bold text-ink">
                            Official Contact
                        </h3>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div>
                            <span className="text-[11px] font-medium text-muted">Official Email</span>
                            <p className="text-xs font-semibold text-ink">
                                {company.official_email || '-'}
                            </p>
                        </div>
                        <div>
                            <span className="text-[11px] font-medium text-muted">HQ Address</span>
                            <p className="mt-0.5 text-xs text-muted">
                                {company.hq_address || '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}