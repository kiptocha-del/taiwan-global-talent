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
            'contact_name' => fake()->name(),
            'contact_email' => fake()->unique()->safeEmail(),
            'involvement_interests' => Arr::random(array_keys(PartnerInquiry::INVOLVEMENT_INTERESTS), 2),
            'message' => fake()->paragraph(),
            'status' => PartnerInquiry::STATUS_NEW,
        ];
    }

    /**
     * Indicate that the admin team has replied to the sender.
     */
    public function contacted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PartnerInquiry::STATUS_CONTACTED,
            'reviewed_at' => now(),
        ]);
    }

    /**
     * Indicate that the conversation is finished.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PartnerInquiry::STATUS_CLOSED,
            'reviewed_at' => now(),
        ]);
    }
}
