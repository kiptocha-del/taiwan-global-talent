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
                    <Building className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                );
            case 'teacher':
                return (
                    <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                );
            default:
                return (
                    <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-xl font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
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
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                                {user?.name}
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 capitalize dark:bg-indigo-950 dark:text-indigo-300">
                                {getRoleIcon()}
                                {role}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Profile details updated successfully!</span>
                </div>
            )}

            {/* 1. CORE GENERAL INFORMATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                    <UserIcon className="h-4 w-4 text-slate-400" />
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <h3>Verification & Account Context</h3>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                        <Mail className="h-5 w-5 text-slate-400" />
                        <div>
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Email Address
                            </span>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                        <Globe className="h-5 w-5 text-slate-400" />
                        <div>
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Platform Hierarchy
                            </span>
                            <p className="text-xs font-semibold text-indigo-600 uppercase dark:text-indigo-400">
                                {role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. PROFESSIONAL SUMMARY / BIO */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 border-b border-slate-100 pb-3 font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                    <h3>
                        {role === 'company'
                            ? 'Company Summary Description'
                            : 'Professional Summary / Bio'}
                    </h3>
                    <p className="mt-0.5 text-xs font-normal text-slate-500 dark:text-slate-400">
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <ShieldAlert className="h-4 w-4 text-indigo-500" />
                        <h3 className="capitalize">
                            {role} Professional Credentials
                        </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
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