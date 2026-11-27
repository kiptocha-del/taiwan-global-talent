<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    use HasFactory;

    /**
     * Mass assignable attributes.
     */
    protected $fillable = [
        'user_id',
        'module_id',
        'completed_lessons_count',
        'is_completed',
        'completed_at',
        'certificate_path', // Path of the generated certificate on the R2/S3 disk
    ];

    /**
     * Attribute casts so PHP and JavaScript agree on types.
     */
    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'completed_lessons_count' => 'integer',
    ];

    /**
     * Relasi balik ke User (Siswa).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The module this enrollment belongs to.
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
