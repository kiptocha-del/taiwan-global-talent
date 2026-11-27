<?php

namespace Tests\Feature;

use App\Models\TeacherProfile;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TeacherOnboardingTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        Storage::fake('public');
    }

    public function test_teacher_who_has_not_applied_is_sent_to_the_form(): void
    {
        $teacher = $this->teacher();

        $this->actingAs($teacher)->get(route('teacher.dashboard'))->assertRedirect(route('teacher.apply'));
        $this->actingAs($teacher)->get(route('teacher.status'))->assertRedirect(route('teacher.apply'));

        $this->actingAs($teacher)
            ->get(route('teacher.apply'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teacher/Apply/Index')
                ->where('hasCv', false)
                ->where('rejectionReason', null));
    }

    public function test_submitting_the_form_creates_a_pending_application(): void
    {
        $teacher = $this->teacher();

        $this->actingAs($teacher)
            ->post(route('teacher.store'), $this->validApplication())
            ->assertRedirect(route('teacher.status'));

        $profile = $teacher->refresh()->teacherProfile;

        $this->assertSame(TeacherProfile::STATUS_PENDING, $profile->status);
        $this->assertSame('Mandarin', $profile->expertise);
        Storage::disk('public')->assertExists($profile->cv_path);
    }

    public function test_first_application_requires_a_cv(): void
    {
        $this->actingAs($this->teacher())
            ->post(route('teacher.store'), [...$this->validApplication(), 'cv' => null])
            ->assertSessionHasErrors('cv');
    }

    public function test_pending_teacher_sees_their_status_and_never_the_form_again(): void
    {
        $teacher = $this->teacher(['cv_path' => 'teachers/cvs/cv.pdf']);

        $this->actingAs($teacher)->get(route('teacher.dashboard'))->assertRedirect(route('teacher.status'));
        $this->actingAs($teacher)->get(route('teacher.apply'))->assertRedirect(route('teacher.status'));
        $this->actingAs($teacher)->post(route('teacher.store'), $this->validApplication())->assertRedirect(route('teacher.status'));

        $this->actingAs($teacher)
            ->get(route('teacher.status'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teacher/Status/Index')
                ->where('status', 'pending'));
    }

    public function test_rejected_teacher_sees_the_reason_and_can_resubmit(): void
    {
        $teacher = $this->teacher([
            'cv_path' => 'teachers/cvs/cv.pdf',
            'status' => TeacherProfile::STATUS_REJECTED,
            'rejection_reason' => 'Please add your teaching experience.',
        ]);

        $this->actingAs($teacher)->get(route('teacher.dashboard'))->assertRedirect(route('teacher.status'));

        $this->actingAs($teacher)
            ->get(route('teacher.status'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('status', 'rejected')
                ->where('rejectionReason', 'Please add your teaching experience.'));

        $this->actingAs($teacher)
            ->get(route('teacher.apply'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('hasCv', true)
                ->where('rejectionReason', 'Please add your teaching experience.'));

        // The earlier CV is kept, so a corrected application does not need a new upload.
        $this->actingAs($teacher)
            ->post(route('teacher.store'), [...$this->validApplication(), 'cv' => null])
            ->assertRedirect(route('teacher.status'));

        $profile = $teacher->refresh()->teacherProfile;

        $this->assertSame(TeacherProfile::STATUS_PENDING, $profile->status);
        $this->assertNull($profile->rejection_reason);
        $this->assertSame('teachers/cvs/cv.pdf', $profile->cv_path);
    }

    public function test_approved_teacher_goes_straight_to_the_dashboard(): void
    {
        // An admin-created teacher is approved without ever uploading a CV.
        $teacher = $this->teacher(['status' => TeacherProfile::STATUS_APPROVED]);

        $this->actingAs($teacher)->get(route('teacher.dashboard'))->assertOk();
        $this->actingAs($teacher)->get(route('teacher.status'))->assertRedirect(route('teacher.dashboard'));
        $this->actingAs($teacher)->get(route('teacher.apply'))->assertRedirect(route('teacher.dashboard'));
    }

    public function test_other_roles_cannot_use_the_teacher_application_form(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $this->actingAs($student)->get(route('teacher.apply'))->assertForbidden();
    }

    /**
     * Mirrors sign-up, where the teacher profile row is created before any application is sent.
     *
     * @param  array<string, mixed>  $profile
     */
    private function teacher(array $profile = []): User
    {
        $user = User::factory()->create();
        $user->assignRole('teacher');
        $user->teacherProfile()->create(['full_name' => $user->name, 'status' => TeacherProfile::STATUS_PENDING, ...$profile]);

        return $user;
    }

    /**
     * @return array<string, mixed>
     */
    private function validApplication(): array
    {
        return [
            'full_name' => 'Lin Mei',
            'phone' => '+886912345678',
            'bio' => 'Ten years of teaching Mandarin to international students.',
            'expertise' => 'Mandarin',
            'cv' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
        ];
    }
}
