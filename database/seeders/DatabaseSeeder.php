<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            VocabularySeeder::class,
            CourseCategorySeeder::class,
            LessonMandarinSeeder::class,
        ]);

        $adminEmail = config('services.bootstrap_admin.email');
        $adminPassword = config('services.bootstrap_admin.password');

        if ($adminEmail && $adminPassword) {
            $user = User::updateOrCreate(
                ['email' => $adminEmail],
                [
                    'name' => config('services.bootstrap_admin.name'),
                    'password' => Hash::make($adminPassword),
                    'email_verified_at' => now(),
                ],
            );

            $user->syncRoles(['admin']);
        }
    }
}
