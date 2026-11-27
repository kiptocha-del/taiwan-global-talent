<?php

namespace App\Filament\Widgets;

use App\Models\CommunityPost;
use App\Models\CompanyJob;
use App\Models\CompanyProfile;
use App\Models\JobApplication;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $currentMonthUsers = User::where('created_at', '>=', Carbon::now()->subDays(30))->count();
        $previousMonthUsers = User::whereBetween('created_at', [Carbon::now()->subDays(60), Carbon::now()->subDays(30)])->count();
        $userGrowth = $previousMonthUsers > 0
            ? round((($currentMonthUsers - $previousMonthUsers) / $previousMonthUsers) * 100, 1)
            : ($currentMonthUsers > 0 ? 100 : 0);

        $usersDailyChart = collect(range(6, 0))->map(fn ($days) => User::whereDate('created_at', Carbon::now()->subDays($days))->count()
        )->toArray();

        $postsDailyChart = collect(range(6, 0))->map(fn ($days) => CommunityPost::whereDate('created_at', Carbon::now()->subDays($days))->count()
        )->toArray();

        $applicationsDailyChart = collect(range(6, 0))->map(fn ($days) => JobApplication::whereDate('created_at', Carbon::now()->subDays($days))->count()
        )->toArray();

        $pendingCompanies = CompanyProfile::where('status', 'pending')->count();

        return [
            Stat::make(__('Total users'), number_format(User::count()))
                ->description(__(':growth% in the last 30 days', ['growth' => ($userGrowth >= 0 ? '+' : '').$userGrowth]))
                ->descriptionIcon($userGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->chart($usersDailyChart)
                ->color($userGrowth >= 0 ? 'success' : 'danger'),

            Stat::make(__('Pending companies'), $pendingCompanies)
                ->description($pendingCompanies > 0 ? __('Awaiting admin verification') : __('All companies verified'))
                ->descriptionIcon($pendingCompanies > 0 ? 'heroicon-m-exclamation-circle' : 'heroicon-m-check-badge')
                ->color($pendingCompanies > 0 ? 'warning' : 'success'),

            Stat::make(__('Active job postings'), CompanyJob::where('status', 'published')->count())
                ->description(__(':count job applicants in total', ['count' => JobApplication::count()]))
                ->descriptionIcon('heroicon-m-briefcase')
                ->chart($applicationsDailyChart)
                ->color('primary'),

            Stat::make(__('Community posts'), number_format(CommunityPost::count()))
                ->description(__('Latest feed activity'))
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->chart($postsDailyChart)
                ->color('info'),
        ];
    }
}
