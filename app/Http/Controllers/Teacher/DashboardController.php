<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $stats = [
            'total_courses' => CourseCategory::count(),
            'total_modules' => Module::count(),
            'published_modules' => Module::where('status', 'published')->count(),
            'total_lessons' => Lesson::count(),
        ];

        $recentModules = Module::with(['category'])
            ->withCount('lessons')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Teacher/Index', [
            'teacher' => $user,
            'stats' => $stats,
            'recentModules' => $recentModules,
        ]);
    }
}