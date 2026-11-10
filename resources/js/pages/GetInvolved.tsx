import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BriefcaseBusiness,
    CheckCircle2,
    GraduationCap,
    HandHeart,
    HeartHandshake,
    ImageIcon,
    Languages,
} from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Landing/Footer';
import Navbar from '@/components/Landing/Navbar';
import PartnerLogos from '@/components/Landing/PartnerLogos';
import InputText from '@/components/UI/InputText';
import SelectOption from '@/components/UI/SelectOption';
import TextArea from '@/components/UI/TextArea';
import { useTranslation } from '@/context/LanguageContext';
import { login } from '@/routes';
import { store as storePartnerInquiry } from '@/routes/get-involved';
import type { PartnerLogo, SelectChoice } from '@/types/partner';

interface GetInvolvedProps {
    partners?: PartnerLogo[];
    organizationTypes: SelectChoice[];
    involvementInterests: SelectChoice[];
}

interface PartnerInquiryFormState {
    organization_name: string;
    organization_type: string;
    website_url: string;
    contact_name: string;
    contact_email: string;
    involvement_interests: string[];
    message: string;
    logo: File | null;
    website_confirm: string;
}

const ways = [
    {
        icon: GraduationCap,
        title: 'getInvolved.w1Title',
        description: 'getInvolved.w1Desc',
        surfaceClass: 'bg-accent-soft',
    },
    {
        icon: Languages,
        title: 'getInvolved.w2Title',
        description: 'getInvolved.w2Desc',
        surfaceClass: 'bg-status-info-soft',
    },
    {
        icon: BriefcaseBusiness,
        title: 'getInvolved.w3Title',
        description: 'getInvolved.w3Desc',
        surfaceClass: 'bg-status-warning-soft',
    },
    {
        icon: Award,
        title: 'getInvolved.w4Title',
        description: 'getInvolved.w4Desc',
        surfaceClass: 'bg-status-positive-soft',
    },
    {
        icon: HeartHandshake,
        title: 'getInvolved.w5Title',
        description: 'getInvolved.w5Desc',
        surfaceClass: 'bg-surface-muted',
    },
] as const;

const howSteps = [
    { key: 'getInvolved.how1', badgeClass: 'bg-[#FFD86B]' },
    { key: 'getInvolved.how2', badgeClass: 'bg-[#CDEEDB]' },
    { key: 'getInvolved.how3', badgeClass: 'bg-[#FFE0C2]' },
] as const;

