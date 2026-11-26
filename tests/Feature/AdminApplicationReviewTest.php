<?php

namespace Tests\Feature;

use App\Filament\Resources\Companies\Pages\CreateCompany;
use App\Filament\Resources\Companies\Pages\EditCompany;
use App\Filament\Resources\Companies\Pages\ListCompanies;
use App\Filament\Resources\Teachers\Pages\CreateTeacher;
use App\Filament\Resources\Teachers\Pages\ListTeachers;
use App\Filament\Widgets\PendingCompaniesWidget;
use App\Models\CompanyProfile;
use App\Models\TeacherProfile;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Livewire\Livewire;
use Tests\TestCase;

class AdminApplicationReviewTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        Storage::fake('s3');

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin);
    }

    public function test_admin_can_create_an_approved_company_manually(): void
    {
        Livewire::test(CreateCompany::class)
            ->fillForm([
                'name' => 'Chen Wei',
                'email' => 'hr@formosa-robotics.test',
                'companyProfile.company_legal_name' => 'Formosa Robotics Co., Ltd.',
                'companyProfile.company_display_name' => 'Formosa Robotics',
                'companyProfile.slug' => 'formosa-robotics',
                'companyProfile.organization_type' => 'employer',
                'companyProfile.industry' => 'Robotics',
                'companyProfile.pic_name' => 'Chen Wei',
                'companyProfile.pic_phone' => '+886 2 1234 5678',
                'companyProfile.pic_position' => 'HR Lead',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $user = User::where('email', 'hr@formosa-robotics.test')->firstOrFail();

        $this->assertTrue($user->hasRole('company'));
        $this->assertSame(CompanyProfile::STATUS_APPROVED, $user->companyProfile->status);
        $this->assertNotNull($user->companyProfile->verified_at);
    }

    public function test_manually_created_company_reaches_its_dashboard_on_first_google_sign_in(): void
    {
        $user = User::factory()->create(['email' => 'hr@formosa-robotics.test', 'google_id' => null]);
        $user->assignRole('company');
        CompanyProfile::factory()->for($user)->approved()->create();

        $googleUser = (new SocialiteUser)->setRaw(['email_verified' => true])->map([
            'id' => 'google-123',
            'name' => 'Chen Wei',
            'email' => 'hr@formosa-robotics.test',
            'avatar' => null,
        ]);

        Socialite::shouldReceive('driver->user')->andReturn($googleUser);

        auth()->logout();

        $this->get(route('auth.google.callback'))->assertRedirect(route('company.dashboard'));

        $this->assertAuthenticatedAs($user);
        $this->assertSame('google-123', $user->refresh()->google_id);
        $this->assertSame(1, User::where('email', 'hr@formosa-robotics.test')->count());
    }

    public function test_admin_can_approve_a_company_application_from_the_list(): void
    {
        $profile = CompanyProfile::factory()->create();
        $profile->user->assignRole('company');

        Livewire::test(ListCompanies::class)
            ->assertCanSeeTableRecords([$profile->user])
            ->callTableAction('approve', $profile->user);

        $this->assertSame(CompanyProfile::STATUS_APPROVED, $profile->refresh()->status);
        $this->assertNotNull($profile->verified_at);
    }

    public function test_admin_must_give_a_reason_to_deny_a_company_application(): void
    {
        $profile = CompanyProfile::factory()->create();
        $profile->user->assignRole('company');

        Livewire::test(ListCompanies::class)
            ->callTableAction('deny', $profile->user, data: ['rejection_reason' => null])
            ->assertHasTableActionErrors(['rejection_reason' => 'required']);

        $this->assertSame(CompanyProfile::STATUS_PENDING, $profile->refresh()->status);

        Livewire::test(ListCompanies::class)
            ->callTableAction('deny', $profile->user, data: ['rejection_reason' => 'Document is unreadable.']);

        $this->assertSame(CompanyProfile::STATUS_REJECTED, $profile->refresh()->status);
        $this->assertSame('Document is unreadable.', $profile->rejection_reason);
    }

    public function test_company_list_can_be_filtered_by_status(): void
    {
        $pending = CompanyProfile::factory()->create();
        $approved = CompanyProfile::factory()->approved()->create();
        $pending->user->assignRole('company');
        $approved->user->assignRole('company');

        Livewire::test(ListCompanies::class)
            ->filterTable('status', CompanyProfile::STATUS_PENDING)
            ->assertCanSeeTableRecords([$pending->user])
            ->assertCanNotSeeTableRecords([$approved->user]);
    }

    public function test_admin_can_edit_a_company_without_losing_its_profile(): void
    {
        $profile = CompanyProfile::factory()->approved()->create();
        $profile->user->assignRole('company');

        Livewire::test(EditCompany::class, ['record' => $profile->user->getRouteKey()])
            ->assertFormSet(['companyProfile.company_display_name' => $profile->company_display_name])
            ->fillForm(['companyProfile.industry' => 'Semiconductors'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertSame('Semiconductors', $profile->refresh()->industry);
        $this->assertSame(1, CompanyProfile::count());
    }

    public function test_admin_can_review_from_the_dashboard_widget(): void
    {
        $profile = CompanyProfile::factory()->create();

        Livewire::test(PendingCompaniesWidget::class)
            ->assertCanSeeTableRecords([$profile])
            ->callTableAction('deny', $profile, data: ['rejection_reason' => 'Missing tax ID.']);

        $this->assertSame('Missing tax ID.', $profile->refresh()->rejection_reason);
    }

    public function test_admin_can_create_an_approved_teacher_manually(): void
    {
        Livewire::test(CreateTeacher::class)
            ->fillForm([
                'full_name' => 'Lin Mei',
                'email' => 'lin.mei@example.test',
                'expertise' => 'Mandarin',
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $user = User::where('email', 'lin.mei@example.test')->firstOrFail();

        $this->assertSame('Lin Mei', $user->name);
        $this->assertTrue($user->hasRole('teacher'));
        $this->assertSame(TeacherProfile::STATUS_APPROVED, $user->teacherProfile->status);
    }

    public function test_admin_can_approve_and_deny_a_teacher_application_from_the_list(): void
    {
        $teacher = User::factory()->create();
        $teacher->assignRole('teacher');
        $profile = $teacher->teacherProfile()->create(['full_name' => $teacher->name, 'cv_path' => 'teachers/cvs/cv.pdf']);

        Livewire::test(ListTeachers::class)
            ->callTableAction('deny', $teacher, data: ['rejection_reason' => 'CV is incomplete.']);

        $this->assertSame(TeacherProfile::STATUS_REJECTED, $profile->refresh()->status);
        $this->assertSame('CV is incomplete.', $profile->rejection_reason);

        Livewire::test(ListTeachers::class)->callTableAction('approve', $teacher);

        $this->assertSame(TeacherProfile::STATUS_APPROVED, $profile->refresh()->status);
        $this->assertNull($profile->rejection_reason);
        $this->assertNotNull($profile->verified_at);
    }
}
