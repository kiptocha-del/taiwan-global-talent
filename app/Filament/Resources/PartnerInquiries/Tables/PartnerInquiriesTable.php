<?php

namespace App\Filament\Resources\PartnerInquiries\Tables;

use App\Models\PartnerInquiry;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
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
                ImageColumn::make('logo_path')
                    ->label('Logo')
                    ->disk('s3')
                    ->circular(),

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
                        PartnerInquiry::STATUS_APPROVED => 'success',
                        PartnerInquiry::STATUS_DECLINED => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Submitted')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),

                TextColumn::make('reviewed_at')
                    ->label('Reviewed')
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
                Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-m-check')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (PartnerInquiry $record): bool => $record->status !== PartnerInquiry::STATUS_APPROVED)
                    ->action(fn (PartnerInquiry $record) => $record->update(['status' => PartnerInquiry::STATUS_APPROVED])),

                Action::make('decline')
                    ->label('Decline')
                    ->icon('heroicon-m-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (PartnerInquiry $record): bool => $record->status !== PartnerInquiry::STATUS_DECLINED)
                    ->action(fn (PartnerInquiry $record) => $record->update(['status' => PartnerInquiry::STATUS_DECLINED])),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No partner inquiries yet')
            ->emptyStateDescription('Submissions from the Get Involved page will appear here.')
            ->emptyStateIcon('heroicon-o-hand-raised');
    }
}
