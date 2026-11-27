<?php

namespace App\Filament\Resources\Teachers\Pages;

use App\Filament\Resources\Teachers\TeacherResource;
use App\Models\User;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateTeacher extends CreateRecord
{
    protected static string $resource = TeacherResource::class;

    /**
     * The form mixes account and profile fields, so the account, its role and its profile are
     * created together. The teacher then signs in with Google using the same email.
     */
    protected function handleRecordCreation(array $data): Model
    {
        $user = User::create([
            'name' => $data['full_name'],
            'email' => $data['email'],
        ]);

        $user->assignRole('teacher');

        $user->teacherProfile()->create([
            'full_name' => $data['full_name'],
            'phone' => $data['phone'] ?? null,
            'expertise' => $data['expertise'] ?? null,
            'learning_goal' => $data['learning_goal'] ?? null,
            'bio' => $data['bio'] ?? null,
            'status' => $data['status'],
            'rejection_reason' => $data['rejection_reason'] ?? null,
        ]);

        return $user;
    }

    protected function getCreatedNotificationTitle(): ?string
    {
        return 'Teacher registered';
    }
}
