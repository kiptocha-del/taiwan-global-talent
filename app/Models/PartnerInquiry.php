<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PartnerInquiry extends Model
{
    use HasFactory;

    public const STATUS_NEW = 'new';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_DECLINED = 'declined';

    /**
     * @var array<string, string>
     */
    public const STATUSES = [
        self::STATUS_NEW => 'New',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_DECLINED => 'Declined',
    ];

    /**
     * @var array<string, string>
     */
    public const ORGANIZATION_TYPES = [
        'university' => 'University',
        'mandarin_center' => 'Mandarin center',
        'scholarship_program' => 'Scholarship program',
        'employer' => 'Taiwan employer',
        'community_mentor' => 'Community mentor',
        'other' => 'Other organization',
    ];

    /**
     * @var array<string, string>
     */
    public const INVOLVEMENT_INTERESTS = [
        'host_interns' => 'Host interns',
        'hire_talent' => 'Hire international talent',
        'offer_scholarships' => 'Offer scholarships',
        'teach_mandarin' => 'Teach Mandarin',
        'mentor' => 'Mentor learners',
        'other' => 'Something else',
    ];

    protected $fillable = [
        'organization_name',
        'organization_type',
        'website_url',
        'logo_path',
        'contact_name',
        'contact_email',
        'involvement_interests',
        'message',
        'status',
        'admin_notes',
        'reviewed_at',
    ];

    protected $casts = [
        'involvement_interests' => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (PartnerInquiry $inquiry) {
            if ($inquiry->isDirty('status') && $inquiry->status !== self::STATUS_NEW && $inquiry->reviewed_at === null) {
                $inquiry->reviewed_at = now();
            }
        });

        static::deleting(function (PartnerInquiry $inquiry) {
            if ($inquiry->logo_path) {
                Storage::disk('s3')->delete($inquiry->logo_path);
            }
        });
    }

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? Storage::disk('s3')->url($this->logo_path) : null;
    }

    public function getOrganizationTypeLabelAttribute(): string
    {
        return self::ORGANIZATION_TYPES[$this->organization_type] ?? ucfirst(str_replace('_', ' ', $this->organization_type));
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Approved partners shaped for the public landing and Get Involved pages.
     *
     * @return array<int, array{id: int, name: string, type: string, website_url: string|null, logo_url: string|null}>
     */
    public static function approvedForDisplay(?int $limit = null): array
    {
        return self::query()
            ->approved()
            ->orderByDesc('reviewed_at')
            ->orderByDesc('id')
            ->when($limit, fn (Builder $query) => $query->limit($limit))
            ->get()
            ->map(fn (PartnerInquiry $inquiry) => [
                'id' => $inquiry->id,
                'name' => $inquiry->organization_name,
                'type' => $inquiry->organization_type_label,
                'website_url' => $inquiry->website_url,
                'logo_url' => $inquiry->logo_url,
            ])
            ->all();
    }
}
