<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'category_id',
        'title',
        'slug',
        'description',
        'level',
        'order',
        'status',
        'is_published',
        'google_slides_template_id',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments', 'module_id', 'user_id')
            ->withPivot('completed_lessons_count', 'is_completed', 'completed_at')
            ->withTimestamps();
    }

    public function courseCategory(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'category_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'category_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'module_id');
    }

    /**
     * Number of this module's lessons the user has completed.
     */
    public function completedLessonCountFor(int $userId): int
    {
        return $this->lessons()
            ->whereHas('progress', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('is_completed', true);
            })->count();
    }

    public function isCompletedByUser(int $userId): bool
    {
        $totalLessons = $this->lessons()->count();

        return $totalLessons > 0 && $this->completedLessonCountFor($userId) === $totalLessons;
    }
}
