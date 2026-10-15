<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_home_page_is_available_to_guests(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Landing')
                ->where('auth.user', null));
    }

    public function test_about_page_is_available_to_guests(): void
    {
        $this->get(route('about'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('About')
                ->where('auth.user', null));
    }

    public function test_login_page_is_available_to_guests(): void
    {
        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Auth/LoginPage'));
    }
}
