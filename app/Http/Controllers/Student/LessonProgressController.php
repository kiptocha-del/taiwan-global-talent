<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateCertificateJob;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Progress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LessonProgressController extends Controller
{
    /**
     * Mark a lesson as completed for the signed-in student.
     *
     * Each lesson is recorded once in the progress table, so repeating a lesson
     * never moves the module counter. The enrollment counter is derived from the
     * distinct completed lessons rather than incremented.
     */
    public function completeLesson(Request $request, Module $module, Lesson $lesson): RedirectResponse
    {
        abort_unless($lesson->module_id === $module->id, 404);

        $user = $request->user();

        $enrollment = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('module_id', $module->id)
            ->first();

        if (! $enrollment) {
            return redirect()->back()->withErrors(['message' => 'You are not enrolled in this course.']);
        }

        $justCompletedModule = DB::transaction(function () use ($user, $module, $lesson, $enrollment) {
            Progress::query()->updateOrCreate(
                ['user_id' => $user->id, 'lesson_id' => $lesson->id],
                ['is_completed' => true],
            );

            $totalLessons = $module->lessons()->count();
            $completedLessons = Progress::query()
                ->where('user_id', $user->id)
                ->where('is_completed', true)
                ->whereIn('lesson_id', $module->lessons()->select('id'))
                ->count();

            $isCompletedNow = $totalLessons > 0 && $completedLessons >= $totalLessons;
            $justCompleted = $isCompletedNow && ! $enrollment->is_completed;

            $enrollment->forceFill([
                'completed_lessons_count' => $completedLessons,
                'is_completed' => $isCompletedNow,
                'completed_at' => $justCompleted ? now() : $enrollment->completed_at,
            ])->save();

            return $justCompleted;
        });

        if ($justCompletedModule) {
            GenerateCertificateJob::dispatch($user, $module);

            return redirect()->back()->with(
                'success',
                'Congratulations, you have completed this course. Your certificate is being prepared and will appear on your Certificates page shortly.',
            );
        }

        return redirect()->back()->with('success', 'Progress saved.');
    }
}
