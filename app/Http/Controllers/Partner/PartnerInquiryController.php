<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\PartnerInquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PartnerInquiryController extends Controller
{
    /**
     * Display the public Get Involved page with approved partners and the inquiry form.
     */
    public function index(): Response
    {
        return Inertia::render('GetInvolved', [
            'partners' => PartnerInquiry::approvedForDisplay(),
            'organizationTypes' => $this->toChoices(PartnerInquiry::ORGANIZATION_TYPES),
            'involvementInterests' => $this->toChoices(PartnerInquiry::INVOLVEMENT_INTERESTS),
        ]);
    }

    /**
     * Store a partner inquiry submitted by a guest for admin review.
     */
    public function store(Request $request): RedirectResponse
    {
        // Honeypot: real visitors never see this field, so a value means a bot.
        if ($request->filled('website_confirm')) {
            return redirect()->route('get-involved')->with('success', 'Thank you! Your inquiry has been received.');
        }

        $validated = $request->validate([
            'organization_name' => ['required', 'string', 'max:255'],
            'organization_type' => ['required', Rule::in(array_keys(PartnerInquiry::ORGANIZATION_TYPES))],
            'website_url' => ['nullable', 'url', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'involvement_interests' => ['required', 'array', 'min:1'],
            'involvement_interests.*' => [Rule::in(array_keys(PartnerInquiry::INVOLVEMENT_INTERESTS))],
            'message' => ['nullable', 'string', 'max:2000'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        unset($validated['logo']);

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request->file('logo')->store('partner-logos', 's3');
        }

        PartnerInquiry::create($validated);

        return redirect()->route('get-involved')->with('success', 'Thank you! Your inquiry has been received. Our team will review it and get back to you.');
    }

    /**
     * @param  array<string, string>  $options
     * @return array<int, array{value: string, label: string}>
     */
    private function toChoices(array $options): array
    {
        return collect($options)
            ->map(fn (string $label, string $value) => ['value' => $value, 'label' => $label])
            ->values()
            ->all();
    }
}
