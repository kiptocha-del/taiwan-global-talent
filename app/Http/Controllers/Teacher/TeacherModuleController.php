<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TeacherModuleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Module::with(['category'])->withCount('lessons');

        if ($request->filled('category_id')) {
            $query->where('category_id',$request->category_id);
        }

        return Inertia::render('Teacher/Module/Index', [
            'modules' => $query->latest()->get(),
            'categories' => CourseCategory::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['category_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Teacher/Module/Create', [
            'categories' => CourseCategory::orderBy('order')->get(['id', 'name']),
            'selected_category_id' => (int) $request->query('category_id', 1),
        ]);
    }

    public function store(Request $request)
    {
        $validated =$request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:course_categories,id',
            'description' => 'required|string',
            'level' => 'required|string|max:255',
            'google_slides_template_id' => 'required|string|max:255',
            'is_published' => 'required|boolean',
        ]);

        Module::create([
            'teacher_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . time(),
            'description' => $validated['description'],
            'level' => $validated['level'],
            'google_slides_template_id' => $validated['google_slides_template_id'],
            'status' => $validated['is_published'] ? 'published' : 'draft',
            'is_published' => $validated['is_published'],
        ]);

        return redirect()->route('teacher.modules.index')->with('success', 'Module created successfully!');
    }

    public function show(Module $module): Response
    {
        $module->load(['category', 'lessons' => fn ($q) =>$q->orderBy('order')]);

        return Inertia::render('Teacher/Module/Show', [
            'module' => $module,
        ]);
    }

    public function edit(Module $module): Response
    {
        return Inertia::render('Teacher/Module/Edit', [
            'module' => $module,
            'categories' => CourseCategory::orderBy('order')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Module$module)
    {
        $validated =$request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:course_categories,id',
            'description' => 'required|string',
            'level' => 'required|string|max:255',
            'google_slides_template_id' => 'required|string|max:255',
            'is_published' => 'required|boolean',
        ]);

        $module->update([
            'title' => $validated['title'],
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],
            'level' => $validated['level'],
            'google_slides_template_id' => $validated['google_slides_template_id'],
            'status' => $validated['is_published'] ? 'published' : 'draft',
            'is_published' => $validated['is_published'],
        ]);

        return redirect()->route('teacher.modules.index')->with('success', 'Module updated successfully!');
    }

    public function destroy(Module $module)
    {
        $module->delete();

        return back()->with('success', 'Module deleted successfully!');
    }
}