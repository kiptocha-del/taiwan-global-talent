import { usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Building2,
    GraduationCap,
    ShieldCheck,
    UserCog,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import ThemeToggle from '@/components/UI/ThemeToggle';

interface RoleOption {
    id: 'student' | 'teacher' | 'company' | 'admin';
    label: string;
    desc: string;
    icon: typeof GraduationCap;
    goal: string;
}

const roles: RoleOption[] = [
    {
        id: 'student',
        label: 'Student',
        desc: 'Learn Mandarin, build a profile, and discover opportunities.',
        icon: GraduationCap,
        goal: 'Study, career, and relocation pathways',
    },
    {
        id: 'teacher',
        label: 'Teacher',
        desc: 'Support learners with courses, mentoring, and skill building.',
        icon: BriefcaseBusiness,
        goal: 'Course delivery and learner progress',
    },
    {
        id: 'company',
        label: 'Company',
        desc: 'Find prepared international talent for Taiwan-based roles.',
        icon: Building2,
        goal: 'Recruitment and verified talent matching',
    },
    {
        id: 'admin',
        label: 'Admin',
        desc: 'Manage platform operations, approvals, and content.',
        icon: UserCog,
        goal: 'Secure platform administration',
    },
];

/* ------------------------------------------------------------------ */
/* Friendly messages. Edit the wording here, in one place. */
/* ------------------------------------------------------------------ */
const MESSAGES = {
    wrongCredentials: 'Incorrect email or password.',
    sessionExpired:
        'Your session has expired. Please refresh the page and try again.',
    tooManyAttempts: 'Too many attempts. Please wait a moment and try again.',
    serverProblem:
        'Something went wrong on our side. Please try again in a moment.',
    network:
        'We couldn’t reach the server. Please check your connection and try again.',
};

// Turn an HTTP status code into a message a person can understand.
function messageForStatus(status: number): string {
    if (status === 419) {
        return MESSAGES.sessionExpired;
    }

    if (status === 429) {
        return MESSAGES.tooManyAttempts;
    }

    if (status >= 500 || (status >= 200 && status < 300)) {
        return MESSAGES.serverProblem;
    }

    // Any other failure (401, 422, ...) means the sign-in details were rejected.
    return MESSAGES.wrongCredentials;
}

// Small inline notice shown above the inputs / the Google button.
function ErrorNotice({ message }: { message: string }) {
    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-md border border-status-danger/30 bg-status-danger-soft px-4 py-3 text-sm font-semibold text-status-danger"
        >
            <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-danger text-xs font-black text-on-brand"
            >
                !
            </span>
            <p>{message}</p>
        </div>
    );
}

