<?php

namespace App\Filament\Widgets;

use App\Filament\Actions\ApplicationReviewActions;
use App\Models\CompanyProfile;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class PendingCompaniesWidget extends TableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Company Waiting For Verification';

    public function table(Table $table): Table
    {
        $profile = fn (CompanyProfile $record): CompanyProfile => $record;

        return $table
            ->query(CompanyProfile::query()->where('status', CompanyProfile::STATUS_PENDING))
            ->columns([
                TextColumn::make('company_display_name')
                    ->label(__('Company name'))
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('organization_type')
                    ->label('Type')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn (?string $state): string => CompanyProfile::ORGANIZATION_TYPES[$state] ?? (string) $state),

                TextColumn::make('pic_name')
                    ->label(__('Contact person')),

                TextColumn::make('pic_phone')
                    ->label(__('Phone / WhatsApp')),

                TextColumn::make('tax_id')
                    ->label(__('Tax ID')),

                TextColumn::make('created_at')
                    ->label(__('Registered on'))
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->recordActions([
                ApplicationReviewActions::approve($profile),
                ApplicationReviewActions::deny($profile),
            ])
            ->emptyStateHeading('No Pending Companies')
            ->emptyStateDescription('All company registrations have been processed.')
            ->emptyStateIcon('heroicon-o-check-badge');
    }
}
