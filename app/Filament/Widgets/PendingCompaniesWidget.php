<?php

namespace App\Filament\Widgets;

use App\Models\CompanyProfile;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
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
        return $table
            ->query(CompanyProfile::query()->where('status', 'pending'))
            ->columns([
                TextColumn::make('company_display_name')
                    ->label(__('Company name'))
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('pic_name')
                    ->label(__('Contact person')),

                TextColumn::make('pic_phone')
                    ->label(__('Phone / WhatsApp')),

                TextColumn::make('tax_id')
                    ->label(__('Tax ID')),

                TextColumn::make('created_at')
                    ->label(__('Registered on'))
                    ->dateTime('d M Y, H:i')
                    ->sortable(), ])
            ->filters([
                //
            ])
            ->headerActions([
                //
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-m-check')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(fn (CompanyProfile $record) => $record->update(['status' => 'approved'])),

                Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-m-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (CompanyProfile $record) => $record->update(['status' => 'rejected'])),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    //
                ]),
            ])
            ->emptyStateHeading('No Pending Companies')
            ->emptyStateDescription('All company registrations have been processed.')
            ->emptyStateIcon('heroicon-o-check-badge');
    }
}
