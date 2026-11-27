<?php

namespace Tests\Feature;

use App\Models\CompanyJob;
use App\Models\CompanyProfile;
use App\Models\JobApplication;
use App\Models\PartnerInquiry;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompanyOnboardingTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        // Documents and logos live on the S3 disk, which has no credentials in testing.
        Storage::fake('s3');
    }

    public function test_company_without_an_application_is_sent_to_the_form(): void
    {
        $user = $this->companyUser();

        $this->actingAs($user)->get(route('company.dashboard'))->assertRedirect(route('company.register'));
        $this->actingAs($user)->get(route('company.status'))->assertRedirect(route('company.register'));

        $this->actingAs($user)
            ->get(route('company.register'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Company/Apply/Index')
                ->where('existingProfile', null)
                ->where('rejectionReason', null)
                ->has('organizationTypes', count(CompanyProfile::ORGANIZATION_TYPES)));
    }

    public function test_submitting_the_form_creates_a_pending_application(): void
    {
        $user = $this->companyUser();

        $this->actingAs($user)
            ->post(route('company.store'), $this->validApplication())
            ->assertRedirect(route('company.status'));

        $profile = $user->refresh()->companyProfile;

        $this->assertSame(CompanyProfile::STATUS_PENDING, $profile->status);
        $this->assertSame('university', $profile->organization_type);
        $this->assertStringStartsWith('formosa-robotics-', $profile->slug);
        Storage::disk('s3')->assertExists($profile->business_registration_path);
    }

    public function test_application_requires_a_business_document(): void
    {
        $this->actingAs($this->companyUser())
            ->post(route('company.store'), [...$this->validApplication(), 'business_registration_path' => null])
            ->assertSessionHasErrors('business_registration_path');
    }

    public function test_duplicate_tax_id_is_a_validation_error(): void
    {
        CompanyProfile::factory()->create(['tax_id' => '12345678']);

        $this->actingAs($this->companyUser())
            ->post(route('company.store'), [...$this->validApplication(), 'tax_id' => '12345678'])
            ->assertSessionHasErrors('tax_id');
    }

    public function test_pending_company_sees_its_status_and_never_the_form_again(): void
    {
        $user = $this->companyUser();
        CompanyProfile::factory()->for($user)->create();

        $this->actingAs($user)->get(route('company.dashboard'))->assertRedirect(route('company.status'));
        $this->actingAs($user)->get(route('company.register'))->assertRedirect(route('company.status'));

        $this->actingAs($user)
            ->post(route('company.store'), $this->validApplication())
            ->assertRedirect(route('company.status'));

        $this->assertNotSame('Formosa Robotics', $user->refresh()->companyProfile->company_display_name);

        $this->actingAs($user)
            ->get(route('company.status'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Company/Status/Index')
                ->where('status', 'pending')
                ->where('rejectionReason', null));
    }

    public function test_rejected_company_sees_the_reason_and_can_resubmit(): void
    {
        $user = $this->companyUser();
        $profile = CompanyProfile::factory()->for($user)->rejected('Tax ID does not match.')->create();
        $originalSlug = $profile->slug;

        $this->actingAs($user)->get(route('company.dashboard'))->assertRedirect(route('company.status'));

        $this->actingAs($user)
            ->get(route('company.status'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('status', 'rejected')
                ->where('rejectionReason', 'Tax ID does not match.'));

        $this->actingAs($user)
            ->get(route('company.register'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('existingProfile.company_display_name', $profile->company_display_name)
                ->where('hasBusinessDocument', true)
                ->where('rejectionReason', 'Tax ID does not match.'));

        // The earlier document is kept, so a corrected application does not need a new upload.
        $this->actingAs($user)
            ->post(route('company.store'), [...$this->validApplication(), 'business_registration_path' => null])
            ->assertRedirect(route('company.status'));

        $profile->refresh();

        $this->assertSame(CompanyProfile::STATUS_PENDING, $profile->status);
        $this->assertNull($profile->rejection_reason);
        $this->assertSame('Formosa Robotics', $profile->company_display_name);
        $this->assertSame($originalSlug, $profile->slug);
        $this->assertSame(1, CompanyProfile::count());
    }

    public function test_approved_company_goes_straight_to_the_dashboard(): void
    {
        $user = $this->companyUser();
        CompanyProfile::factory()->for($user)->approved()->create();

        $this->actingAs($user)->get(route('company.dashboard'))->assertOk();
        $this->actingAs($user)->get(route('company.status'))->assertRedirect(route('company.dashboard'));
        $this->actingAs($user)->get(route('company.register'))->assertRedirect(route('company.dashboard'));
    }

    public function test_dashboard_metrics_are_counted_from_the_companys_own_postings(): void
    {
        $user = $this->companyUser();
        $profile = CompanyProfile::factory()->for($user)->approved()->create();

        $job = $this->jobFor($profile);
        $job->update(['views_count' => 7]);
        $this->applicationFor($job);
        $this->applicationFor($job)->update(['status' => 'hired']);
        $this->applicationFor($job)->forceFill(['created_at' => now()->subDays(30)])->save();

        // Another company's posting must not leak into these figures.
        $otherJob = $this->jobFor(CompanyProfile::factory()->approved()->create());
        $otherJob->update(['views_count' => 50]);
        $this->applicationFor($otherJob);

        $this->actingAs($user)
            ->get(route('company.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Company/Index')
                ->where('metrics', [
                    'active_jobs' => 1,
                    'total_applicants' => 3,
                    'applicants_this_week' => 2,
                    'job_views' => 7,
                    'hired' => 1,
                ]));
    }

    public function test_suspended_company_is_kept_out_of_the_portal(): void
    {
        $user = $this->companyUser();
        CompanyProfile::factory()->for($user)->suspended()->create();

        $this->actingAs($user)->get(route('company.dashboard'))->assertRedirect(route('company.status'));
        $this->actingAs($user)->get(route('company.register'))->assertRedirect(route('company.status'));
    }

    public function test_other_roles_cannot_use_the_company_application_form(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');

        $this->actingAs($student)->get(route('company.register'))->assertForbidden();
        $this->actingAs($student)->post(route('company.store'), $this->validApplication())->assertForbidden();

        $this->assertSame(0, CompanyProfile::count());
    }

    public function test_approving_sets_the_verified_date_and_clears_the_reason(): void
    {
        $profile = CompanyProfile::factory()->rejected()->create();

        $profile->approve();

        $this->assertNotNull($profile->refresh()->verified_at);
        $this->assertNull($profile->rejection_reason);
    }

    public function test_only_approved_organizations_join_the_partners_on_the_home_page(): void
    {
        $approved = CompanyProfile::factory()->approved()->create(['organization_type' => 'university']);
        CompanyProfile::factory()->create();
        CompanyProfile::factory()->rejected()->create();
        PartnerInquiry::factory()->contacted()->create();

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('partners', 1)
                ->where('partners.0.id', $approved->id)
                ->where('partners.0.name', $approved->company_display_name)
                ->where('partners.0.type', 'University')
                ->where('partners.0.logo_url', Storage::disk('s3')->url($approved->logo_path)));
    }

    public function test_company_can_update_its_profile(): void
    {
        $user = $this->companyUser();
        $profile = CompanyProfile::factory()->for($user)->approved()->create();

        $this->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Chen Wei',
                'company_legal_name' => 'Formosa Robotics Co., Ltd.',
                'company_display_name' => 'Formosa Robotics',
                'pic_name' => 'Chen Wei',
                'pic_position' => 'Director',
                'pic_phone' => '+886 2 5555 0000',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertSame('Formosa Robotics', $profile->refresh()->company_display_name);
        $this->assertSame('Director', $profile->pic_position);
    }

    public function test_company_can_delete_only_its_own_job(): void
    {
        $user = $this->companyUser();
        $profile = CompanyProfile::factory()->for($user)->approved()->create();
        $ownJob = $this->jobFor($profile);
        $otherJob = $this->jobFor(CompanyProfile::factory()->approved()->create());

        $this->actingAs($user)->delete(route('company.jobs.destroy', $otherJob))->assertForbidden();
        $this->actingAs($user)->delete(route('company.jobs.destroy', $ownJob))->assertRedirect(route('company.jobs.index'));

        $this->assertModelMissing($ownJob);
        $this->assertModelExists($otherJob);
    }

    public function test_company_can_update_the_status_of_only_its_own_applicants(): void
    {
        $user = $this->companyUser();
        $profile = CompanyProfile::factory()->for($user)->approved()->create();
        $ownApplication = $this->applicationFor($this->jobFor($profile));
        $otherApplication = $this->applicationFor($this->jobFor(CompanyProfile::factory()->approved()->create()));

        $this->actingAs($user)
            ->patch(route('company.applicants.status', $otherApplication), ['status' => 'hired'])
            ->assertForbidden();

        $this->actingAs($user)
            ->patch(route('company.applicants.status', $ownApplication), ['status' => 'interviewed'])
            ->assertSessionHasNoErrors();

        $this->assertSame('interviewed', $ownApplication->refresh()->status);
        $this->assertSame('pending', $otherApplication->refresh()->status);
    }

    private function companyUser(): User
    {
        $user = User::factory()->create();
        $user->assignRole('company');

        return $user;
    }

    /**
     * @return array<string, mixed>
     */
    private function validApplication(): array
    {
        return [
            'company_legal_name' => 'Formosa Robotics Co., Ltd.',
            'company_display_name' => 'Formosa Robotics',
            'organization_type' => 'university',
            'industry' => 'Education',
            'company_size' => 50,
            'founded_year' => 2015,
            'business_registration_path' => UploadedFile::fake()->create('registration.pdf', 100, 'application/pdf'),
            'pic_name' => 'Chen Wei',
            'pic_phone' => '+886 2 1234 5678',
            'pic_position' => 'HR Lead',
            'country' => 'Taiwan',
        ];
    }

    private function jobFor(CompanyProfile $profile): CompanyJob
    {
        return CompanyJob::create([
            'company_profile_id' => $profile->id,
            'title' => 'Field Engineer',
            'slug' => 'field-engineer-'.$profile->id,
            'type' => 'Full-time',
            'location_type' => 'Remote',
            'status' => 'published',
        ]);
    }

    private function applicationFor(CompanyJob $job): JobApplication
    {
        return JobApplication::create([
            'company_job_id' => $job->id,
            'user_id' => User::factory()->create()->id,
            'candidate_name' => 'Ana Putri',
            'candidate_email' => 'ana@example.com',
            'candidate_phone' => '+62 812 0000 0000',
            'resume_path' => 'resumes/ana.pdf',
            'status' => 'pending',
        ]);
    }
}
