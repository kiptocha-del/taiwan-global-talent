<?php

namespace App\Filament\Resources\PartnerInquiries\Pages;

use App\Filament\Resources\PartnerInquiries\PartnerInquiryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPartnerInquiry extends EditRecord
{
    protected static string $resource = PartnerInquiryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
