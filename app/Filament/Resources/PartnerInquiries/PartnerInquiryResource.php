<?php

namespace App\Filament\Resources\PartnerInquiries;

use App\Filament\Resources\PartnerInquiries\Pages\EditPartnerInquiry;
use App\Filament\Resources\PartnerInquiries\Pages\ListPartnerInquiries;
use App\Filament\Resources\PartnerInquiries\Schemas\PartnerInquiryForm;
use App\Filament\Resources\PartnerInquiries\Tables\PartnerInquiriesTable;
use App\Models\PartnerInquiry;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class PartnerInquiryResource extends Resource
{
    protected static ?string $model = PartnerInquiry::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-hand-raised';

    protected static ?string $navigationLabel = 'Partner Inquiries';

    protected static ?string $modelLabel = 'Partner Inquiry';

    protected static ?string $pluralModelLabel = 'Partner Inquiries';

    protected static UnitEnum|string|null $navigationGroup = 'Partners';

    public static function getNavigationBadge(): ?string
    {
        $newCount = PartnerInquiry::query()->where('status', PartnerInquiry::STATUS_NEW)->count();

        return $newCount > 0 ? (string) $newCount : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Schema $schema): Schema
    {
        return PartnerInquiryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PartnerInquiriesTable::configure($table);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPartnerInquiries::route('/'),
            'edit' => EditPartnerInquiry::route('/{record}/edit'),
        ];
    }
}
