<?php

namespace App\Filament\Resources\Teachers\Tables;

use App\Filament\Actions\ApplicationReviewActions;
use App\Models\TeacherProfile;
use App\Models\User;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class TeachersTable
{
    public static function configure(Table $table): Table
    {
        $profile = fn (User $record): ?TeacherProfile => $record->teacherProfile;

        return $table
            ->columns([
                TextColumn::make('teacherProfile.full_name')
                    ->label('Full Name')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('email')
                    ->label(__('Account email'))
                    ->sortable()
                    ->searchable(),

                TextColumn::make('teacherProfile.phone')
                    ->label('No. WhatsApp')
                    ->searchable(),

                TextColumn::make('teacherProfile.expertise')
                    ->label('Keahlian')
                    ->searchable(),

                TextColumn::make('teacherProfile.learning_goal')
                    ->label('Teaching Goal')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('teacherProfile.bio')
                    ->label('Bio / Pengalaman')
                    ->limit(50)
                    ->tooltip(fn ($record) => $record->teacherProfile?->bio),
                TextColumn::make('teacherProfile.cv_path')
                    ->label('CV')
                    ->placeholder('Not submitted')
                    ->formatStateUsing(fn (): string => 'Open CV')
                    ->url(fn (?string $state): ?string => $state ? Storage::disk('public')->url($state) : null)
                    ->openUrlInNewTab()
                    ->color('primary'),

                TextColumn::make('teacherProfile.status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ]),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Approval Status')
                    ->relationship('teacherProfile', 'status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query->when(
                            $data['value'],
                            fn (Builder $q, $value) => $q->whereHas('teacherProfile', fn ($qp) => $qp->where('status', $value))
                        );
                    }),
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
