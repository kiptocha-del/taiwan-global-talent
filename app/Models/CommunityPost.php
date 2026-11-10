<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class CommunityPost extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'content', 'media_path', 'media_type', 'is_pinned', 'likes_count'];

    // Full Cloudflare R2 URL for the React frontend
    protected $appends = ['media_url'];

    public function getMediaUrlAttribute(): ?string
    {
        return $this->media_path ? Storage::disk('s3')->url($this->media_path) : null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(CommunityComment::class)->whereNull('parent_id');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(CommunityPostLike::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(CommunityPostReport::class);
    }
}
