<?php

namespace App\Jobs;

use App\Models\PartnerInquiry;
use App\Services\GoogleSheetsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Copies a new contact form message to the team's Google Sheet. The message is already saved,
 * so a slow or unreachable Google API never affects the visitor.
 */
class AppendPartnerInquiryToSheet implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 60;

    public int $timeout = 60;

    public function __construct(public PartnerInquiry $inquiry) {}

    public function handle(GoogleSheetsService $sheets): void
    {
        if (! $sheets->isConfigured()) {
            return;
        }

        $sheets->appendRow(PartnerInquiry::EXPORT_HEADINGS, $this->inquiry->toExportRow());
    }
}
