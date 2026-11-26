<?php

namespace App\Models;

use App\Models\Concerns\HasApprovalStatus;
use Illuminate\Database\Eloquent\Model;

class TeacherProfile extends Model
{
    use HasApprovalStatus;

    protected $fillable = [
        'user_id',
        'full_name',
        'phone',
        'bio',
        'cv_path',
        'expertise',
        'certificate_path',
        'learning_goal',
        'status',
        'rejection_reason',
        'verified_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The profile row is created at sign-up, so the CV is what marks a submitted application.
     */
    public function hasApplied(): bool
    {
        return filled($this->cv_path);
    }
}
