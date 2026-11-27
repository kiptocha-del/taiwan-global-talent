<?php

namespace Tests\Feature;

use App\Jobs\GenerateCertificateJob;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Progress;
use App\Models\StudentProfile;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LessonProgressTest extends TestCase
{
    use LazilyRefreshDatabase;

    private User $student;

    private Module $module;

    /** @var Collection<int, Lesson> */
    private Collection $lessons;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        Queue::fake();

        $this->student = User::factory()->create();
        $this->student->assignRole('student');

        $this->module = Module::factory()->create();
        $this->lessons = Lesson::factory()->count(3)->sequence(
            ['order' => 1],
            ['order' => 2],
            ['order' => 3],
        )->create(['module_id' => $this->module->id]);

        Enrollment::factory()->create([
            'user_id' => $this->student->id,
            'module_id' => $this->module->id,
        ]);
    }

    public function test_completing_the_same_lesson_twice_counts_once(): void
    {
        $lesson = $this->lessons->first();

        $this->complete($lesson)->assertRedirect()->assertSessionHas('success');
        $this->complete($lesson)->assertRedirect()->assertSessionHas('success');
        $this->complete($lesson)->assertRedirect();

        $enrollment = $this->enrollment();

        $this->assertSame(1, $enrollment->completed_lessons_count);
        $this->assertFalse($enrollment->is_completed);
        $this->assertDatabaseCount('progress', 1);
        Queue::assertNothingPushed();
    }

    public function test_lesson_must_belong_to_the_module_in_the_url(): void
    {
        $otherLesson = Lesson::factory()->create();

        $this->complete($otherLesson)->assertNotFound();

        $this->assertSame(0, $this->enrollment()->completed_lessons_count);
        $this->assertDatabaseCount('progress', 0);
    }

    public function test_unenrolled_student_cannot_record_progress(): void
    {
        $this->enrollment()->delete();

        $this->complete($this->lessons->first())
            ->assertRedirect()
            ->assertSessionHasErrors('message');

        $this->assertDatabaseCount('progress', 0);
    }

    public function test_completing_every_lesson_finishes_the_module_once(): void
    {
        foreach ($this->lessons->take(2) as $lesson) {
            $this->complete($lesson);
        }

        $this->assertFalse($this->enrollment()->is_completed);
        Queue::assertNothingPushed();

        $this->complete($this->lessons->last())->assertSessionHas('success');

        $enrollment = $this->enrollment();

        $this->assertSame(3, $enrollment->completed_lessons_count);
        $this->assertTrue($enrollment->is_completed);
        $this->assertNotNull($enrollment->completed_at);
        $this->assertTrue($this->module->isCompletedByUser($this->student->id));
        Queue::assertPushed(GenerateCertificateJob::class, 1);

        // Revisiting a finished lesson must not issue a second certificate.
        $this->complete($this->lessons->last());

        Queue::assertPushed(GenerateCertificateJob::class, 1);
    }

    public function test_dashboard_summary_is_counted_from_the_students_own_records(): void
    {
        $finished = Module::factory()->create();
        Enrollment::factory()->completed()->create([
            'user_id' => $this->student->id,
            'module_id' => $finished->id,
        ]);
        Certificate::create([
            'user_id' => $this->student->id,
            'module_id' => $finished->id,
            'pdf_path' => 'certificates/test.pdf',
        ]);
        StudentProfile::create(['user_id' => $this->student->id, 'mandarin_level' => 'B1']);

        // Another student's finished course must not be counted.
        Enrollment::factory()->completed()->create();

        $this->actingAs($this->student)
            ->get(route('student.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Index')
                ->where('summary', [
                    'courses_completed' => 1,
                    'certificates' => 1,
                    'mandarin_level' => 'B1',
                ]));
    }

    public function test_dashboard_lists_unfinished_courses_by_progress_and_hides_finished_ones(): void
    {
        // The module from setUp: one of three lessons done, 33%.
        Progress::factory()->create([
            'user_id' => $this->student->id,
            'lesson_id' => $this->lessons->first()->id,
        ]);

        // Second module: two of three lessons done, 66%.
        $ahead = Module::factory()->create(['title' => 'Nearly there']);
        $aheadLessons = Lesson::factory()->count(3)->create(['module_id' => $ahead->id]);
        Enrollment::factory()->create(['user_id' => $this->student->id, 'module_id' => $ahead->id]);
        foreach ($aheadLessons->take(2) as $lesson) {
            Progress::factory()->create(['user_id' => $this->student->id, 'lesson_id' => $lesson->id]);
        }

        // Third module: finished, must not be listed.
        $finished = Module::factory()->create();
        Lesson::factory()->create(['module_id' => $finished->id]);
        Enrollment::factory()->completed()->create(['user_id' => $this->student->id, 'module_id' => $finished->id]);

        // Fourth module: another student's progress must not leak in.
        Progress::factory()->create(['lesson_id' => $this->lessons->last()->id]);

        $this->actingAs($this->student)
            ->get(route('student.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Index')
                ->has('courses', 2)
                ->where('courses.0.id', $ahead->id)
                ->where('courses.0.progress', 66)
                ->where('courses.0.completed_lessons', 2)
                ->where('courses.0.total_lessons', 3)
                ->where('courses.1.id', $this->module->id)
                ->where('courses.1.progress', 33)
                ->where('courses.1.url', route('student.courses.show', [$this->module->category->slug, $this->module->id])));
    }

    public function test_course_page_reports_which_lessons_are_done(): void
    {
        $done = $this->lessons->first();
        Progress::factory()->create(['user_id' => $this->student->id, 'lesson_id' => $done->id]);

        $this->actingAs($this->student)
            ->get(route('student.courses.show', [$this->module->category->slug, $this->module->id]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Course/Show')
                ->where('enrollment.completed_lesson_ids', [$done->id]));
    }

    private function complete(Lesson $lesson): TestResponse
    {
        return $this->actingAs($this->student)
            ->from(route('student.courses.show', [$this->module->category->slug, $this->module->id]))
            ->post(route('student.courses.lessons.complete', [$this->module->id, $lesson->id]));
    }

    private function enrollment(): Enrollment
    {
        return Enrollment::query()
            ->where('user_id', $this->student->id)
            ->where('module_id', $this->module->id)
            ->firstOrFail();
    }
}
