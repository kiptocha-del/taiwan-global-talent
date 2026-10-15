<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Vocabulary;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeacherLessonController extends Controller
{
    public function create(Module $module): Response
    {
        $module->load('category');

        return Inertia::render('Teacher/Lesson/Create', [
            'module' => $module,
            'vocabularies' => Vocabulary::select('id', 'hanzi', 'pinyin', 'meaning')->get(),
        ]);
    }

    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'required|integer',
            'content_type' => 'required|in:text,video,audio,pdf',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'video_file' => 'nullable|file|mimes:mp4,mkv|max:102400',
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480',
            'audios' => 'nullable|array',
            'audios.*.lesson_audio_description' => 'required_with:audios|string',
            'audios.*.translation' => 'nullable|string',
            'audios.*.file' => 'nullable|file|mimes:mp3,wav|max:20480',
            'sentences' => 'nullable|array',
            'sentences.*.hanzi' => 'required_with:sentences|string',
            'sentences.*.pinyin' => 'required_with:sentences|string',
            'sentences.*.meaning' => 'required_with:sentences|string',
            'vocabularies' => 'nullable|array',
            'vocabularies.*' => 'exists:vocabularies,id',
        ]);

        // 1. Handling Video Upload
        $videoPath = null;
        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('modules/videos', 's3');
        }

        // 2. Handling PDF Upload
        $pdfPath = null;
        if ($request->hasFile('pdf_file')) {
            $pdfPath = $request->file('pdf_file')->store('modules/documents', 's3');
        }

        // 3. Create Lesson
        $lesson = $module->lessons()->create([
            'title' => $validated['title'],
            'order' => $validated['order'],
            'content_type' => $validated['content_type'],
            'content' => $validated['content'] ?? null,
            'video_url' => $validated['video_url'] ?? null,
            'video_path' => $videoPath,
            'pdf_path' => $pdfPath,
        ]);

        // 4. Save Repeater Audio
        if (! empty($request->audios)) {
            foreach ($request->audios as $index => $audioData) {
                $audioPath = null;
                if (isset($audioData['file']) && $audioData['file'] instanceof UploadedFile) {
                    $audioPath = $audioData['file']->store('modules/audios', 's3');
                }

                if ($audioPath) {
                    $lesson->audios()->create([
                        'lesson_audio_description' => $audioData['lesson_audio_description'],
                        'translation' => $audioData['translation'] ?? null,
                        'lesson_audio_path' => $audioPath,
                        'sort_order' => $index,
                    ]);
                }
            }
        }

        // 5. Save Repeater Sentences (Mandarin)
        if (! empty($request->sentences) && $module->category_id === 1) {
            foreach ($request->sentences as $index => $sentence) {
                $lesson->sentences()->create([
                    'hanzi' => $sentence['hanzi'],
                    'pinyin' => $sentence['pinyin'],
                    'meaning' => $sentence['meaning'],
                    'sort_order' => $index,
                ]);
            }
        }

        // 6. Sync Vocabularies
        if (! empty($validated['vocabularies']) && $module->category_id === 1) {
            $lesson->vocabularies()->sync($validated['vocabularies']);
        }

        return redirect()->route('teacher.modules.show', $module->id)->with('success', 'Lesson added successfully!');
    }

    public function edit(Lesson $lesson): Response
    {
        $lesson->load(['module.category', 'audios', 'sentences', 'vocabularies']);

        return Inertia::render('Teacher/Lesson/Edit', [
            'lesson' => $lesson,
            'module' => $lesson->module,
            'vocabularies' => Vocabulary::select('id', 'hanzi', 'pinyin', 'meaning')->get(),
        ]);
    }

    public function update(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'required|integer',
            'content_type' => 'required|in:text,video,audio,pdf',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'video_file' => 'nullable|file|mimes:mp4,mkv|max:102400',
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480',
            'vocabularies' => 'nullable|array',
        ]);

        if ($request->hasFile('video_file')) {
            if ($lesson->video_path) {
                Storage::disk('s3')->delete($lesson->video_path);
            }
            $lesson->video_path = $request->file('video_file')->store('modules/videos', 's3');
        }

        if ($request->hasFile('pdf_file')) {
            if ($lesson->pdf_path) {
                Storage::disk('s3')->delete($lesson->pdf_path);
            }
            $lesson->pdf_path = $request->file('pdf_file')->store('modules/documents', 's3');
        }

        $lesson->update([
            'title' => $validated['title'],
            'order' => $validated['order'],
            'content_type' => $validated['content_type'],
            'content' => $validated['content'] ?? null,
            'video_url' => $validated['video_url'] ?? null,
        ]);

        if ($lesson->module->category_id === 1 && isset($validated['vocabularies'])) {
            $lesson->vocabularies()->sync($validated['vocabularies']);
        }

        return redirect()->route('teacher.modules.show', $lesson->module_id)->with('success', 'Lesson updated successfully!');
    }

    public function destroy(Lesson $lesson)
    {
        $moduleId = $lesson->module_id;
        $lesson->delete();

        return redirect()->route('teacher.modules.show', $moduleId)->with('success', 'Lesson deleted!');
    }
}
