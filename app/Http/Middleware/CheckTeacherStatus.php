<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTeacherStatus
{
    /**
     * Only approved teachers reach the teacher portal; everyone else goes to the form or their status page.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $profile = $request->user()->teacherProfile;

        if ($profile?->isApproved()) {
            return $next($request);
        }

        if (! $profile || ! $profile->hasApplied()) {
            return redirect()->route('teacher.apply');
        }

        return redirect()->route('teacher.status');
    }
}
