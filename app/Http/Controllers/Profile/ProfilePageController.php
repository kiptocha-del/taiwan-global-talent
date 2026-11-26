<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfilePageController extends Controller
{
    /**
     * Tampilkan halaman profil pengguna
     */
    public function show()
    {
        /** @var User $user */
        $user = Auth::user();

        $roleName = $user->roles->first()?->name ?? $user->role_name ?? $user->role ?? 'student';
        $role = strtolower((string) $roleName);

        // Load the profile relation for the user's role
        if ($role === 'student') {
            $user->loadMissing('studentProfile');
        } elseif ($role === 'teacher') {
            $user->loadMissing('teacherProfile');
        } elseif ($role === 'company') {
            $user->loadMissing('companyProfile');
        }

        return Inertia::render('Profile/ProfilePage', [
            'company' => $role === 'company' ? $user->companyProfile : null,
        ]);
    }

    /**
     * Perbarui data profil pengguna di Database
     */
    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $roleName = $user->roles->first()?->name ?? $user->role_name ?? $user->role ?? 'student';
        $role = strtolower((string) $roleName);

        // Validasi global
        $rules = [
            'name' => 'required|string|max:255',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:2000',
        ];

        // Validasi spesifik per role
        if ($role === 'student') {
            $rules['university'] = 'nullable|string|max:255';
            $rules['major'] = 'nullable|string|max:255';
            $rules['mandarin_level'] = 'nullable|string|max:255';
            $rules['toefl_score'] = 'nullable|string|max:50';
            $rules['tocfl_score'] = 'nullable|string|max:50';
            $rules['skills'] = 'nullable|string|max:255';
            $rules['learning_goal'] = 'nullable|string|max:255';
        } elseif ($role === 'teacher') {
            $rules['full_name'] = 'nullable|string|max:255';
            $rules['phone'] = 'nullable|string|max:50';
            $rules['expertise'] = 'nullable|string|max:255';
            $rules['learning_goal'] = 'nullable|string|max:255';
        } elseif ($role === 'company') {
            $rules['company_legal_name'] = 'required|string|max:255';
            $rules['company_display_name'] = 'required|string|max:255';
            $rules['tax_id'] = [
                'nullable', 'string', 'max:100',
                Rule::unique('company_profiles', 'tax_id')->ignore($user->companyProfile?->id),
            ];
            $rules['website_url'] = 'nullable|url|max:255';
            $rules['pic_name'] = 'required|string|max:255';
            $rules['pic_position'] = 'required|string|max:255';
            $rules['pic_phone'] = 'required|string|max:50';
        }

        $validated = $request->validate($rules);

        // 1. Update data utama pada tabel users
        $user->update(['name' => $validated['name']]);

        // 2. Simpan/Perbarui data pada tabel relasi profil masing-masing role
        if ($role === 'student') {
            $user->studentProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'country' => $validated['country'] ?? null,
                    'university' => $validated['university'] ?? null,
                    'major' => $validated['major'] ?? null,
                    'mandarin_level' => $validated['mandarin_level'] ?? null,
                    'toefl_score' => $validated['toefl_score'] ?? null,
                    'tocfl_score' => $validated['tocfl_score'] ?? null,
                    'skills' => $validated['skills'] ?? null,
                    'learning_goal' => $validated['learning_goal'] ?? null,
                    'bio' => $validated['bio'] ?? null,
                ]
            );
        } elseif ($role === 'teacher') {
            $user->teacherProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'full_name' => $validated['full_name'] ?? null,
                    'phone' => $validated['phone'] ?? null,
                    'expertise' => $validated['expertise'] ?? null,
                    'learning_goal' => $validated['learning_goal'] ?? null,
                    'country' => $validated['country'] ?? null,
                    'bio' => $validated['bio'] ?? null,
                ]
            );
        } elseif ($role === 'company') {
            // The profile itself is only ever created by the application form.
            $user->companyProfile?->update([
                'company_legal_name' => $validated['company_legal_name'],
                'company_display_name' => $validated['company_display_name'],
                'tax_id' => $validated['tax_id'] ?? null,
                'website_url' => $validated['website_url'] ?? null,
                'pic_name' => $validated['pic_name'],
                'pic_position' => $validated['pic_position'],
                'pic_phone' => $validated['pic_phone'],
                'country' => $validated['country'] ?? $user->companyProfile->country,
                'bio' => $validated['bio'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
}
