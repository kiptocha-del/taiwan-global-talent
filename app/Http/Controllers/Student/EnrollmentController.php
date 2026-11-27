<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function enroll(Request $request, Module $module): RedirectResponse
    {
        if (! $module->exists) {
            return redirect()->back()->with('error', __('Module not found.'));
        }

        $user = $request->user();

        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('module_id', $module->id)
            ->exists();

        if ($isEnrolled) {
            return redirect()->back()->with('message', __('You are already enrolled in this module.'));
        }

        Enrollment::create([
            'user_id' => $user->id,
            'module_id' => $module->id,
            'completed_lessons_count' => 0,
            'is_completed' => false,
        ]);

        return redirect()->back()->with('success', __('Enrolled successfully. Happy learning!'));
    }
}
