<?php

namespace App\Filament\Resources\Companies\Pages;

use App\Filament\Resources\Companies\CompanyResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCompany extends CreateRecord
{
    protected static string $resource = CompanyResource::class;

    /**
     * The role is what lists the account under Companies and opens the company portal
     * once the organization signs in with Google using the same email.
     */
    protected function afterCreate(): void
    {
        $this->record->assignRole('company');
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Company created';
    }
}
