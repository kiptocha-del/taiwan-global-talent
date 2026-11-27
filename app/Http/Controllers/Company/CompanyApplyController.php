<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompanyApplyController extends Controller
{
    private const DISK = 's3';

    /**
     * Uploads on the application form and the folder each one is stored in.
     *
     * @var array<string, string>
     */
    private const UPLOAD_DIRECTORIES = [
        'business_registration_path' => 'companies/legals',
        'logo_path' => 'company-logos',
        'banner_path' => 'company-banners',
    ];

    /**
     * Display the application form: only for a first application or after a rejection.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $profile = $request->user()->companyProfile;

        if ($redirect = $this->redirectWhenFormIsClosed($profile)) {
            return $redirect;
        }

        return Inertia::render('Company/Apply/Index', [
            'existingProfile' => $profile?->only([
                'company_legal_name', 'tax_id', 'company_display_name', 'organization_type', 'industry',
                'website_url', 'company_size', 'founded_year', 'bio', 'description', 'pic_name', 'pic_phone',
                'pic_position', 'official_email', 'city', 'country', 'hq_address',
            ]),
            'hasBusinessDocument' => filled($profile?->business_registration_path),
            'rejectionReason' => $profile?->rejection_reason,
            'organizationTypes' => collect(CompanyProfile::ORGANIZATION_TYPES)
                ->map(fn (string $label, string $value) => ['value' => $value, 'label' => __($label)])
                ->values()
                ->all(),
        ]);
    }

    /**
     * Store a first application, or a corrected one after a rejection, and send it for review.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $user->companyProfile;

        if ($redirect = $this->redirectWhenFormIsClosed($profile)) {
            return $redirect;
        }

        $validated = $request->validate([
            'company_legal_name' => ['required', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:100', Rule::unique('company_profiles', 'tax_id')->ignore($profile?->id)],
            'business_registration_path' => [
                $profile?->business_registration_path ? 'nullable' : 'required',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:10240',
            ],

            'company_display_name' => ['required', 'string', 'max:255'],
            'organization_type' => ['required', Rule::in(array_keys(CompanyProfile::ORGANIZATION_TYPES))],
            'industry' => ['required', 'string', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'company_size' => ['required', 'integer', 'min:1'],
            'founded_year' => ['required', 'integer', 'min:1800', 'max:'.date('Y')],
            'logo_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'banner_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'bio' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            'pic_name' => ['required', 'string', 'max:255'],
            'pic_phone' => ['required', 'string', 'max:50'],
            'pic_position' => ['required', 'string', 'max:255'],
            'official_email' => ['nullable', 'email', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'hq_address' => ['nullable', 'string'],
        ]);

        foreach (self::UPLOAD_DIRECTORIES as $field => $directory) {
            if (! $request->hasFile($field)) {
                unset($validated[$field]);

                continue;
            }

            if ($profile?->{$field}) {
                Storage::disk(self::DISK)->delete($profile->{$field});
            }

            $validated[$field] = $request->file($field)->store($directory, self::DISK);
        }

        $validated['slug'] = $profile->slug ?? Str::slug($validated['company_display_name']).'-'.Str::lower(Str::random(6));
        $validated['status'] = CompanyProfile::STATUS_PENDING;

        CompanyProfile::updateOrCreate(['user_id' => $user->id], $validated);

        return redirect()->route('company.status')->with('success', 'Application submitted successfully!');
    }

    /**
     * Show the applicant where their application stands.
     */
    public function status(Request $request): Response|RedirectResponse
    {
        $profile = $request->user()->companyProfile;

        if (! $profile) {
            return redirect()->route('company.register');
        }

        if ($profile->isApproved()) {
            return redirect()->route('company.dashboard');
        }

        return Inertia::render('Company/Status/Index', [
            'status' => $profile->status,
            'rejectionReason' => $profile->rejection_reason,
            'submittedAt' => $profile->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * An application that is under review, approved or suspended cannot be filled in again.
     */
    private function redirectWhenFormIsClosed(?CompanyProfile $profile): ?RedirectResponse
    {
        if (! $profile || $profile->isRejected()) {
            return null;
        }

        return redirect()->route($profile->isApproved() ? 'company.dashboard' : 'company.status');
    }
}
