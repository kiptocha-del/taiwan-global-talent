<?php

namespace App\Filament\Actions;

use Closure;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Model;

/**
 * Approve / Deny row actions shared by every table that lists applications awaiting review.
 */
class ApplicationReviewActions
{
    /**
     * @param  Closure(Model): ?Model  $resolveProfile  Maps the table record to its company or teacher profile.
     */
    public static function approve(Closure $resolveProfile): Action
    {
        return Action::make('approve')
            ->label('Approve')
            ->icon('heroicon-m-check')
            ->color('success')
            ->requiresConfirmation()
            ->visible(fn (Model $record): bool => self::canMoveTo($resolveProfile($record), 'approved'))
            ->action(function (Model $record) use ($resolveProfile): void {
                $resolveProfile($record)->approve();

                Notification::make()->title('Application approved')->success()->send();
            });
    }

    /**
     * @param  Closure(Model): ?Model  $resolveProfile  Maps the table record to its company or teacher profile.
     */
    public static function deny(Closure $resolveProfile): Action
    {
        return Action::make('deny')
            ->label('Deny')
            ->icon('heroicon-m-x-mark')
            ->color('danger')
            ->modalHeading('Deny application')
            ->modalDescription('The applicant sees this reason on their status page and can correct and resubmit.')
            ->schema([
                Textarea::make('rejection_reason')
                    ->label('Reason')
                    ->required()
                    ->maxLength(1000)
                    ->rows(3),
            ])
            ->visible(fn (Model $record): bool => self::canMoveTo($resolveProfile($record), 'rejected'))
            ->action(function (array $data, Model $record) use ($resolveProfile): void {
                $resolveProfile($record)->reject($data['rejection_reason']);

                Notification::make()->title('Application denied')->success()->send();
            });
    }

    private static function canMoveTo(?Model $profile, string $status): bool
    {
        return $profile !== null && $profile->status !== $status;
    }
}
