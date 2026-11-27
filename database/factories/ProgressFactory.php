<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Progress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Progress>
 */
class ProgressFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'lesson_id' => Lesson::factory(),
            'is_completed' => true,
        ];
    }
}
