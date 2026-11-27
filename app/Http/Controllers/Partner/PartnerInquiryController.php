<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Jobs\AppendPartnerInquiryToSheet;
use App\Models\CompanyProfile;
use App\Models\PartnerInquiry;
use App\Services\GoogleSheetsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PartnerInquiryController extends Controller
{
    /**
     * Display the public Get Involved page with the approved partner organizations and the contact form.
     */
    public function index(): Response
    {
        return Inertia::render('GetInvolved', [
            'partners' => CompanyProfile::approvedForDisplay(),
            'organizationTypes' => $this->toChoices(PartnerInquiry::ORGANIZATION_TYPES),
            'involvementInterests' => $this->toChoices(PartnerInquiry::INVOLVEMENT_INTERESTS),
        ]);
    }

    /**
     * Store a contact form message for the admin team and copy it to the team's Google Sheet.
     */
    public function store(Request $request, GoogleSheetsService $sheets): RedirectResponse
    {
        // Honeypot: real visitors never see this field, so a value means a bot.
        if ($request->filled('website_confirm')) {
            return redirect()->route('get-involved')->with('success', __('Thank you! Your inquiry has been received.'));
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
        ]);

        $inquiry = PartnerInquiry::create($validated);

        // The message is saved either way; a queue or Google problem must not fail the visitor's submission.
        if ($sheets->isConfigured()) {
            rescue(fn () => Bus::dispatch(new AppendPartnerInquiryToSheet($inquiry)));
        }

        return redirect()->route('get-involved')->with('success', __('Thank you! Your inquiry has been received. Our team will review it and get back to you.'));
    }

    /**
     * @param  array<string, string>  $options
     * @return array<int, array{value: string, label: string}>
     */
    private function toChoices(array $options): array
    {
        return collect($options)
            ->map(fn (string $label, string $value) => ['value' => $value, 'label' => __($label)])
            ->values()
            ->all();
    }
}
