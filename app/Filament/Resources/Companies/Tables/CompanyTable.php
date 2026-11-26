<?php

namespace App\Filament\Resources\Companies\Tables;

use App\Filament\Actions\ApplicationReviewActions;
use App\Models\CompanyProfile;
use App\Models\User;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CompanyTable
{
    public static function configure(Table $table): Table
    {
        $profile = fn (User $record): ?CompanyProfile => $record->companyProfile;

        return $table
            ->columns([
                TextColumn::make('companyProfile.company_display_name')
                    ->label('Organization')
                    ->placeholder('No application yet')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('email')
                    ->label('Account Email')
                    ->searchable(),

                TextColumn::make('companyProfile.organization_type')
                    ->label('Type')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn (?string $state): string => CompanyProfile::ORGANIZATION_TYPES[$state] ?? (string) $state),

                TextColumn::make('companyProfile.company_legal_name')
                    ->label('Legal Name')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('companyProfile.industry')
                    ->label('Industry')
                    ->searchable(),

                TextColumn::make('companyProfile.tax_id')
                    ->label('Tax ID / NIB')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('companyProfile.pic_name')
                    ->label('PIC')
                    ->searchable(),

                TextColumn::make('companyProfile.status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        CompanyProfile::STATUS_PENDING => 'warning',
                        CompanyProfile::STATUS_APPROVED => 'success',
                        CompanyProfile::STATUS_REJECTED => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        CompanyProfile::STATUS_PENDING => 'Pending',
                        CompanyProfile::STATUS_APPROVED => 'Approved',
                        CompanyProfile::STATUS_REJECTED => 'Rejected',
                        CompanyProfile::STATUS_SUSPENDED => 'Suspended',
                    ])
                    ->query(fn (Builder $query, array $data): Builder => $query->when(
                        $data['value'],
                        fn (Builder $query, string $value) => $query->whereHas('companyProfile', fn (Builder $profile) => $profile->where('status', $value))
                    )),

                SelectFilter::make('organization_type')
                    ->label('Type')
                    ->options(CompanyProfile::ORGANIZATION_TYPES)
                    ->query(fn (Builder $query, array $data): Builder => $query->when(
                        $data['value'],
                        fn (Builder $query, string $value) => $query->whereHas('companyProfile', fn (Builder $profile) => $profile->where('organization_type', $value))
                    )),
            ])
            ->recordActions([
                ApplicationReviewActions::approve($profile),
                ApplicationReviewActions::deny($profile),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
