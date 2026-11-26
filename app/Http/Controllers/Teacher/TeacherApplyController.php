<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\TeacherProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherApplyController extends Controller
{
    /**
     * Display the application form: only for a first application or after a rejection.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $profile = $request->user()->teacherProfile;

        if ($redirect = $this->redirectWhenFormIsClosed($profile)) {
            return $redirect;
        }

        return Inertia::render('Teacher/Apply/Index', [
            'existingProfile' => $profile?->only(['full_name', 'phone', 'expertise', 'learning_goal', 'bio']),
            'hasCv' => (bool) $profile?->hasApplied(),
            'rejectionReason' => $profile?->rejection_reason,
        ]);
    }

    /**
     * Store a first application, or a corrected one after a rejection, and send it for review.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $user->teacherProfile;

        if ($redirect = $this->redirectWhenFormIsClosed($profile)) {
            return $redirect;
        }

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'bio' => ['required', 'string'],
            'expertise' => ['nullable', 'string', 'max:255'],
            'learning_goal' => ['nullable', 'string', 'max:255'],
            'cv' => [$profile?->hasApplied() ? 'nullable' : 'required', 'file', 'mimes:pdf', 'max:2048'],
            'certificate' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        $user->teacherProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'bio' => $validated['bio'],
                'expertise' => $validated['expertise'] ?? null,
                'learning_goal' => $validated['learning_goal'] ?? null,
                'cv_path' => $request->hasFile('cv')
                    ? $request->file('cv')->store('teachers/cvs', 'public')
                    : $profile?->cv_path,
                'certificate_path' => $request->hasFile('certificate')
                    ? $request->file('certificate')->store('teachers/certificates', 'public')
                    : $profile?->certificate_path,
                'status' => TeacherProfile::STATUS_PENDING,
            ]
        );

        return redirect()->route('teacher.status')->with('success', 'Application submitted');
    }

    /**
     * Show the applicant where their application stands.
     */
    public function status(Request $request): Response|RedirectResponse
    {
        $profile = $request->user()->teacherProfile;

        if ($profile?->isApproved()) {
            return redirect()->route('teacher.dashboard');
        }

        if (! $profile || ! $profile->hasApplied()) {
            return redirect()->route('teacher.apply');
        }

        return Inertia::render('Teacher/Status/Index', [
            'status' => $profile->status,
            'rejectionReason' => $profile->rejection_reason,
            'submittedAt' => $profile->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * An application that is under review, approved or suspended cannot be filled in again.
     */
    private function redirectWhenFormIsClosed(?TeacherProfile $profile): ?RedirectResponse
    {
        if ($profile?->isApproved()) {
            return redirect()->route('teacher.dashboard');
        }

        if (! $profile || ! $profile->hasApplied() || $profile->isRejected()) {
            return null;
        }

        return redirect()->route('teacher.status');
    }
}
