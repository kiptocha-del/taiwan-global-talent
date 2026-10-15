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
import TextArea from '@/components/UI/TextArea';

interface CompanyApplyFormState {
    // 1. Legal & Verification
    company_legal_name: string;
    tax_id: string;
    business_registration_path: File | null;

    // 2. Public Profile (Branding)
    company_display_name: string;
    slug: string;
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

export default function Apply() {
    const { data, setData, post, processing, errors, reset } =
        useForm<CompanyApplyFormState>({
            company_legal_name: '',
            tax_id: '',
            business_registration_path: null,

            company_display_name: '',
            slug: '',
            industry: '',
            website_url: '',
            founded_year: '',
            company_size: 0,
            logo_path: null,
            banner_path: null,
            bio: '',
            description: '',

            pic_name: '',
            pic_phone: '',
            pic_position: '',
            official_email: '',
            city: '',
            country: 'Taiwan',
            hq_address: '',
        });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const handleDisplayNameChange = (value: string) => {
        const generatedSlug = value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setData((prevData) => ({
            ...prevData,
            company_display_name: value,
            slug: generatedSlug,
        }));
    };

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('company.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setLogoPreview(null);
                setBannerPreview(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Head title="Company Account Registration" />
            <CompanyNavbar company={null} />

            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 ring-1 ring-slate-900/5">
                    {/* Header Banner */}
                    <div className="bg-linear-to-r from-indigo-700 via-indigo-600 to-blue-600 px-8 py-10 text-white">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-white/10 p-3 backdrop-blur-md">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Company Verification Form
                                </h2>
                                <p className="mt-1 text-sm text-indigo-100">
                                    Complete your company details to apply for an official account.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10 p-8">
                        {/* SECTION 1: LEGAL & VERIFICATION */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 dark:border-slate-800">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
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
                                label="Upload Business Document (PDF / Image)"
                                value={data.business_registration_path}
                                onChange={(file) => setData('business_registration_path', file)}
                                accept=".pdf,image/*"
                                maxSizeMB={10}
                                error={errors.business_registration_path}
                            />
                        </div>

                        {/* SECTION 2: PUBLIC PROFILE (BRANDING) */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 dark:border-slate-800">
                                <Briefcase className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    2. Public Profile (Branding)
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <InputText
                                    label="Public Brand Name *"
                                    required
                                    value={data.company_display_name}
                                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                                    placeholder="e.g. Acme Studio"
                                    error={errors.company_display_name}
                                />

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        URL Slug *
                                    </label>
                                    <div className="mt-1.5 flex rounded-xl shadow-xs">
                                        <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 px-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                            /company/
                                        </span>
                                        <input
                                            type="text"
                                            required
                                            readOnly
                                            value={data.slug}
                                            className="block w-full min-w-0 flex-1 cursor-not-allowed rounded-none rounded-r-xl border border-slate-300 bg-slate-100 px-3 py-2.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 focus:outline-none"
                                            placeholder="acme-studio"
                                        />
                                    </div>
                                    {errors.slug && (
                                        <p className="mt-1 text-xs text-rose-500 font-medium">
                                            {errors.slug}
                                        </p>
                                    )}
                                </div>

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
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Company Logo
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-slate-400" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    'logo_path',
                                                    e.target.files?.[0] || null,
                                                    setLogoPreview,
                                                )
                                            }
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950 dark:file:text-indigo-400"
                                        />
                                    </div>
                                    {errors.logo_path && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.logo_path}</p>
                                    )}
                                </div>

                                {/* Banner Upload Preview */}
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Company Banner
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                            {bannerPreview ? (
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-slate-400" />
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
                                            className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950 dark:file:text-indigo-400"
                                        />
                                    </div>
                                    {errors.banner_path && (
                                        <p className="text-xs text-rose-500 font-medium">{errors.banner_path}</p>
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
                            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 dark:border-slate-800">
                                <User className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
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
                        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
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