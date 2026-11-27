<?php

namespace App\Models;

use App\Models\Concerns\HasApprovalStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CompanyProfile extends Model
{
    use HasApprovalStatus, HasFactory;

    /**
     * A partner and a company are the same account, told apart by this type.
     *
     * @var array<string, string>
     */
    public const ORGANIZATION_TYPES = PartnerInquiry::ORGANIZATION_TYPES;

    protected $fillable = [
        'user_id',
        'company_legal_name',
        'company_display_name',
        'organization_type',

        'tax_id',
        'business_registration_path',
        'slug',
        'logo_path',
        'banner_path',
        'industry',
        'company_size',
        'founded_year',
        'website_url',
        'bio',
        'description',

        'hq_address',
        'city',
        'country',
        'official_email',

        'pic_name',
        'pic_phone',
        'pic_position',

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

    public function jobs()
    {
        return $this->hasMany(CompanyJob::class);
    }

    public function organizationTypeLabel(): string
    {
        return self::ORGANIZATION_TYPES[$this->organization_type]
            ?? ucfirst(str_replace('_', ' ', (string) $this->organization_type));
    }

    /**
     * Approved organizations shaped for the public landing and Get Involved pages.
     *
     * @return array<int, array{id: int, name: string, type: string, website_url: string|null, logo_url: string|null}>
     */
    public static function approvedForDisplay(?int $limit = null): array
    {
        return self::query()
            ->where('status', self::STATUS_APPROVED)
            ->orderByDesc('verified_at')
            ->orderByDesc('id')
            ->when($limit, fn ($query) => $query->limit($limit))
            ->get()
            ->map(fn (CompanyProfile $profile) => [
                'id' => $profile->id,
                'name' => $profile->company_display_name,
                'type' => $profile->organizationTypeLabel(),
                'website_url' => $profile->website_url,
                'logo_url' => $profile->logo_path ? Storage::disk('s3')->url($profile->logo_path) : null,
            ])
            ->all();
    }
}
