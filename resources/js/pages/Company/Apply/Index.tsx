import { Head, useForm } from '@inertiajs/react';
import {
    Building2,
    FileText,
    User,
    Briefcase,
    ImageIcon,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CompanyNavbar from '@/components/Company/CompanyNavbar';
import FileUploadDropzone from '@/components/UI/FileUploadDropzone';
import InputText from '@/components/UI/InputText';
import SelectOption from '@/components/UI/SelectOption';
import type { SelectItemOption } from '@/components/UI/SelectOption';
import TextArea from '@/components/UI/TextArea';
import { downscaleImage } from '@/utils/media.helper';

/** Logos are shown at most 96px tall, so 400px leaves room for high-density screens. */
const LOGO_MAX_SIDE = 400;

interface CompanyApplyFormState {
    // 1. Legal & Verification
    company_legal_name: string;
    tax_id: string;
    business_registration_path: File | null;

    // 2. Public Profile (Branding)
    company_display_name: string;
    organization_type: string;
    industry: string;
    website_url: string;
    founded_year: string;
    company_size: number;
    logo_path: File | null;
    banner_path: File | null;
    bio: string;
    description: string;

    // 3. PIC & Contact Details
    pic_name: string;
    pic_phone: string;
    pic_position: string;
    official_email: string;
    city: string;
    country: string;
    hq_address: string;
}

/** Text answers from an earlier, denied application, used to pre-fill the form. */
type ExistingProfile = Partial<
    Record<
        Exclude<
            keyof CompanyApplyFormState,
            'business_registration_path' | 'logo_path' | 'banner_path'
        >,
        string | number | null
    >
>;

interface ApplyProps {
    existingProfile: ExistingProfile | null;
    hasBusinessDocument: boolean;
    rejectionReason: string | null;
    organizationTypes: SelectItemOption[];
}

export default function Apply({
    existingProfile,
    hasBusinessDocument,
    rejectionReason,
    organizationTypes,
}: ApplyProps) {
    const text = (field: keyof ExistingProfile, fallback = '') =>
        String(existingProfile?.[field] ?? fallback);

    const { data, setData, post, processing, errors } =
        useForm<CompanyApplyFormState>({
            company_legal_name: text('company_legal_name'),
            tax_id: text('tax_id'),
            business_registration_path: null,

            company_display_name: text('company_display_name'),
            organization_type: text('organization_type'),
            industry: text('industry'),
            website_url: text('website_url'),
            founded_year: text('founded_year'),
            company_size: Number(existingProfile?.company_size ?? 0),
            logo_path: null,
            banner_path: null,
            bio: text('bio'),
            description: text('description'),

            pic_name: text('pic_name'),
            pic_phone: text('pic_phone'),
            pic_position: text('pic_position'),
            official_email: text('official_email'),
            city: text('city'),
            country: text('country', 'Taiwan'),
            hq_address: text('hq_address'),
        });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const handleFileChange = (
        field: keyof CompanyApplyFormState,
        file: File | null,
        setPreview?: (url: string | null) => void,
    ) => {
        setData(field, file as any);

        if (file && setPreview) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } else if (setPreview) {
            setPreview(null);
        }
    };

    const handleLogoChange = async (file: File | null) => {
        handleFileChange(
            'logo_path',
            file ? await downscaleImage(file, LOGO_MAX_SIDE) : null,
            setLogoPreview,
        );
    };

    const handleSubmit =(e: React.FormEvent) => {
        e.preventDefault();

        post(route('company.store'), { forceFormData: true });
    };

    return (
        <div className="min-h-screen bg-canvas text-ink">
            <Head title="Company Account Registration" />
            <CompanyNavbar company={null} />

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl ring-1 ring-border/5">
                    {/* Header Banner */}
                    <div className="bg-linear-to-r from-accent via-accent to-brand px-8 py-10 text-on-brand">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-surface/10 p-3 backdrop-blur-md">
                                <Building2 className="h-8 w-8 text-on-brand"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Partner & Company Application
                                </h2>
                                <p className="mt-1 text-sm text-on-brand/80">
                                    Complete your organization details once. After approval your logo joins our partners on the home page.
                                </p>
                            </div>
                        </div>
                    </div>

                    {rejectionReason && (
                        <div
                            role="alert"
                            className="mx-8 mt-8 rounded-xl border border-status-danger/30 bg-status-danger-soft p-4"
                        >
                            <h3 className="text-sm font-bold text-status-danger">
                                Your previous application was not approved
                            </h3>
                            <p className="mt-1 text-xs leading-relaxed text-status-danger">
                                {rejectionReason}
                            </p>
                            <p className="mt-2 text-xs text-status-danger">
                                Correct the details below and submit again.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10 p-8">
                        {/* SECTION 1: LEGAL & VERIFICATION */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-border pb-3">
                                <FileText className="h-5 w-5 text-accent"/>
                                <h3 className="text-lg font-semibold text-ink">
                                    1. Legal & Verification
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <InputText
                                    label="Company Name (Legal) *"
                                    required
                                    value={data.company_legal_name}
                                    onChange={(e) => setData('company_legal_name', e.target.value)}
                                    placeholder="e.g. PT Acme Indonesia Corporation"
                                    error={errors.company_legal_name}
                                />

                                <InputText
                                    label="Tax ID / NIB / Business Registration Number"
                                    value={data.tax_id}
                                    onChange={(e) => setData('tax_id', e.target.value)}
                                    placeholder="e.g. 12.345.678.9-012.000"
                                    error={errors.tax_id}
                                />
                            </div>

                            <FileUploadDropzone
                                label={
                                    hasBusinessDocument
                                        ? 'Replace Business Document (optional — your earlier upload is kept)'
                                        : 'Upload Business Document (PDF / Image) *'
                                }
                                value={data.business_registration_path}
                                onChange={(file) => setData('business_registration_path', file)}
                                accept=".pdf,image/*"
                                maxSizeMB={10}
                                error={errors.business_registration_path}
                            />
                        </div>

                        {/* SECTION 2: PUBLIC PROFILE (BRANDING) */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-border pb-3">
                                <Briefcase className="h-5 w-5 text-accent"/>
                                <h3 className="text-lg font-semibold text-ink">
                                    2. Public Profile (Branding)
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <InputText
                                    label="Public Brand Name *"
                                    required
                                    value={data.company_display_name}
                                    onChange={(e) => setData('company_display_name', e.target.value)}
                                    placeholder="e.g. Acme Studio"
                                    error={errors.company_display_name}
                                />

                                <SelectOption
                                    label="Organization Type *"
                                    required
                                    value={data.organization_type}
                                    onChange={(val) => setData('organization_type', val)}
                                    placeholderOption="Select Type"
                                    options={organizationTypes}
                                    error={errors.organization_type}
                                />

                                <SelectOption
                                    label="Industry Sector *"
                                    required
                                    value={data.industry}
                                    onChange={(val) => setData('industry', val)}
                                    placeholderOption="Select Industry"
                                    options={[
                                        { value: 'Technology / IT', label: 'Technology / IT' },
                                        { value: 'Education', label: 'Education' },
                                        { value: 'Manufacturing', label: 'Manufacturing' },
                                        { value: 'Finance', label: 'Finance' },
                                        { value: 'F&B', label: 'F&B' },
                                    ]}
                                    error={errors.industry}
                                />

                                <InputText
                                    label="Company Size (Employees) *"
                                    type="number"
                                    required
                                    min="1"
                                    value={data.company_size || ''}
                                    onChange={(e) => setData('company_size', Number(e.target.value))}
                                    placeholder="e.g. 50"
                                    error={errors.company_size}
                                />

                                <InputText
                                    label="Founded Year *"
                                    type="number"
                                    required
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    value={data.founded_year}
                                    onChange={(e) => setData('founded_year', e.target.value)}
                                    placeholder="2020"
                                    error={errors.founded_year}
                                />

                                <InputText
                                    label="Official Website"
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    placeholder="https://company.com"
                                    error={errors.website_url}
                                />

                                {/* Logo Upload Preview */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-muted">
                                        Company Logo
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-canvas">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-muted"/>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleLogoChange(
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            className="block w-full text-xs text-muted file:mr-3 file:rounded-xl file:border-0 file:bg-accent-soft file:px-3 file:py-2 file:text-xs file:font-semibold file:text-accent hover:file:bg-accent-soft"
                                        />
                                    </div>
                                    {errors.logo_path && (
                                        <p className="text-xs text-status-danger font-medium">{errors.logo_path}</p>
                                    )}
                                </div>

                                {/* Banner Upload Preview */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-muted">
                                        Company Banner
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-canvas">
                                            {bannerPreview ? (
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-muted"/>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    'banner_path',
                                                    e.target.files?.[0] || null,
                                                    setBannerPreview,
                                                )
                                            }
                                            className="block w-full text-xs text-muted file:mr-3 file:rounded-xl file:border-0 file:bg-accent-soft file:px-3 file:py-2 file:text-xs file:font-semibold file:text-accent hover:file:bg-accent-soft"
                                        />
                                    </div>
                                    {errors.banner_path && (
                                        <p className="text-xs text-status-danger font-medium">{errors.banner_path}</p>
                                    )}
                                </div>
                            </div>

                            <InputText
                                label="Tagline (Bio)"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Short catchy tagline (e.g. Innovating the future of digital tech)"
                                error={errors.bio}
                            />

                            <TextArea
                                label="Company Overview"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                placeholder="Tell us more about your company's mission, culture, and achievements..."
                                error={errors.description}
                            />
                        </div>

                        {/* SECTION 3: PIC & CONTACT DETAILS */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-border pb-3">
                                <User className="h-5 w-5 text-accent"/>
                                <h3 className="text-lg font-semibold text-ink">
                                    3. PIC & Contact Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <InputText
                                    label="PIC Full Name *"
                                    required
                                    value={data.pic_name}
                                    onChange={(e) => setData('pic_name', e.target.value)}
                                    placeholder="John Doe"
                                    error={errors.pic_name}
                                />

                                <InputText
                                    label="Phone Number *"
                                    required
                                    value={data.pic_phone}
                                    onChange={(e) => setData('pic_phone', e.target.value)}
                                    placeholder="+886 912 345 678"
                                    error={errors.pic_phone}
                                />

                                <InputText
                                    label="Position *"
                                    required
                                    value={data.pic_position}
                                    onChange={(e) => setData('pic_position', e.target.value)}
                                    placeholder="e.g. HR Manager / Director"
                                    error={errors.pic_position}
                                />

                                <InputText
                                    label="Corporate Email"
                                    type="email"
                                    value={data.official_email}
                                    onChange={(e) => setData('official_email', e.target.value)}
                                    placeholder="hr@company.com"
                                    error={errors.official_email}
                                />

                                <InputText
                                    label="City HQ"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Taipei"
                                    error={errors.city}
                                />

                                <InputText
                                    label="Country"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    error={errors.country}
                                />
                            </div>

                            <TextArea
                                label="Full Address"
                                value={data.hq_address}
                                onChange={(e) => setData('hq_address', e.target.value)}
                                rows={2}
                                placeholder="Street, Building No, Suite..."
                                error={errors.hq_address}
                            />
                        </div>

                        {/* Submit Action */}
                        <div className="border-t border-border pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-on-brand shadow-md shadow-indigo-500/20 transition-all hover:bg-accent/90 disabled:opacity-60 cursor-pointer"
                            >
                                {processing ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}