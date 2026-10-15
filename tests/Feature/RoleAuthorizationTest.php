<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class RoleAuthorizationTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_guest_is_redirected_from_student_dashboard(): void
    {
        $this->get(route('student.dashboard'))->assertRedirect(route('login'));
    }

    public function test_guest_is_redirected_from_teacher_dashboard(): void
    {
        $this->get(route('teacher.dashboard'))->assertRedirect(route('login'));
    }

    public function test_guest_is_redirected_from_company_dashboard(): void
    {
        $this->get(route('company.dashboard'))->assertRedirect(route('login'));
    }

    public function test_student_cannot_open_teacher_dashboard(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $this->actingAs($student)
            ->get(route('teacher.dashboard'))
            ->assertForbidden();
    }

    public function test_teacher_cannot_open_student_dashboard(): void
    {
        $teacher = User::factory()->create();
        $teacher->assignRole('teacher');

        $this->actingAs($teacher)
            ->get(route('student.dashboard'))
            ->assertForbidden();
    }

    public function test_company_cannot_open_student_dashboard(): void
    {
        $company = User::factory()->create();
        $company->assignRole('company');

        $this->actingAs($company)
            ->get(route('student.dashboard'))
            ->assertForbidden();
    }
}
