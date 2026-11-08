<?php

namespace Tests\Feature;

use App\Models\PartnerInquiry;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GetInvolvedTest extends TestCase
{
    use LazilyRefreshDatabase;

    /**
     * A valid 1x1 PNG so the image and mimes rules pass without the GD extension.
     */
    private const ONE_PIXEL_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();

        // Logo URLs are built from the S3 disk, which has no credentials in testing.
        Storage::fake('s3');
    }

    public function test_get_involved_page_lists_only_approved_partners(): void
    {
        PartnerInquiry::factory()->approved()->count(2)->create();
        PartnerInquiry::factory()->create();
        PartnerInquiry::factory()->declined()->create();

        $this->get(route('get-involved'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('GetInvolved')
                ->has('partners', 2)
                ->has('partners.0', fn (Assert $partner) => $partner
                    ->hasAll(['id', 'name', 'type', 'website_url', 'logo_url']))
                ->has('organizationTypes', count(PartnerInquiry::ORGANIZATION_TYPES))
                ->has('involvementInterests', count(PartnerInquiry::INVOLVEMENT_INTERESTS)));
    }

    public function test_home_page_teaser_receives_at_most_eight_approved_partners(): void
    {
        PartnerInquiry::factory()->approved()->count(10)->create();

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Landing')
                ->has('partners', 8));
    }

    public function test_guest_can_submit_a_partner_inquiry_with_a_logo(): void
    {
        $response = $this->post(route('get-involved.store'), [
            ...$this->validPayload(),
            'logo' => UploadedFile::fake()->createWithContent('logo.png', base64_decode(self::ONE_PIXEL_PNG)),
        ]);

        $response->assertRedirect(route('get-involved'))->assertSessionHas('success');

        $inquiry = PartnerInquiry::sole();

        $this->assertSame('Taipei Language Institute', $inquiry->organization_name);
        $this->assertSame(PartnerInquiry::STATUS_NEW, $inquiry->status);
        $this->assertSame(['teach_mandarin', 'mentor'], $inquiry->involvement_interests);
        $this->assertNull($inquiry->reviewed_at);
        $this->assertNotNull($inquiry->logo_path);

        Storage::disk('s3')->assertExists($inquiry->logo_path);
    }

    public function test_submission_requires_the_core_fields(): void
    {
        $this->from(route('get-involved'))
            ->post(route('get-involved.store'), [])
            ->assertRedirect(route('get-involved'))
            ->assertSessionHasErrors([
                'organization_name',
                'organization_type',
                'contact_name',
                'contact_email',
                'involvement_interests',
            ]);

        $this->assertDatabaseCount('partner_inquiries', 0);
    }

    public function test_svg_logos_are_rejected(): void
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';

        $this->from(route('get-involved'))
            ->post(route('get-involved.store'), [
                ...$this->validPayload(),
                'logo' => UploadedFile::fake()->createWithContent('logo.svg', $svg),
            ])
            ->assertSessionHasErrors('logo');

        $this->assertDatabaseCount('partner_inquiries', 0);
    }

    public function test_honeypot_submissions_are_dropped_silently(): void
    {
        $this->post(route('get-involved.store'), [
            ...$this->validPayload(),
            'website_confirm' => 'https://spam.example',
        ])->assertRedirect(route('get-involved'))->assertSessionHas('success');

        $this->assertDatabaseCount('partner_inquiries', 0);
    }

    public function test_partner_inquiry_submission_is_rate_limited(): void
    {
        foreach (range(1, 5) as $attempt) {
            $this->post(route('get-involved.store'), [])->assertRedirect();
        }

        $this->post(route('get-involved.store'), [])->assertTooManyRequests();
    }

    public function test_approving_an_inquiry_records_the_review_time(): void
    {
        $inquiry = PartnerInquiry::factory()->create();

        $inquiry->update(['status' => PartnerInquiry::STATUS_APPROVED]);

        $this->assertNotNull($inquiry->fresh()->reviewed_at);
        $this->assertCount(1, PartnerInquiry::approvedForDisplay());
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(): array
    {
        return [
            'organization_name' => 'Taipei Language Institute',
            'organization_type' => 'mandarin_center',
            'website_url' => 'https://example.org',
            'contact_name' => 'Lin Mei',
            'contact_email' => 'mei@example.org',
            'involvement_interests' => ['teach_mandarin', 'mentor'],
            'message' => 'We would love to offer evening Mandarin classes.',
        ];
    }
}
