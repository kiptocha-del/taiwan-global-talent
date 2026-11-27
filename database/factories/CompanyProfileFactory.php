<?php

namespace Database\Factories;

use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CompanyProfile>
 */
class CompanyProfileFactory extends Factory
{
    /**
     * Define the model's default state: an application waiting for review.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'user_id' => User::factory(),
            'company_legal_name' => $name.' Co., Ltd.',
            'company_display_name' => $name,
            'organization_type' => 'employer',
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 999999),
            'industry' => 'Technology / IT',
            'business_registration_path' => 'companies/legals/'.fake()->uuid().'.pdf',
            'website_url' => fake()->url(),
            'country' => 'Taiwan',
            'pic_name' => fake()->name(),
            'pic_phone' => '+886 2 1234 5678',
            'pic_position' => 'HR Lead',
            'status' => CompanyProfile::STATUS_PENDING,
        ];
    }

    /**
     * Indicate that an admin has approved the organization.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CompanyProfile::STATUS_APPROVED,
            'logo_path' => 'company-logos/'.fake()->uuid().'.png',
        ]);
    }

    /**
     * Indicate that an admin has denied the application.
     */
    public function rejected(string $reason = 'The business document is unreadable.'): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CompanyProfile::STATUS_REJECTED,
            'rejection_reason' => $reason,
        ]);
    }

    /**
     * Indicate that an admin has suspended the organization.
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CompanyProfile::STATUS_SUSPENDED,
        ]);
    }
}
