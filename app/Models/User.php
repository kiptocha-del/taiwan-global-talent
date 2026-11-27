<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasRole('admin');
    }

    protected $fillable = [
        'name', 'email', 'password', 'google_id', 'avatar',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relasi Utama
    public function module()
    {
        return $this->belongsToMany(Module::class, 'enrollments')
            ->withPivot('completed_lessons_count', 'is_completed', 'completed_at')
            ->withTimestamps();
    }

    // Pendekatan One-to-One Terpisah
    /**
     * @return HasOne<StudentProfile, $this>
     */
    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    /**
     * @return HasOne<TeacherProfile, $this>
     */
    public function teacherProfile(): HasOne
    {
        return $this->hasOne(TeacherProfile::class);
    }

    /**
     * @return HasOne<CompanyProfile, $this>
     */
    public function companyProfile(): HasOne
    {
        return $this->hasOne(CompanyProfile::class, 'user_id');
    }

    /**
     * @return HasOne<AdminProfile, $this>
     */
    public function adminProfile(): HasOne
    {
        return $this->hasOne(AdminProfile::class);
    }

    // Profile for the user's role without an N+1 query
    public function getProfile()
    {
        $roleSlug = $this->roles->first()?->name ?? 'student';

        return match ($roleSlug) {
            'teacher' => $this->teacherProfile,
            'student' => $this->studentProfile,
            'company' => $this->companyProfile,
            'admin' => $this->adminProfile,
            default => null,
        };
    }

    public function getDisplayNameAttribute(): string
    {
        if ($this->relationLoaded('companyProfile') && $this->companyProfile) {
            return $this->companyProfile->company_display_name;
        }

        return $this->name;
    }

    // 2. Automatic subtitle (company industry / university)
    public function getDisplaySubtitleAttribute(): string
    {
        if ($this->relationLoaded('companyProfile') && $this->companyProfile) {
            return $this->companyProfile->industry ?? 'Official Company Account';
        }

        return $this->university ?? 'Taiwan Alumni';
    }

    // 3. Automatic avatar URL (company logo on Cloudflare R2, or the user avatar)
    public function getDisplayAvatarAttribute(): ?string
    {
        if ($this->relationLoaded('companyProfile') && $this->companyProfile?->logo_path) {
            return Storage::disk('s3')->url($this->companyProfile->logo_path);
        }

        return $this->avatar_url;
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    public function getDashboardUrl(): string
    {
        return match ($this->getRoleNames()->first()) {
            'admin' => '/admin/dashboard',
            'teacher' => '/teacher/dashboard',
            'company' => '/company/dashboard',
            default => '/student/dashboard',
        };
    }
}
