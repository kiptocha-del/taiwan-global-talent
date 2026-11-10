<?php

namespace Tests\Feature;

use App\Events\CommunityPostCreated;
use App\Models\CommunityPost;
use App\Models\CommunityPostReport;
use App\Models\CompanyProfile;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CommunityControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        // Avatars, logos and post media are addressed through the S3 disk, which has no credentials in testing.
        Storage::fake('s3');
    }

    public function test_each_portal_renders_its_own_community_page(): void
    {
        CommunityPost::factory()->count(2)->create();

        $this->actingAs($this->userWithRole('student'))
            ->get(route('student.community.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Student/Community/Index')
                ->has('initialPosts.data', 2)
                ->has('initialPosts.data.0.user', fn (Assert $user) => $user
                    ->hasAll(['id', 'name', 'avatar_url', 'subtitle', 'university', 'role'])));

        $teacher = $this->userWithRole('teacher');

        $this->actingAs($teacher)
            ->get(route('teacher.community.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teacher/Community/Index')
                ->where('teacher.id', $teacher->id)
                ->has('initialPosts.data', 2));

        $this->actingAs($this->approvedCompanyUser())
            ->get(route('company.community.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Company/Community/Index')
                ->has('company')
                ->has('initialPosts.data', 2));
    }

    public function test_teacher_can_report_a_post(): void
    {
        $post = CommunityPost::factory()->create();
        $teacher = $this->userWithRole('teacher');

        $this->actingAs($teacher)
            ->post(route('teacher.community.posts.report', $post->id), ['reason' => 'Scam / Spam'])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseHas('community_post_reports', [
            'community_post_id' => $post->id,
            'user_id' => $teacher->id,
            'reason' => 'Scam / Spam',
        ]);
        $this->assertModelExists($post);
    }

    public function test_post_is_removed_after_three_reports(): void
    {
        $post = CommunityPost::factory()->create();
        foreach (range(1, 2) as $i) {
            CommunityPostReport::create([
                'community_post_id' => $post->id,
                'user_id' => User::factory()->create()->id,
                'reason' => 'Scam / Spam',
            ]);
        }

        $this->actingAs($this->userWithRole('student'))
            ->post(route('student.community.posts.report', $post->id), ['reason' => 'Scam / Spam'])
            ->assertRedirect();

        $this->assertModelMissing($post);
    }

    public function test_teacher_can_delete_only_their_own_post(): void
    {
        $teacher = $this->userWithRole('teacher');
        $own = CommunityPost::factory()->create(['user_id' => $teacher->id]);
        $someoneElses = CommunityPost::factory()->create();

        $this->actingAs($teacher)
            ->delete(route('teacher.community.posts.destroy', $someoneElses->id))
            ->assertForbidden();

        $this->actingAs($teacher)
            ->delete(route('teacher.community.posts.destroy', $own->id))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertModelMissing($own);
        $this->assertModelExists($someoneElses);
    }

    public function test_teacher_posts_go_through_moderation(): void
    {
        $this->actingAs($this->userWithRole('teacher'))
            ->from(route('teacher.community.index'))
            ->post(route('teacher.community.store'), [
                'content' => 'Win easy money at our slot site tonight',
                'tag' => 'Announcements',
            ])
            ->assertRedirect(route('teacher.community.index'))
            ->assertSessionHasErrors('content');

        $this->assertDatabaseCount('community_posts', 0);
    }

    public function test_teacher_comments_go_through_moderation(): void
    {
        $post = CommunityPost::factory()->create();

        $this->actingAs($this->userWithRole('teacher'))
            ->post(route('teacher.community.comment', $post->id), ['content' => 'judi online here'])
            ->assertSessionHasErrors('content');

        $this->assertDatabaseCount('community_comments', 0);
    }

    public function test_student_posts_are_broadcast_to_the_feed(): void
    {
        Event::fake([CommunityPostCreated::class]);

        $this->actingAs($this->userWithRole('student'))
            ->post(route('student.community.posts.store'), [
                'content' => 'Anyone else preparing for the TOCFL exam this spring?',
                'tag' => 'General',
            ])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertDatabaseCount('community_posts', 1);
        Event::assertDispatched(CommunityPostCreated::class);
    }

    public function test_company_can_like_and_comment_from_its_portal(): void
    {
        $post = CommunityPost::factory()->create();
        $company = $this->approvedCompanyUser();

        $this->actingAs($company)
            ->post(route('company.community.like', $post->id))
            ->assertRedirect();

        $this->assertSame(1, $post->fresh()->likes_count);

        $this->actingAs($company)
            ->post(route('company.community.comment', $post->id), ['content' => 'Welcome aboard!'])
            ->assertRedirect()
            ->assertSessionDoesntHaveErrors();

        $this->assertDatabaseHas('community_comments', [
            'community_post_id' => $post->id,
            'user_id' => $company->id,
        ]);
    }

    private function userWithRole(string $role): User
    {
        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    /**
     * Company routes sit behind the company-status check, so the user needs an approved profile.
     */
    private function approvedCompanyUser(): User
    {
        $user = $this->userWithRole('company');

        CompanyProfile::create([
            'user_id' => $user->id,
            'company_legal_name' => 'Formosa Robotics Co., Ltd.',
            'company_display_name' => 'Formosa Robotics',
            'slug' => 'formosa-robotics-'.$user->id,
            'industry' => 'Robotics',
            'pic_name' => 'Chen Wei',
            'pic_phone' => '+886 2 1234 5678',
            'pic_position' => 'HR Lead',
            'status' => 'approved',
            'verified_at' => now(),
        ]);

        return $user;
    }
}
