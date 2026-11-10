<?php

namespace Database\Factories;

use App\Models\CourseCategory;
use App\Models\Module;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Module>
 */
class ModuleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'teacher_id' => User::factory(),
            'category_id' => CourseCategory::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'level' => fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']),
            'order' => fake()->numberBetween(0, 10),
            'status' => 'published',
            'is_published' => true,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn () => ['status' => 'draft', 'is_published' => false]);
    }
}
