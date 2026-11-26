<?php

namespace App\Filament\Resources\PartnerInquiries\Pages;

use App\Filament\Resources\PartnerInquiries\PartnerInquiryResource;
use App\Models\PartnerInquiry;
use Filament\Actions\Action;
use Filament\Resources\Pages\ListRecords;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ListPartnerInquiries extends ListRecords
{
    protected static string $resource = PartnerInquiryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('download')
                ->label('Download CSV')
                ->icon('heroicon-m-arrow-down-tray')
                ->color('gray')
                ->action(fn (): StreamedResponse => $this->downloadCsv()),
        ];
    }

    /**
     * Download the inquiries currently listed (search and filters applied) as a spreadsheet file.
     */
    private function downloadCsv(): StreamedResponse
    {
        $inquiries = $this->getFilteredTableQuery()->oldest()->get();

        return response()->streamDownload(function () use ($inquiries): void {
            $output = fopen('php://output', 'w');

            // The byte order mark makes Excel read the file as UTF-8, so Chinese names stay intact.
            fwrite($output, "\xEF\xBB\xBF");
            fputcsv($output, PartnerInquiry::EXPORT_HEADINGS);

            foreach ($inquiries as $inquiry) {
                fputcsv($output, array_map($this->neutraliseFormula(...), $inquiry->toExportRow()));
            }

            fclose($output);
        }, 'partner-inquiries-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /**
     * Visitors type these values, so a cell that would open as a spreadsheet formula is forced to plain text.
     */
    private function neutraliseFormula(string $value): string
    {
        return preg_match('/^[=+\-@\t\r]/', $value) === 1 ? "'".$value : $value;
    }
}
