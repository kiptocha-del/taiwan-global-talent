<?php

namespace Tests\Feature;

use App\Filament\Resources\PartnerInquiries\Pages\ListPartnerInquiries;
use App\Jobs\AppendPartnerInquiryToSheet;
use App\Models\PartnerInquiry;
use App\Models\User;
use App\Services\GoogleSheetsService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Livewire\Livewire;
use Mockery\MockInterface;
use RuntimeException;
use Tests\TestCase;

class PartnerInquirySheetSyncTest extends TestCase
{
    use LazilyRefreshDatabase;

    private const PAYLOAD = [
        'organization_name' => 'Taipei Language Institute',
        'organization_type' => 'mandarin_center',
        'website_url' => 'https://example.org',
        'contact_name' => 'Lin Mei',
        'contact_email' => 'mei@example.org',
        'involvement_interests' => ['teach_mandarin', 'mentor'],
        'message' => 'We would love to offer evening Mandarin classes.',
    ];

    public function test_a_new_message_is_queued_for_the_google_sheet(): void
    {
        Bus::fake();
        $this->sheetIsConfigured(true);

        $this->post(route('get-involved.store'), self::PAYLOAD)->assertSessionHas('success');

        $inquiry = PartnerInquiry::sole();

        Bus::assertDispatched(
            AppendPartnerInquiryToSheet::class,
            fn (AppendPartnerInquiryToSheet $job): bool => $job->inquiry->is($inquiry),
        );
    }

    public function test_nothing_is_queued_while_the_google_sheet_is_not_set_up(): void
    {
        Bus::fake();
        $this->sheetIsConfigured(false);

        $this->post(route('get-involved.store'), self::PAYLOAD)->assertSessionHas('success');

        $this->assertDatabaseCount('partner_inquiries', 1);
        Bus::assertNotDispatched(AppendPartnerInquiryToSheet::class);
    }

    public function test_a_google_failure_does_not_lose_the_message_or_fail_the_visitor(): void
    {
        config(['queue.default' => 'sync']);

        $this->mock(GoogleSheetsService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturn(true);
            $mock->shouldReceive('appendRow')->andThrow(new RuntimeException('Google is unreachable'));
        });

        $this->post(route('get-involved.store'), self::PAYLOAD)
            ->assertRedirect(route('get-involved'))
            ->assertSessionHas('success');

        $this->assertDatabaseCount('partner_inquiries', 1);
    }

    public function test_the_job_appends_the_message_as_one_row(): void
    {
        $inquiry = PartnerInquiry::factory()->create([
            ...self::PAYLOAD,
            'created_at' => '2026-11-24 09:30:00',
        ]);

        $sheets = $this->mock(GoogleSheetsService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturn(true);
            $mock->shouldReceive('appendRow')->once()->with(PartnerInquiry::EXPORT_HEADINGS, [
                '2026-11-24 09:30',
                'Taipei Language Institute',
                'Mandarin center',
                'https://example.org',
                'Lin Mei',
                'mei@example.org',
                'Teach Mandarin, Mentor learners',
                'We would love to offer evening Mandarin classes.',
                'New',
            ]);
        });

        (new AppendPartnerInquiryToSheet($inquiry))->handle($sheets);
    }

    public function test_the_job_does_nothing_while_the_google_sheet_is_not_set_up(): void
    {
        $sheets = $this->mock(GoogleSheetsService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('isConfigured')->andReturn(false);
            $mock->shouldNotReceive('appendRow');
        });

        (new AppendPartnerInquiryToSheet(PartnerInquiry::factory()->create()))->handle($sheets);
    }

    public function test_the_sheet_sync_is_off_without_credentials(): void
    {
        config(['services.google_sheets.spreadsheet_id' => null, 'services.google_sheets.credentials' => null]);

        $this->assertFalse(app(GoogleSheetsService::class)->isConfigured());

        config([
            'services.google_sheets.spreadsheet_id' => 'sheet-id',
            'services.google_sheets.credentials' => 'app/google/missing-key.json',
        ]);

        $this->assertFalse(app(GoogleSheetsService::class)->isConfigured());
    }

    public function test_admin_can_download_the_listed_inquiries_as_csv(): void
    {
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        PartnerInquiry::factory()->create(self::PAYLOAD);
        PartnerInquiry::factory()->closed()->create(['organization_name' => '=HYPERLINK("https://evil.example")']);

        $component = Livewire::actingAs($admin)
            ->test(ListPartnerInquiries::class)
            ->filterTable('status', PartnerInquiry::STATUS_NEW)
            ->callAction('download')
            ->assertFileDownloaded('partner-inquiries-'.now()->format('Y-m-d').'.csv');

        $csv = base64_decode($component->effects['download']['content']);

        $this->assertStringContainsString('Submitted,Organization,Type', $csv);
        $this->assertStringContainsString('Taipei Language Institute', $csv);
        $this->assertStringContainsString('"Teach Mandarin, Mentor learners"', $csv);
        $this->assertStringNotContainsString('HYPERLINK', $csv);

        // Without the filter the closed inquiry is included, with its formula forced to plain text.
        $all = Livewire::actingAs($admin)->test(ListPartnerInquiries::class)->callAction('download');

        $this->assertStringContainsString("'=HYPERLINK", base64_decode($all->effects['download']['content']));
    }

    public function test_admin_can_mark_an_inquiry_contacted_and_closed(): void
    {
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $inquiry = PartnerInquiry::factory()->create();

        Livewire::actingAs($admin)->test(ListPartnerInquiries::class)->callTableAction('markContacted', $inquiry);

        $this->assertSame(PartnerInquiry::STATUS_CONTACTED, $inquiry->refresh()->status);
        $this->assertNotNull($inquiry->reviewed_at);

        Livewire::actingAs($admin)->test(ListPartnerInquiries::class)->callTableAction('close', $inquiry);

        $this->assertSame(PartnerInquiry::STATUS_CLOSED, $inquiry->refresh()->status);
    }

    private function sheetIsConfigured(bool $configured): void
    {
        $this->mock(GoogleSheetsService::class, function (MockInterface $mock) use ($configured): void {
            $mock->shouldReceive('isConfigured')->andReturn($configured);
        });
    }
}
