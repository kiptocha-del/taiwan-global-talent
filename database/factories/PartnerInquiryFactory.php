<?php

namespace Database\Factories;

use App\Models\PartnerInquiry;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends Factory<PartnerInquiry>
 */
class PartnerInquiryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_name' => fake()->company(),
            'organization_type' => fake()->randomElement(array_keys(PartnerInquiry::ORGANIZATION_TYPES)),
            'website_url' => fake()->url(),
            'logo_path' => null,
            'contact_name' => fake()->name(),
            'contact_email' => fake()->unique()->safeEmail(),
            'involvement_interests' => Arr::random(array_keys(PartnerInquiry::INVOLVEMENT_INTERESTS), 2),
            'message' => fake()->paragraph(),
            'status' => PartnerInquiry::STATUS_NEW,
        ];
    }

    /**
     * Indicate that an admin has approved the partner for public display.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PartnerInquiry::STATUS_APPROVED,
            'logo_path' => 'partner-logos/'.fake()->uuid().'.png',
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Indicate that an admin has declined the partner.
     */
    public function declined(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PartnerInquiry::STATUS_DECLINED,
            'reviewed_at' => now(),
        ]);
    }
}
