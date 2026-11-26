<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyProfileResource;
use App\Models\CompanyProfile;
use App\Models\JobApplication;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user()->load('companyProfile');
        $company = $user->companyProfile;

        if ($company) {
            $disk = Storage::disk('s3');

            $company->logo_url = $company->logo_path ? $disk->url($company->logo_path) : null;
            $company->banner_url = $company->banner_path ? $disk->url($company->banner_path) : null;
            $company->business_registration_url = $company->business_registration_path ? $disk->url($company->business_registration_path) : null;
        }

        return Inertia::render('Company/Index', [
            'company' => $company ? (new CompanyProfileResource($company))->resolve() : null,
            'metrics' => $company ? $this->metrics($company) : null,
        ]);
    }

    /**
     * Hiring figures for the company's own job postings, counted from the database.
     *
     * @return array{active_jobs: int, total_applicants: int, applicants_this_week: int, job_views: int, hired: int}
     */
    private function metrics(CompanyProfile $company): array
    {
        $applications = fn () => JobApplication::query()
            ->whereIn('company_job_id', $company->jobs()->select('id'));

        return [
            'active_jobs' => $company->jobs()->where('status', 'published')->count(),
            'total_applicants' => $applications()->count(),
            'applicants_this_week' => $applications()->where('created_at', '>=', now()->subDays(7))->count(),
            'job_views' => (int) $company->jobs()->sum('views_count'),
            'hired' => $applications()->where('status', 'hired')->count(),
        ];
    }
}
