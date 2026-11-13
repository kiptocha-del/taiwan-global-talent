import { useForm, usePage } from '@inertiajs/react';
import {
    User as UserIcon,
    FileText,
    ShieldAlert,
    Save,
    RotateCcw,
    CheckCircle2,
    Building,
    GraduationCap,
    Globe,
    Mail,
    UserCheck,
} from 'lucide-react';
import type { FormEvent } from 'react';

import CompanyNavbar from '@/components/Company/CompanyNavbar';
import Button from '@/components/UI/Button';
import InputText from '@/components/UI/InputText';
import PageHeader from '@/components/UI/PageHeader';
import TextArea from '@/components/UI/TextArea';
import CompanyFields from '../../components/Profile/CompanyFields';
import StudentFields from '../../components/Profile/StudentFields';
import TeacherFields from '../../components/Profile/TeacherFields';
import Layout from '../Student/Layout';

export default function ProfilePage() {
    const { auth, company: sharedCompany } = usePage().props as any;
    const user = auth?.user;

    // Normalisasi role
    const rawRole = user?.role_name || user?.role || 'student';
    const role = String(rawRole).toLowerCase();

    // Deteksi fleksibel objek profil dari backend
    const userProfile =
        user?.profile ??
        user?.student_profile ??
        user?.teacher_profile ??
        user?.company_profile ??
        {};

    const companyData = sharedCompany || userProfile;

    const {
        data,
        setData,
        patch,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: user?.name ?? '',
        country: userProfile.country ?? '',
        bio: userProfile.bio ?? '',

        // Student fields
        university: userProfile.university ?? '',
        major: userProfile.major ?? '',
        mandarin_level: userProfile.mandarin_level ?? '',
        toefl_score: userProfile.toefl_score ?? '',
        tocfl_score: userProfile.tocfl_score ?? '',
        skills: userProfile.skills ?? '',
        learning_goal: userProfile.learning_goal ?? '',

        // Teacher fields
        full_name: userProfile.full_name ?? '',
        phone: userProfile.phone ?? '',
        expertise: userProfile.expertise ?? '',

        // Company fields
        company_legal_name: userProfile.company_legal_name ?? '',
        company_display_name: userProfile.company_display_name ?? '',
        tax_id: userProfile.tax_id ?? '',
        website_url: userProfile.website_url ?? '',
        pic_name: userProfile.pic_name ?? '',
        pic_position: userProfile.pic_position ?? '',
        pic_phone: userProfile.pic_phone ?? '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch('/profile/update', {
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        reset();
    };

    const getRoleIcon = () => {
        switch (role) {
            case 'company':
                return (
                    <Building className="h-4 w-4 text-accent"/>
                );
            case 'teacher':
                return (
                    <UserCheck className="h-4 w-4 text-status-positive"/>
                );
            default:
                return (
                    <GraduationCap className="h-4 w-4 text-accent"/>
                );
        }
    };

    // Form Utama
    const profileForm = (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl space-y-6 pb-16"
        >
            {/* PAGE HEADER */}
            <PageHeader
                title="Account Settings"
                subtitle="Manage your personal information, profile bio, and role-specific credentials"
            />

            {/* TOP USER CARD / ACTION BAR */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-muted text-xl font-bold text-muted">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            user?.name?.charAt(0)?.toUpperCase() || 'U'
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-ink">
                                {user?.name}
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent capitalize">
                                {getRoleIcon()}
                                {role}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted">
                            {user?.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        icon={RotateCcw}
                        onClick={handleReset}
                        disabled={processing}
                    >
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        icon={Save}
                        isLoading={processing}
                    >
                        Save Profile
                    </Button>
                </div>
            </div>

            {/* SUCCESS NOTIFICATION */}
            {recentlySuccessful && (
                <div className="flex items-center gap-2 rounded-xl border border-status-positive/30 bg-status-positive-soft/80 p-4 text-xs font-medium text-status-positive">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-status-positive"/>
                    <span>Profile details updated successfully!</span>
                </div>
            )}

            {/* 1. CORE GENERAL INFORMATION */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2 border-b border-border pb-3 font-bold text-ink">
                    <UserIcon className="h-4 w-4 text-muted"/>
                    <h3>General Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputText
                        label="Display Name / Full Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <InputText
                        label="Country / Base Location"
                        placeholder="e.g., Taiwan, Indonesia"
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        error={errors.country}
                    />
                </div>
            </div>

            {/* 2. VERIFICATION STATUS & ACCOUNT HIERARCHY */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-3 font-bold text-ink">
                    <FileText className="h-4 w-4 text-muted"/>
                    <h3>Verification & Account Context</h3>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-canvas p-3.5">
                        <Mail className="h-5 w-5 text-muted"/>
                        <div>
                            <span className="text-[10px] font-bold tracking-wider text-muted uppercase">
                                Email Address
                            </span>
                            <p className="text-xs font-semibold text-ink">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-canvas p-3.5">
                        <Globe className="h-5 w-5 text-muted"/>
                        <div>
                            <span className="text-[10px] font-bold tracking-wider text-muted uppercase">
                                Platform Hierarchy
                            </span>
                            <p className="text-xs font-semibold text-accent uppercase">
                                {role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PROFESSIONAL SUMMARY / BIO */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                <div className="mb-4 border-b border-border pb-3 font-bold text-ink">
                    <h3>
                        {role === 'company'
                            ? 'Company Summary Description'
                            : 'Professional Summary / Bio'}
                    </h3>
                    <p className="mt-0.5 text-xs font-normal text-muted">
                        Write a brief introduction about your background,
                        experience, or goals.
                    </p>
                </div>

                <TextArea
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    rows={4}
                    placeholder="Write your summary here..."
                    error={errors.bio}
                />
            </div>

            {/* 4. ROLE SPECIFIC CREDENTIALS */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                <div className="mb-4 border-b border-border pb-3">
                    <div className="flex items-center gap-2 font-bold text-ink">
                        <ShieldAlert className="h-4 w-4 text-accent"/>
                        <h3 className="capitalize">
                            {role} Professional Credentials
                        </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                        Tailored profile information according to your role
                        on the platform.
                    </p>
                </div>

                {role === 'student' && (
                    <StudentFields
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                )}
                {role === 'teacher' && (
                    <TeacherFields
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                )}
                {role === 'company' && (
                    <CompanyFields
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                )}
            </div>

            {/* BOTTOM SAVE BUTTON */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={Save}
                    isLoading={processing}
                >
                    Save All Changes
                </Button>
            </div>
        </form>
    );

    // Dynamic Wrapping Layout Sesuai Role
    if (role === 'company') {
        return (
            <div className="min-h-screen bg-canvas text-ink">
                <CompanyNavbar company={companyData} />
                <main className="px-4 py-8 sm:px-6 lg:px-8">
                    {profileForm}
                </main>
            </div>
        );
    }

    // Default ke Student Layout
    return <Layout>{profileForm}</Layout>;
}