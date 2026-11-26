<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * A message sent through the public Get Involved contact form.
 */
class PartnerInquiry extends Model
{
    use HasFactory;

    public const STATUS_NEW = 'new';

    public const STATUS_CONTACTED = 'contacted';

    public const STATUS_CLOSED = 'closed';

    /**
     * @var array<string, string>
     */
    public const STATUSES = [
        self::STATUS_NEW => 'New',
        self::STATUS_CONTACTED => 'Contacted',
        self::STATUS_CLOSED => 'Closed',
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

    /**
     * Column headings shared by the CSV download and the Google Sheet.
     *
     * @var list<string>
     */
    public const EXPORT_HEADINGS = [
        'Submitted',
        'Organization',
        'Type',
        'Website',
        'Contact name',
        'Contact email',
        'Wants to',
        'Message',
        'Status',
    ];

    protected $fillable = [
        'organization_name',
        'organization_type',
        'website_url',
        'contact_name',
        'contact_email',
        'involvement_interests',
        'message',
        'status',
        'admin_notes',
        'reviewed_at',
    ];

    protected $attributes = [
        'status' => self::STATUS_NEW,
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
    }

    public function getOrganizationTypeLabelAttribute(): string
    {
        return self::ORGANIZATION_TYPES[$this->organization_type] ?? ucfirst(str_replace('_', ' ', $this->organization_type));
    }

    /**
     * One row in the order of EXPORT_HEADINGS.
     *
     * @return list<string>
     */
    public function toExportRow(): array
    {
        $interests = collect($this->involvement_interests)
            ->map(fn (string $interest): string => self::INVOLVEMENT_INTERESTS[$interest] ?? $interest)
            ->implode(', ');

        return [
            (string) $this->created_at?->format('Y-m-d H:i'),
            $this->organization_name,
            $this->organization_type_label,
            (string) $this->website_url,
            $this->contact_name,
            $this->contact_email,
            $interests,
            (string) $this->message,
            self::STATUSES[$this->status] ?? (string) $this->status,
        ];
    }
}
