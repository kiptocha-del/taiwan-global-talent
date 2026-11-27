<?php

namespace Tests\Feature;

use App\Http\Middleware\SetLocale;
use App\Models\Module;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_pages_default_to_english(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('locale', 'en'));

        $this->assertSame('en', app()->getLocale());
    }

    public function test_language_cookie_sets_the_backend_locale(): void
    {
        // The browser writes the cookie in plain text, so it must be accepted unencrypted.
        $this->withUnencryptedCookie(SetLocale::COOKIE, 'id')
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('locale', 'id'));

        $this->assertSame('id', app()->getLocale());

        $this->withUnencryptedCookie(SetLocale::COOKIE, 'zh')
            ->get(route('home'))
            ->assertInertia(fn (Assert $page) => $page->where('locale', 'zh'));

        $this->assertSame('zh_TW', app()->getLocale());
    }

    public function test_unknown_language_falls_back_to_english(): void
    {
        $this->withUnencryptedCookie(SetLocale::COOKIE, 'xx')
            ->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('locale', 'en'));

        $this->assertSame('en', app()->getLocale());
    }

    public function test_flash_messages_follow_the_language_cookie(): void
    {
        $this->seed(RoleSeeder::class);

        $student = User::factory()->create();
        $student->assignRole('student');
        $module = Module::factory()->create();

        $this->actingAs($student)
            ->post(route('student.courses.enroll', $module))
            ->assertRedirect()
            ->assertSessionHas('success', 'Enrolled successfully. Happy learning!');

        $this->actingAs($student)
            ->withUnencryptedCookie(SetLocale::COOKIE, 'id')
            ->post(route('student.courses.enroll', $module))
            ->assertRedirect()
            ->assertSessionHas('message', 'Anda sudah terdaftar di modul ini.');
    }

    public function test_partner_form_choices_are_translated(): void
    {
        $this->get(route('get-involved'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('organizationTypes.0.label', 'University'));

        $this->withUnencryptedCookie(SetLocale::COOKIE, 'zh')
            ->get(route('get-involved'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('organizationTypes.0.label', '大學'));
    }

    public function test_admin_panel_follows_the_language_cookie(): void
    {
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        // Widgets load lazily over Livewire, so check the document language instead of a label.
        $this->actingAs($admin)
            ->get('/admin')
            ->assertOk()
            ->assertSee('lang="en"', false);

        $this->actingAs($admin)
            ->withUnencryptedCookie(SetLocale::COOKIE, 'zh')
            ->get('/admin')
            ->assertOk()
            ->assertSee('lang="zh-TW"', false);

        $this->assertSame('zh_TW', app()->getLocale());
    }
}