export default function GetInvolved({
    partners = [],
    organizationTypes,
    involvementInterests,
}: GetInvolvedProps) {
    const { t } = useTranslation();
    const flash = usePage().props.flash as
        { success?: string | null } | undefined;
    const [showForm, setShowForm] = useState(!flash?.success);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } =
        useForm<PartnerInquiryFormState>({
            organization_name: '',
            organization_type: '',
            website_url: '',
            contact_name: '',
            contact_email: '',
            involvement_interests: [],
            message: '',
            logo: null,
            website_confirm: '',
        });

    const toggleInterest = (value: string) => {
        setData(
            'involvement_interests',
            data.involvement_interests.includes(value)
                ? data.involvement_interests.filter((item) => item !== value)
                : [...data.involvement_interests, value],
        );
    };

    const handleLogoChange = (file: File | null) => {
        setData('logo', file);
        setLogoPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        post(storePartnerInquiry.url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setLogoPreview(null);
                setShowForm(false);
            },
        });
    };

    const startAnother = () => {
        setShowForm(true);
    };

    return (
        <div className="landing-page bg-[#FFF8ED] font-sans text-[#24458F] antialiased selection:bg-[#FFD86B] selection:text-[#24458F]">
            <Head title={t('getInvolved.headTitle')} />
            <Navbar />

            <main>
                <section className="relative overflow-hidden px-5 pt-32 pb-16 md:pt-36 md:pb-20">
                    <div className="absolute -top-10 -left-20 h-80 w-80 rounded-full bg-[#FFD86B]/35 blur-3xl" />
                    <div className="absolute top-28 -right-28 h-96 w-96 rounded-full bg-[#CFE8FF]/70 blur-3xl" />
                    <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#C4573C] shadow-sm">
                                <HandHeart className="h-4 w-4" />{' '}
                                {t('getInvolved.badge')}
                            </span>
                            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-black tracking-[-0.04em] text-[#24458F] sm:text-5xl lg:text-6xl">
                                {t('getInvolved.title')}
                            </h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 font-semibold text-[#24458F]/66">
                                {t('getInvolved.lead')}
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <a
                                    href="#partner-form"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#24458F] px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(36,69,143,0.2)] transition hover:-translate-y-1 hover:bg-[#FF7958]"
                                >
                                    {t('getInvolved.shareInterest')}{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <Link
                                    href={login.url()}
                                    className="rounded-full border-2 border-[#24458F]/12 bg-white/80 px-7 py-4 text-sm font-extrabold text-[#24458F] transition hover:border-[#24458F]/25"
                                >
                                    {t('getInvolved.employerRegister')}
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-[#24458F]/10 bg-white/80 p-8 shadow-[0_24px_60px_rgba(36,69,143,0.12)]">
                            <p className="font-display text-xl font-black text-[#24458F]">
                                {t('getInvolved.howTitle')}
                            </p>
                            <ol className="mt-6 space-y-5 text-base leading-7 font-semibold text-[#24458F]/68">
                                {howSteps.map((step, index) => (
                                    <li key={step.key} className="flex gap-4">
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-black text-[#24458F] ${step.badgeClass}`}
                                        >
                                            {index + 1}
                                        </span>
                                        {t(step.key)}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                <section className="bg-white px-5 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-3xl">
                            <span className="inline-flex rounded-full bg-[#FFE0C2] px-4 pt-2 pb-1 text-sm font-extrabold text-[#A94A31]">
                                {t('getInvolved.whoBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-4xl">
                                {t('getInvolved.whoTitle')}
                            </h2>
                        </div>
                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {ways.map((way) => (
                                <article
                                    key={way.title}
                                    className={`rounded-4xl border border-border p-7 shadow-card ${way.surfaceClass}`}
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#24458F] shadow-sm">
                                        <way.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mt-6 font-display text-2xl font-black text-[#24458F]">
                                        {t(way.title)}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 font-semibold text-[#24458F]/64">
                                        {t(way.description)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-[#FFF8ED] px-5 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-3xl">
                            <span className="inline-flex rounded-full bg-[#CDEEDB] px-4 pt-2 pb-1 text-sm font-extrabold text-[#27705E]">
                                {t('getInvolved.partnersBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-4xl">
                                {t('getInvolved.partnersTitle')}
                            </h2>
                        </div>
                        <div className="mt-10">
                            {partners.length > 0 ? (
                                <PartnerLogos partners={partners} />
                            ) : (
                                <p className="max-w-3xl rounded-2xl border border-dashed border-[#24458F]/20 bg-white/60 p-6 text-sm leading-7 font-semibold text-[#24458F]/55">
                                    {t('getInvolved.partnersEmpty')}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    id="partner-form"
                    className="scroll-mt-24 bg-white px-5 py-20"
                >
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <span className="inline-flex rounded-full bg-[#FFE0C2] px-4 pt-2 pb-1 text-sm font-extrabold text-[#A94A31]">
                                {t('getInvolved.formBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-[#24458F] md:text-4xl">
                                {t('getInvolved.formTitle')}
                            </h2>
                            <p className="mt-5 text-base leading-8 font-semibold text-[#24458F]/65">
                                {t('getInvolved.formLead')}
                            </p>
                            <p className="mt-4 text-sm leading-7 font-semibold text-[#24458F]/55">
                                {t('getInvolved.employerNoteBefore')}{' '}
                                <Link
                                    href={login.url()}
                                    className="border-b-2 border-[#FF8A65] font-extrabold text-[#24458F]"
                                >
                                    {t('getInvolved.employerNoteLink')}
                                </Link>
                                {t('getInvolved.employerNoteAfter')}
                            </p>
                        </div>

                        {showForm ? (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-8 rounded-4xl border border-[#24458F]/10 bg-[#FFF8ED] p-7 shadow-sm md:p-10"
                                noValidate
                            >
                                <div className="grid gap-6 md:grid-cols-2">
                                    <InputText
                                        label={t('getInvolved.orgName')}
                                        required
                                        value={data.organization_name}
                                        onChange={(event) =>
                                            setData(
                                                'organization_name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'getInvolved.orgNamePlaceholder',
                                        )}
                                        error={errors.organization_name}
                                    />

                                    <SelectOption
                                        label={t('getInvolved.orgType')}
                                        required
                                        value={data.organization_type}
                                        onChange={(value) =>
                                            setData('organization_type', value)
                                        }
                                        placeholderOption={t(
                                            'getInvolved.selectType',
                                        )}
                                        options={organizationTypes}
                                        error={errors.organization_type}
                                    />

                                    <InputText
                                        label={t('getInvolved.website')}
                                        type="url"
                                        value={data.website_url}
                                        onChange={(event) =>
                                            setData(
                                                'website_url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://example.edu.tw"
                                        error={errors.website_url}
                                    />

                                    <InputText
                                        label={t('getInvolved.contactName')}
                                        required
                                        value={data.contact_name}
                                        onChange={(event) =>
                                            setData(
                                                'contact_name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'getInvolved.contactNamePlaceholder',
                                        )}
                                        error={errors.contact_name}
                                    />

                                    <InputText
                                        label={t('getInvolved.contactEmail')}
                                        type="email"
                                        required
                                        value={data.contact_email}
                                        onChange={(event) =>
                                            setData(
                                                'contact_email',
                                                event.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'getInvolved.contactEmailPlaceholder',
                                        )}
                                        error={errors.contact_email}
                                        className="md:col-span-2"
                                    />
                                </div>

                                <fieldset>
                                    <legend className="block text-xs font-semibold text-ink">
                                        {t('getInvolved.interestsLegend')}
                                    </legend>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        {involvementInterests.map((choice) => {
                                            const checked =
                                                data.involvement_interests.includes(
                                                    choice.value,
                                                );

                                            return (
                                                <label
                                                    key={choice.value}
                                                    className={`flex cursor-pointer items-center gap-3 rounded-control border px-4 py-3 text-sm font-bold transition ${
                                                        checked
                                                            ? 'border-[#24458F] bg-white text-[#24458F]'
                                                            : 'border-border bg-surface text-[#24458F]/70 hover:border-[#24458F]/40'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 accent-[#24458F]"
                                                        checked={checked}
                                                        onChange={() =>
                                                            toggleInterest(
                                                                choice.value,
                                                            )
                                                        }
                                                    />
                                                    {choice.label}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {errors.involvement_interests && (
                                        <p className="mt-2 text-xs font-medium text-status-danger">
                                            {errors.involvement_interests}
                                        </p>
                                    )}
                                </fieldset>

                                <TextArea
                                    label={t('getInvolved.message')}
                                    rows={4}
                                    value={data.message}
                                    onChange={(event) =>
                                        setData('message', event.target.value)
                                    }
                                    placeholder={t(
                                        'getInvolved.messagePlaceholder',
                                    )}
                                    error={errors.message}
                                />

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="partner-logo"
                                        className="block text-xs font-semibold text-ink"
                                    >
                                        {t('getInvolved.logoLabel')}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border bg-surface">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt={t(
                                                        'getInvolved.logoPreview',
                                                    )}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <ImageIcon className="h-6 w-6 text-muted" />
                                            )}
                                        </div>
                                        <input
                                            id="partner-logo"
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(event) =>
                                                handleLogoChange(
                                                    event.target.files?.[0] ??
                                                        null,
                                                )
                                            }
                                            className="block w-full text-xs text-muted file:mr-3 file:rounded-control file:border-0 file:bg-[#24458F] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#FF7958]"
                                        />
                                    </div>
                                    <p className="text-xs text-muted">
                                        {t('getInvolved.logoNote')}
                                    </p>
                                    {errors.logo && (
                                        <p className="text-xs font-medium text-status-danger">
                                            {errors.logo}
                                        </p>
                                    )}
                                </div>

                                <div
                                    aria-hidden="true"
                                    className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                                >
                                    <label htmlFor="website_confirm">
                                        {t('getInvolved.honeypot')}
                                    </label>
                                    <input
                                        id="website_confirm"
                                        name="website_confirm"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={data.website_confirm}
                                        onChange={(event) =>
                                            setData(
                                                'website_confirm',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#24458F] px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(36,69,143,0.18)] transition hover:-translate-y-0.5 hover:bg-[#FF7958] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {processing
                                        ? t('getInvolved.sending')
                                        : t('getInvolved.send')}
                                    {!processing && (
                                        <ArrowRight className="h-4 w-4" />
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="rounded-4xl border border-[#24458F]/10 bg-[#E7EBDD] p-8 shadow-sm md:p-10">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#27705E]">
                                    <CheckCircle2 className="h-6 w-6" />
                                </span>
                                <h3 className="mt-5 font-display text-2xl font-black text-[#24458F]">
                                    {t('getInvolved.thanksTitle')}
                                </h3>
                                <p className="mt-3 text-base leading-7 font-semibold text-[#24458F]/68">
                                    {flash?.success ??
                                        t('getInvolved.thanksDefault')}
                                </p>
                                <button
                                    type="button"
                                    onClick={startAnother}
                                    className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#FF8A65] pb-1 text-sm font-extrabold text-[#24458F]"
                                >
                                    {t('getInvolved.submitAnother')}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
