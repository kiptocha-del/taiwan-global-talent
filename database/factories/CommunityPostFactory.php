<?php

namespace Database\Factories;

use App\Models\CommunityPost;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CommunityPost>
 */
class CommunityPostFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'content' => fake()->paragraph(),
            'media_path' => null,
            'media_type' => null,
            'is_pinned' => false,
            'likes_count' => 0,
        ];
    }
}
