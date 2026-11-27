<?php

namespace App\Filament\Resources\PartnerInquiries\Tables;

use App\Models\PartnerInquiry;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class PartnerInquiriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('organization_name')
                    ->label('Organization')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('organization_type')
                    ->label('Type')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn (string $state): string => PartnerInquiry::ORGANIZATION_TYPES[$state] ?? $state),

                TextColumn::make('contact_name')
                    ->label('Contact')
                    ->searchable()
                    ->description(fn (PartnerInquiry $record): string => $record->contact_email),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => PartnerInquiry::STATUSES[$state] ?? $state)
                    ->color(fn (string $state): string => match ($state) {
                        PartnerInquiry::STATUS_NEW => 'warning',
                        PartnerInquiry::STATUS_CONTACTED => 'success',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Submitted')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),

                TextColumn::make('reviewed_at')
                    ->label('First Handled')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(PartnerInquiry::STATUSES),

                SelectFilter::make('organization_type')
                    ->label('Type')
                    ->options(PartnerInquiry::ORGANIZATION_TYPES),
            ])
            ->recordActions([
                Action::make('markContacted')
                    ->label('Mark Contacted')
                    ->icon('heroicon-m-chat-bubble-left-right')
                    ->color('success')
                    ->visible(fn (PartnerInquiry $record): bool => $record->status === PartnerInquiry::STATUS_NEW)
                    ->action(fn (PartnerInquiry $record) => $record->update(['status' => PartnerInquiry::STATUS_CONTACTED])),

                Action::make('close')
                    ->label('Close')
                    ->icon('heroicon-m-archive-box')
                    ->color('gray')
                    ->requiresConfirmation()
                    ->visible(fn (PartnerInquiry $record): bool => $record->status !== PartnerInquiry::STATUS_CLOSED)
                    ->action(fn (PartnerInquiry $record) => $record->update(['status' => PartnerInquiry::STATUS_CLOSED])),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No inquiries yet')
            ->emptyStateDescription('Messages from the Get Involved contact form will appear here.')
            ->emptyStateIcon('heroicon-o-hand-raised');
    }
}
