<?php

namespace Tests\Feature;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\Progress;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseApiTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_course_endpoints_require_authentication(): void
    {
        $module = Module::factory()->create();

        $this->getJson('/api/courses')->assertUnauthorized();
        $this->getJson("/api/courses/{$module->id}")->assertUnauthorized();
    }

    public function test_index_lists_only_published_courses(): void
    {
        Module::factory()->count(2)->create();
        Module::factory()->unpublished()->create();

        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/courses')->assertOk()->assertJsonCount(2);
    }

    public function test_show_returns_the_course_with_lessons_and_certification_status(): void
    {
        $user = User::factory()->create();
        $module = Module::factory()->create();
        $lessons = Lesson::factory()->count(2)->create(['module_id' => $module->id]);

        Sanctum::actingAs($user);

        $this->getJson("/api/courses/{$module->id}")
            ->assertOk()
            ->assertJsonPath('module.id', $module->id)
            ->assertJsonCount(2, 'module.lessons')
            ->assertJsonPath('is_certified', false);

        foreach ($lessons as $lesson) {
            Progress::factory()->create(['user_id' => $user->id, 'lesson_id' => $lesson->id]);
        }

        $this->getJson("/api/courses/{$module->id}")
            ->assertOk()
            ->assertJsonPath('is_certified', true);
    }

    public function test_show_hides_unpublished_courses(): void
    {
        $module = Module::factory()->unpublished()->create();

        Sanctum::actingAs(User::factory()->create());

        $this->getJson("/api/courses/{$module->id}")->assertNotFound();
    }
}
