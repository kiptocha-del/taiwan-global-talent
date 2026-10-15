<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class AdminAuthenticationTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_non_admin_user_cannot_use_admin_login(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);
        $user->assignRole('student');

        $this->postJson(route('admin.login'), [
            'email' => $user->email,
            'password' => 'correct-password',
        ])->assertForbidden();

        $this->assertGuest();
    }

    public function test_admin_login_rejects_an_incorrect_password(): void
    {
        $admin = User::factory()->create(['password' => 'correct-password']);
        $admin->assignRole('admin');

        $this->postJson(route('admin.login'), [
            'email' => $admin->email,
            'password' => 'incorrect-password',
        ])->assertUnauthorized();

        $this->assertGuest();
    }

    public function test_admin_can_log_in_with_valid_credentials(): void
    {
        $admin = User::factory()->create(['password' => 'correct-password']);
        $admin->assignRole('admin');

        $this->postJson(route('admin.login'), [
            'email' => $admin->email,
            'password' => 'correct-password',
        ])->assertOk()->assertJsonPath('success', true);

        $this->assertAuthenticatedAs($admin);
    }

    public function test_database_seeder_does_not_create_a_known_default_admin(): void
    {
        config()->set('services.bootstrap_admin.email');
        config()->set('services.bootstrap_admin.password');

        $this->seed(DatabaseSeeder::class);

        $this->assertNull(User::where('email', 'admin@gmail.com')->first());
    }

    public function test_admin_login_is_rate_limited(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);
        $user->assignRole('student');

        foreach (range(1, 5) as $attempt) {
            $this->postJson(route('admin.login'), [
                'email' => $user->email,
                'password' => 'correct-password',
            ])->assertForbidden();
        }

        $this->postJson(route('admin.login'), [
            'email' => $user->email,
            'password' => 'correct-password',
        ])->assertTooManyRequests();
    }
}
