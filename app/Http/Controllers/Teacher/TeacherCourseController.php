<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TeacherCourseController extends Controller
{
    public function index(): Response
    {
        $courses = CourseCategory::withCount('modules')
            ->orderBy('order')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'instructor' => $category->instructor,
                'duration' => $category->duration,
                'price' => $category->price,
                'modules_count' => $category->modules_count,
                'thumbnail_url' => $category->thumbnail_path
                    ? Storage::disk('s3')->url($category->thumbnail_path)
                    : null,
            ]);

        return Inertia::render('Teacher/Course/Index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Tampilkan form pembuatan Master Course Baru
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Teacher/Course/Create', [
            'teacher' => $request->user(),
        ]);
    }

    /**
     * Simpan Master Course Baru ke Database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:course_categories,name',
            'description' => 'nullable|string',
            'instructor' => 'nullable|string|max:255',
            'duration' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable|image|max:2048', // maks 2MB
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('course-categories/thumbnails', 's3');
        }

        // Tentukan urutan terakhir (order)
        $nextOrder = (int) CourseCategory::max('order') + 1;

        CourseCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'instructor' => $validated['instructor'] ?? $request->user()->name,
            'duration' => $validated['duration'] ?? null,
            'price' => $validated['price'],
            'thumbnail_path' => $thumbnailPath,
            'order' => $nextOrder,
        ]);

        return redirect()->route('teacher.courses.index')->with('success', 'Master Course created successfully!');
    }

    public function show(CourseCategory $category): Response
    {
        $category->load(['modules' => function ($q) {
            $q->withCount('lessons');
        }]);

        return Inertia::render('Teacher/Course/Show', [
            'course' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'instructor' => $category->instructor,
                'duration' => $category->duration,
                'price' => $category->price,
                'modules' => $category->modules,
            ],
        ]);
    }
}