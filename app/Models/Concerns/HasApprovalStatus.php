<?php

namespace App\Models\Concerns;

/**
 * Shared review workflow for profiles an admin has to approve (organizations and teachers).
 */
trait HasApprovalStatus
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_SUSPENDED = 'suspended';

    protected static function bootHasApprovalStatus(): void
    {
        static::saving(function (self $profile): void {
            if (! $profile->isDirty('status')) {
                return;
            }

            if ($profile->status === self::STATUS_APPROVED) {
                $profile->verified_at ??= now();
            }

            if (in_array($profile->status, [self::STATUS_APPROVED, self::STATUS_PENDING], true)) {
                $profile->rejection_reason = null;
            }
        });
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function approve(): void
    {
        $this->update(['status' => self::STATUS_APPROVED]);
    }

    public function reject(string $reason): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'rejection_reason' => $reason,
        ]);
    }
}
