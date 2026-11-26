import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    BriefcaseBusiness,
    CheckCircle2,
    GraduationCap,
    HandHeart,
    HeartHandshake,
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
    { key: 'getInvolved.how1', badgeClass: 'bg-highlight' },
    { key: 'getInvolved.how2', badgeClass: 'bg-status-positive-soft' },
    { key: 'getInvolved.how3', badgeClass: 'bg-surface-muted' },
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

    const { data, setData, post, processing, errors, reset } =
        useForm<PartnerInquiryFormState>({
            organization_name: '',
            organization_type: '',
            website_url: '',
            contact_name: '',
            contact_email: '',
            involvement_interests: [],
            message: '',
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        post(storePartnerInquiry.url(), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const startAnother = () => {
        setShowForm(true);
    };

    return (
        <div className="landing-page bg-canvas font-sans text-ink antialiased selection:bg-highlight selection:text-ink">
            <Head title={t('getInvolved.headTitle')} />
            <Navbar />

            <main>
                <section className="relative overflow-hidden px-5 pt-32 pb-16 md:pt-36 md:pb-20">
                    <div className="absolute -top-10 -left-20 h-80 w-80 rounded-full bg-highlight/35 blur-3xl"/>
                    <div className="absolute top-28 -right-28 h-96 w-96 rounded-full bg-accent-soft/70 blur-3xl"/>
                    <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-extrabold text-accent shadow-sm">
                                <HandHeart className="h-4 w-4"/>{''}
                                {t('getInvolved.badge')}
                            </span>
                            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-black tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl">
                                {t('getInvolved.title')}
                            </h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 font-semibold text-muted">
                                {t('getInvolved.lead')}
                            </p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <a
                                    href="#partner-form"
                                    className="inline-flex items-center gap-2 rounded-full bg-brand-strong px-7 py-4 text-sm font-extrabold text-on-brand shadow-card transition hover:-translate-y-1 hover:bg-accent"
                                >
                                    {t('getInvolved.shareInterest')}{' '}
                                    <ArrowRight className="h-4 w-4"/>
                                </a>
                                <Link
                                    href={login.url()}
                                    className="rounded-full border-2 border-border bg-surface/80 px-7 py-4 text-sm font-extrabold text-ink transition hover:border-brand"
                                >
                                    {t('getInvolved.employerRegister')}
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-border bg-surface/80 p-8 shadow-panel">
                            <p className="font-display text-xl font-black text-ink">
                                {t('getInvolved.howTitle')}
                            </p>
                            <ol className="mt-6 space-y-5 text-base leading-7 font-semibold text-muted">
                                {howSteps.map((step, index) => (
                                    <li key={step.key} className="flex gap-4">
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-black text-ink ${step.badgeClass}`}
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

                <section className="bg-surface px-5 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-3xl">
                            <span className="inline-flex rounded-full bg-surface-muted px-4 pt-2 pb-1 text-sm font-extrabold text-accent">
                                {t('getInvolved.whoBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-ink md:text-4xl">
                                {t('getInvolved.whoTitle')}
                            </h2>
                        </div>
                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {ways.map((way) => (
                                <article
                                    key={way.title}
                                    className={`rounded-4xl border border-border p-7 shadow-card ${way.surfaceClass}`}
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface/80 text-ink shadow-sm">
                                        <way.icon className="h-6 w-6"/>
                                    </div>
                                    <h3 className="mt-6 font-display text-2xl font-black text-ink">
                                        {t(way.title)}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 font-semibold text-muted">
                                        {t(way.description)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-canvas px-5 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="max-w-3xl">
                            <span className="inline-flex rounded-full bg-status-positive-soft px-4 pt-2 pb-1 text-sm font-extrabold text-status-positive">
                                {t('getInvolved.partnersBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-ink md:text-4xl">
                                {t('getInvolved.partnersTitle')}
                            </h2>
                        </div>
                        <div className="mt-10">
                            {partners.length > 0 ? (
                                <PartnerLogos partners={partners} />
                            ) : (
                                <p className="max-w-3xl rounded-2xl border border-dashed border-border bg-surface/60 p-6 text-sm leading-7 font-semibold text-muted">
                                    {t('getInvolved.partnersEmpty')}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section
                    id="partner-form"
                    className="scroll-mt-24 bg-surface px-5 py-20"
                >
                    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <span className="inline-flex rounded-full bg-surface-muted px-4 pt-2 pb-1 text-sm font-extrabold text-accent">
                                {t('getInvolved.formBadge')}
                            </span>
                            <h2 className="mt-5 font-display text-3xl leading-tight font-black tracking-[-0.03em] text-ink md:text-4xl">
                                {t('getInvolved.formTitle')}
                            </h2>
                            <p className="mt-5 text-base leading-8 font-semibold text-muted">
                                {t('getInvolved.formLead')}
                            </p>
                            <p className="mt-4 text-sm leading-7 font-semibold text-muted">
                                {t('getInvolved.employerNoteBefore')}{' '}
                                <Link
                                    href={login.url()}
                                    className="border-b-2 border-accent font-extrabold text-ink"
                                >
                                    {t('getInvolved.employerNoteLink')}
                                </Link>
                                {t('getInvolved.employerNoteAfter')}
                            </p>
                        </div>

                        {showForm ? (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-8 rounded-4xl border border-border bg-canvas p-7 shadow-sm md:p-10"
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
                                                            ? 'border-brand-strong bg-surface text-ink'
                                                            : 'border-border bg-surface text-muted hover:border-brand'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 accent-brand"
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
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-7 py-4 text-sm font-extrabold text-on-brand shadow-card transition hover:-translate-y-0.5 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {processing
                                        ? t('getInvolved.sending')
                                        : t('getInvolved.send')}
                                    {!processing && (
                                        <ArrowRight className="h-4 w-4"/>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="rounded-4xl border border-border bg-status-positive-soft p-8 shadow-sm md:p-10">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-status-positive">
                                    <CheckCircle2 className="h-6 w-6"/>
                                </span>
                                <h3 className="mt-5 font-display text-2xl font-black text-ink">
                                    {t('getInvolved.thanksTitle')}
                                </h3>
                                <p className="mt-3 text-base leading-7 font-semibold text-muted">
                                    {flash?.success ??
                                        t('getInvolved.thanksDefault')}
                                </p>
                                <button
                                    type="button"
                                    onClick={startAnother}
                                    className="mt-6 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-extrabold text-ink"
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
