<?php

namespace App\Services;

use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;

/**
 * Appends rows to the Google Sheet that mirrors the contact form, using a service account.
 */
class GoogleSheetsService
{
    /**
     * The sync is optional: without a key file and a spreadsheet id it is simply switched off.
     */
    public function isConfigured(): bool
    {
        return filled(config('services.google_sheets.spreadsheet_id'))
            && filled(config('services.google_sheets.credentials'))
            && is_file($this->credentialsPath());
    }

    /**
     * Add one row under the existing ones, writing the headings first when the sheet is still empty.
     *
     * @param  list<string>  $headings
     * @param  list<string>  $row
     */
    public function appendRow(array $headings, array $row): void
    {
        $sheets = new Sheets($this->client());
        $spreadsheetId = config('services.google_sheets.spreadsheet_id');
        $tab = config('services.google_sheets.tab');

        $firstCell = $sheets->spreadsheets_values->get($spreadsheetId, "{$tab}!A1:A1")->getValues();
        $rows = empty($firstCell) ? [$headings, $row] : [$row];

        // RAW stores the visitor's text exactly as typed, so it can never run as a formula.
        $sheets->spreadsheets_values->append(
            $spreadsheetId,
            "{$tab}!A1",
            new ValueRange(['values' => $rows]),
            ['valueInputOption' => 'RAW', 'insertDataOption' => 'INSERT_ROWS'],
        );
    }

    private function client(): Client
    {
        $client = new Client;
        $client->setAuthConfig($this->credentialsPath());
        $client->setScopes([Sheets::SPREADSHEETS]);

        return $client;
    }

    private function credentialsPath(): string
    {
        return storage_path((string) config('services.google_sheets.credentials'));
    }
}
