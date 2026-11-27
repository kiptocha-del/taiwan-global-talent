<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Progress;
use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        return Inertia::render('Student/Index', [
            'courses' => $this->coursesInProgress($userId),
            'summary' => [
                'courses_completed' => Enrollment::where('user_id', $userId)->where('is_completed', true)->count(),
                'certificates' => Certificate::where('user_id', $userId)->count(),
                'mandarin_level' => StudentProfile::where('user_id', $userId)->value('mandarin_level'),
            ],
        ]);
    }

    /**
     * Enrolled courses the student has not finished, highest progress first.
     *
     * Progress is derived from the per-lesson progress rows so each course is
     * reported independently. Finished courses are left out.
     *
     * @return array<int, array<string, mixed>>
     */
    private function coursesInProgress(int $userId): array
    {
        $enrollments = Enrollment::query()
            ->where('user_id', $userId)
            ->where('is_completed', false)
            ->with(['module' => fn ($query) => $query->withCount('lessons')->with('category:id,name,slug')])
            ->get();

        if ($enrollments->isEmpty()) {
            return [];
        }

        $completedByModule = Progress::query()
            ->join('lessons', 'lessons.id', '=', 'progress.lesson_id')
            ->where('progress.user_id', $userId)
            ->where('progress.is_completed', true)
            ->whereIn('lessons.module_id', $enrollments->pluck('module_id'))
            ->groupBy('lessons.module_id')
            ->selectRaw('lessons.module_id, count(*) as completed')
            ->pluck('completed', 'module_id');

        return $enrollments
            ->map(function (Enrollment $enrollment) use ($completedByModule) {
                $module = $enrollment->module;

                if (! $module) {
                    return null;
                }

                $total = (int) $module->lessons_count;
                $completed = min((int) ($completedByModule[$module->id] ?? 0), $total);

                if ($total > 0 && $completed >= $total) {
                    return null;
                }

                return [
                    'id' => $module->id,
                    'title' => $module->title,
                    'level' => $module->level,
                    'category' => $module->category ? [
                        'name' => $module->category->name,
                        'slug' => $module->category->slug,
                    ] : null,
                    'total_lessons' => $total,
                    'completed_lessons' => $completed,
                    'progress' => $total > 0 ? (int) floor(($completed / $total) * 100) : 0,
                    'url' => $module->category
                        ? route('student.courses.show', [$module->category->slug, $module->id])
                        : route('student.courses.index'),
                ];
            })
            ->filter()
            ->sortBy('title', SORT_NATURAL | SORT_FLAG_CASE)
            ->sortByDesc('progress')
            ->values()
            ->all();
    }
}
