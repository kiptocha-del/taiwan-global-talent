<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCompanyStatus
{
    /**
     * Only approved organizations reach the company portal; everyone else goes to the form or their status page.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $profile = $request->user()->companyProfile;

        if (! $profile) {
            return redirect()->route('company.register');
        }

        if (! $profile->isApproved()) {
            return redirect()->route('company.status');
        }

        return $next($request);
    }
}