const LoginPage = () => {
    const { props } = usePage();
    const flashError = (
        props as typeof props & {
            flash?: {
                error?: string | null;
            };
        }
    ).flash?.error;
    const [selectedRole, setSelectedRole] =
        useState<RoleOption['id']>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedRoleDetails =
        roles.find((role) => role.id === selectedRole) ?? roles[0];

    const loginWithGoogle = () => {
        window.location.href = `/auth/google?role=${selectedRole}`;
    };

    const handleAdminLogin = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email, password }),
            });

            const contentType = response.headers.get('content-type');
            const isJson = !!contentType?.includes('application/json');

            if (response.ok && isJson) {
                const data = await response.json();

                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                window.location.href = '/admin';

                return;
            }

            // Keep technical details in the console for you, not on screen.
            console.error('Admin login failed with status', response.status);
            setFormError(messageForStatus(response.status));
        } catch (error) {
            console.error('Failed to connect to the Laravel backend', error);
            setFormError(MESSAGES.network);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasFormError = formError !== null;

    return (
        <main className="relative min-h-screen bg-canvas px-4 py-8 text-ink sm:px-6 lg:px-8">
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>
            {/* lg:max-h removed: it clipped the form on shorter screens */}
            <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-panel border border-border bg-surface shadow-panel lg:grid-cols-[0.95fr_1.05fr]">
                <section className="relative hidden overflow-hidden bg-brand-strong p-10 text-on-brand lg:block">
                    <img
                        src="/images/landing/yilan-county.webp"
                        alt="Collaborators team building in Yilan County"
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.72] saturate-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-strong/80 to-brand-strong/30"/>
                    <div className="relative flex h-full flex-col justify-between">
                        <div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-surface p-1.5 shadow-sm">
                                <img
                                    src="/images/logo.png"
                                    alt="Taiwan Global Talent hub"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <h1 className="mt-8 max-w-lg text-5xl leading-tight font-black tracking-tight">
                                One platform for learning, opportunity, and
                                career mobility.
                            </h1>
                            <p className="mt-5 max-w-md text-base leading-8 font-semibold text-on-brand/72">
                                Designed for different goals and life stages,
                                from first-time applicants to working
                                professionals preparing for Taiwan.
                            </p>
                        </div>
                    </div>
                </section>

                {/* my-auto on the child (instead of items-center on the parent)
                    keeps the form centered but still scrollable when it is tall */}
                <section className="flex p-6 sm:p-10">
                    <div className="mx-auto my-auto w-full max-w-xl">
                        <div className="mb-8">
                            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                                Continue with the role that fits your goal.
                            </h2>
                            <p className="mt-3 text-sm leading-7 font-semibold text-muted">
                                Choose your role first so the platform can show
                                relevant pathways, dashboards, and next steps.
                            </p>
                        </div>

                        <fieldset>
                            <legend className="sr-only">
                                Select account role
                            </legend>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedRole(role.id);
                                            setFormError(null);
                                        }}
                                        aria-pressed={selectedRole === role.id}
                                        className={`min-h-32 rounded-md border p-4 text-left transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                                            selectedRole === role.id
                                                ? 'border-brand-strong bg-brand-strong text-on-brand shadow-card'
                                                : 'border-border bg-surface text-ink hover:border-brand hover:bg-canvas'
                                        }`}
                                    >
                                        <role.icon
                                            className={`h-6 w-6 ${
                                                selectedRole === role.id
                                                    ? 'text-accent'
                                                    : 'text-brand-strong'
                                            }`}
                                        />
                                        <span className="mt-3 block text-base font-black">
                                            {role.label}
                                        </span>
                                        <span
                                            className={`mt-1 block text-xs leading-5 font-semibold ${
                                                selectedRole === role.id
                                                    ? 'text-on-brand/72'
                                                    : 'text-muted'
                                            }`}
                                        >
                                            {role.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        {selectedRole === 'admin' ? (
                            <form
                                onSubmit={handleAdminLogin}
                                className="mt-6 space-y-4"
                                noValidate={false}
                            >
                                {/* Error sits above the inputs */}
                                {formError && (
                                    <ErrorNotice message={formError} />
                                )}

                                <div>
                                    <label
                                        htmlFor="admin-email"
                                        className="mb-1 block text-xs font-black tracking-wide text-muted uppercase"
                                    >
                                        Admin email
                                    </label>
                                    <input
                                        id="admin-email"
                                        type="email"
                                        required
                                        value={email}
                                        aria-invalid={hasFormError}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setFormError(null);
                                        }}
                                        placeholder="admin@taiwanglobal.com"
                                        className={`min-h-12 w-full rounded-md border px-4 text-sm focus:ring-2 focus:outline-none ${
                                            hasFormError
                                                ? 'border-status-danger focus:border-status-danger focus:ring-status-danger/20'
                                                : 'border-border focus:border-accent focus:ring-accent/20'
                                        }`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="admin-password"
                                        className="mb-1 block text-xs font-black tracking-wide text-muted uppercase"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="admin-password"
                                        type="password"
                                        required
                                        value={password}
                                        aria-invalid={hasFormError}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setFormError(null);
                                        }}
                                        placeholder="Enter your password"
                                        className={`min-h-12 w-full rounded-md border px-4 text-sm focus:ring-2 focus:outline-none ${
                                            hasFormError
                                                ? 'border-status-danger focus:border-status-danger focus:ring-status-danger/20'
                                                : 'border-border focus:border-accent focus:ring-accent/20'
                                        }`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-h-12 w-full rounded-md bg-brand-strong px-5 text-sm font-black text-on-brand transition hover:bg-brand focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting
                                        ? 'Signing in…'
                                        : 'Sign in as Admin'}
                                </button>
                            </form>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {/* Server-side (Google) errors sit above the button */}
                                {flashError && (
                                    <ErrorNotice message={flashError} />
                                )}

                                <button
                                    type="button"
                                    onClick={loginWithGoogle}
                                    className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-5 text-sm font-black text-ink shadow-sm transition hover:border-brand hover:bg-canvas focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google as{' '}
                                    {selectedRoleDetails.label}
                                </button>
                            </div>
                        )}

                        <div className="mt-6 flex items-start gap-3 rounded-md bg-canvas p-4 text-xs leading-6 text-muted">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-status-positive"/>
                            <p>
                                We use your role and profile information to
                                personalize pathways, job matching, events, and
                                account services. You can update your profile
                                after signing in.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default LoginPage;
{
    /*
import { usePage } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Building2,
    GraduationCap,
    ShieldCheck,
    UserCog,
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '@/components/UI/ThemeToggle';

interface RoleOption {
    id: 'student' | 'teacher' | 'company' | 'admin';
    label: string;
    desc: string;
    icon: typeof GraduationCap;
    goal: string;
}

const roles: RoleOption[] = [
    {
        id: 'student',
        label: 'Student',
        desc: 'Learn Mandarin, build a profile, and discover opportunities.',
        icon: GraduationCap,
        goal: 'Study, career, and relocation pathways',
    },
    {
        id: 'teacher',
        label: 'Teacher',
        desc: 'Support learners with courses, mentoring, and skill building.',
        icon: BriefcaseBusiness,
        goal: 'Course delivery and learner progress',
    },
    {
        id: 'company',
        label: 'Company',
        desc: 'Find prepared international talent for Taiwan-based roles.',
        icon: Building2,
        goal: 'Recruitment and verified talent matching',
    },
    {
        id: 'admin',
        label: 'Admin',
        desc: 'Manage platform operations, approvals, and content.',
        icon: UserCog,
        goal: 'Secure platform administration',
    },
];

const LoginPage = () => {
    const { props } = usePage();
    const flashError = (
        props as typeof props & {
            flash?: {
                error?: string | null;
            };
        }
    ).flash?.error;
    const [selectedRole, setSelectedRole] =
        useState<RoleOption['id']>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const selectedRoleDetails =
        roles.find((role) => role.id === selectedRole) ?? roles[0];

    const loginWithGoogle = () => {
        window.location.href = `/auth/google?role=${selectedRole}`;
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/login-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email, password }),
            });

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.indexOf('application/json') !== -1) {
                const data = await response.json();

                if (response.ok) {
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                    }

                    window.location.href = '/admin';
                } else {
                    alert(data.message || 'Login failed.');
                }
            } else {
                const textError = await response.text();
                console.error('Laravel Error HTML:', textError);
                alert(
                    'An internal server error occurred. Please check the Laravel logs.',
                );
            }
        } catch (error) {
            console.error('Failed to connect to the Laravel backend', error);
        }
    };

    return (
        <main className="relative min-h-screen bg-canvas px-4 py-8 text-ink sm:px-6 lg:px-8">
            <div className="absolute top-4 right-4 z-20">
                <ThemeToggle />
            </div>
           <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-panel border border-border bg-surface shadow-panel lg:grid-cols-[0.95fr_1.05fr]">
                <section className="relative hidden overflow-hidden bg-brand-strong p-10 text-on-brand lg:block">
                    <img
                        src="/images/landing/yilan-county.webp"
                        alt="Collaborators team building in Yilan County"
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.72] saturate-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-strong/80 to-brand-strong/30"/>
                    <div className="relative flex h-full flex-col justify-between">
                        <div>
                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-surface p-1.5 shadow-sm">
                                <img
                                    src="/images/logo.png"
                                    alt="Taiwan Global Talent hub"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <h1 className="mt-8 max-w-lg text-5xl leading-tight font-black tracking-tight">
                                One platform for learning, opportunity, and
                                career mobility.
                            </h1>
                            <p className="mt-5 max-w-md text-base leading-8 font-semibold text-on-brand/72">
                                Designed for different goals and life stages,
                                from first-time applicants to working
                                professionals preparing for Taiwan.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center p-6 sm:p-10">
                    <div className="mx-auto w-full max-w-xl">
                        <div className="mb-8">
                            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                                Continue with the role that fits your goal.
                            </h2>
                            <p className="mt-3 text-sm leading-7 font-semibold text-muted">
                                Choose your role first so the platform can show
                                relevant pathways, dashboards, and next steps.
                            </p>
                        </div>

                        {flashError && (
                            <div
                                role="alert"
                                className="mb-6 rounded-md border border-status-danger/30 bg-status-danger-soft px-4 py-3 text-sm font-semibold text-status-danger"
                            >
                                {flashError}
                            </div>
                        )}

                        <fieldset>
                            <legend className="sr-only">
                                Select account role
                            </legend>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        aria-pressed={selectedRole === role.id}
                                        className={`min-h-32 rounded-md border p-4 text-left transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                                            selectedRole === role.id
                                                ? 'border-brand-strong bg-brand-strong text-on-brand shadow-card'
                                                : 'border-border bg-surface text-ink hover:border-brand hover:bg-canvas'
                                        }`}
                                    >
                                        <role.icon
                                            className={`h-6 w-6 ${
                                                selectedRole === role.id
                                                    ? 'text-accent'
                                                    : 'text-brand-strong'
                                            }`}
                                        />
                                        <span className="mt-3 block text-base font-black">
                                            {role.label}
                                        </span>
                                        <span
                                            className={`mt-1 block text-xs leading-5 font-semibold ${
                                                selectedRole === role.id
                                                    ? 'text-on-brand/72'
                                                    : 'text-muted'
                                            }`}
                                        >
                                            {role.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        {selectedRole === 'admin' ? (
                            <form
                                onSubmit={handleAdminLogin}
                                className="mt-6 space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="admin-email"
                                        className="mb-1 block text-xs font-black tracking-wide text-muted uppercase"
                                    >
                                        Admin email
                                    </label>
                                    <input
                                        id="admin-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="admin@taiwanglobal.com"
                                        className="min-h-12 w-full rounded-md border border-border px-4 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="admin-password"
                                        className="mb-1 block text-xs font-black tracking-wide text-muted uppercase"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="admin-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        className="min-h-12 w-full rounded-md border border-border px-4 text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="min-h-12 w-full rounded-md bg-brand-strong px-5 text-sm font-black text-on-brand transition hover:bg-brand focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
                                >
                                    Sign in as Admin
                                </button>
                            </form>
                        ) : (
                            <div className="mt-6 space-y-4">
                                <button
                                    type="button"
                                    onClick={loginWithGoogle}
                                    className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-5 text-sm font-black text-ink shadow-sm transition hover:border-brand hover:bg-canvas focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google as{' '}
                                    {selectedRoleDetails.label}
                                </button>
                            </div>
                        )}

                        <div className="mt-6 flex items-start gap-3 rounded-md bg-canvas p-4 text-xs leading-6 text-muted">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-status-positive"/>
                            <p>
                                We use your role and profile information to
                                personalize pathways, job matching, events, and
                                account services. You can update your profile
                                after signing in.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default LoginPage;
*/
}
