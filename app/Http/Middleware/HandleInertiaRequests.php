<?php

namespace App\Http\Middleware;

use App\Models\CourseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => SetLocale::currentLanguage(),

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            'auth' => [
                'user' => function () use ($request) {
                    $user = $request->user();

                    if (! $user) {
                        return null;
                    }

                    // Load the Spatie roles once to avoid N+1 queries
                    $user->loadMissing('roles');
                    $roles = $user->getRoleNames();
                    $primaryRole = $roles->first() ?? 'student';

                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar,

                        'role_name' => $primaryRole,
                        'roles' => $roles,

                        // Role-specific profile data
                        'profile' => $this->getProfileData($user, $primaryRole),
                    ];
                },
            ],

            // Cache course categories for a day so they are not queried on every request
            'course_categories' => fn () => Cache::remember('inertia_course_categories', 1440, function () {
                return CourseCategory::orderBy('order')->get(['id', 'name', 'slug']);
            }),
        ];
    }

    /**
     * Flat profile data for the user's role.
     */
    private function getProfileData($user, string $role): ?array
    {
        if ($role === 'student') {
            $user->loadMissing('studentProfile');
            $profile = $user->studentProfile;

            return $profile ? [
                'id' => $profile->id,
                'country' => $profile->country,
                'university' => $profile->university,
                'major' => $profile->major,
                'mandarin_level' => $profile->mandarin_level,
                'toefl_score' => $profile->toefl_score,
                'tocfl_score' => $profile->tocfl_score,
                'skills' => $profile->skills,
                'learning_goal' => $profile->learning_goal,
                'bio' => $profile->bio,
            ] : null;
        }

        if ($role === 'teacher') {
            $user->loadMissing('teacherProfile');
            $profile = $user->teacherProfile;

            return $profile ? [
                'id' => $profile->id,
                'full_name' => $profile->full_name,
                'phone' => $profile->phone,
                'bio' => $profile->bio,
                'expertise' => $profile->expertise,
                'learning_goal' => $profile->learning_goal,
            ] : null;
        }

        if ($role === 'company') {
            $user->loadMissing('companyProfile');
            $profile = $user->companyProfile;

            return $profile ? [
                'id' => $profile->id,
                'company_legal_name' => $profile->company_legal_name,
                'company_display_name' => $profile->company_display_name,
                'tax_id' => $profile->tax_id,
                'website_url' => $profile->website_url,
                'bio' => $profile->bio,
                'pic_name' => $profile->pic_name,
                'pic_position' => $profile->pic_position,
                'pic_phone' => $profile->pic_phone,
                'country' => $profile->country,
                'status' => $profile->status,
            ] : null;
        }

        return null;
    }
}
