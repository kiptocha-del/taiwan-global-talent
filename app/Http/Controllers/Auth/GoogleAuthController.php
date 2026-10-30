<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Throwable;

class GoogleAuthController extends Controller
{
    private const ALLOWED_ROLES = ['student', 'teacher', 'company'];

    public function index(): Response
    {
        return Inertia::render('Auth/LoginPage');
    }

    public function redirect(Request $request): RedirectResponse
    {
        if (! filled(config('services.google.client_id')) || ! filled(config('services.google.client_secret'))) {
            return redirect()->route('login')->with(
                'error',
                'Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the application environment.',
            );
        }

        $selectedRole = $request->query('role', 'student');

        if (! in_array($selectedRole, self::ALLOWED_ROLES, true)) {
            $selectedRole = 'student';
        }

        $request->session()->put('register_role', $selectedRole);

        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable $exception) {
            report($exception);

            return redirect()->route('login')->with(
                'error',
                'Google sign-in did not complete. Please try again.',
            );
        }

        $googleId = $googleUser->getId();
        $email = $googleUser->getEmail();
        $name = $googleUser->getName() ?: $email;
        $emailVerified = $googleUser->user['email_verified']
            ?? $googleUser->user['verified_email']
            ?? false;

        if (blank($googleId) || blank($email) || filter_var($emailVerified, FILTER_VALIDATE_BOOLEAN) !== true) {
            return redirect()->route('login')->with(
                'error',
                'Google did not return a verified email address. Please use a Google account with a verified email.',
            );
        }

        $roleName = $request->session()->pull('register_role', 'student');

        if (! in_array($roleName, self::ALLOWED_ROLES, true)) {
            $roleName = 'student';
        }

        $userByGoogleId = User::query()->where('google_id', $googleId)->first();
        $userByEmail = User::query()->where('email', $email)->first();

        if (
            ($userByGoogleId && $userByEmail && $userByGoogleId->id !== $userByEmail->id)
            || ($userByEmail && filled($userByEmail->google_id) && $userByEmail->google_id !== $googleId)
        ) {
            return redirect()->route('login')->with(
                'error',
                'This Google account cannot be linked to the existing profile. Please contact support.',
            );
        }

        $user = $userByGoogleId ?? $userByEmail;

        try {
            $user = DB::transaction(function () use ($user, $googleId, $email, $name, $googleUser, $roleName): User {
                if (! $user) {
                    $user = User::create([
                        'email' => $email,
                        'google_id' => $googleId,
                        'name' => $name,
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                } else {
                    $user->update([
                        'google_id' => $googleId,
                        'name' => $name,
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                }

                $user->forceFill([
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ])->save();

                if (! $user->roles()->exists()) {
                    $user->assignRole($roleName);
                }

                $this->createInitialProfileIfNeeded($user, $name);

                return $user;
            });
        } catch (Throwable $exception) {
            report($exception);

            return redirect()->route('login')->with(
                'error',
                'We could not finish setting up your account. Please try again.',
            );
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        return $this->redirectForRole($user);
    }

    private function createInitialProfileIfNeeded(User $user, string $name): void
    {
        if ($user->hasRole('student') && ! $user->studentProfile()->exists()) {
            $user->studentProfile()->create(['country' => 'Taiwan']);
        }

        if ($user->hasRole('teacher') && ! $user->teacherProfile()->exists()) {
            $user->teacherProfile()->create([
                'full_name' => $name,
                'status' => 'pending',
            ]);
        }
    }

    private function redirectForRole(User $user): RedirectResponse
    {
        if ($user->hasRole('student')) {
            return redirect()->route('student.dashboard');
        }

        if ($user->hasRole('company')) {
            $companyProfile = $user->companyProfile;

            if (! $companyProfile) {
                return redirect()->route('company.register');
            }

            if (in_array($companyProfile->status, ['pending', 'rejected'], true)) {
                return redirect()->route('company.waiting');
            }

            return redirect()->route('company.dashboard');
        }

        if ($user->hasRole('teacher')) {
            $teacherProfile = $user->teacherProfile;

            if (! $teacherProfile || blank($teacherProfile->cv_path)) {
                return redirect()->route('teacher.apply');
            }

            if (in_array($teacherProfile->status, ['pending', 'rejected'], true)) {
                return redirect()->route('teacher.waiting');
            }

            return redirect()->route('teacher.dashboard');
        }

        if ($user->hasRole('admin')) {
            return redirect('/admin');
        }

        return redirect()->route('home');
    }
}
