import React from 'react';

type StatusType =
    | 'pending'
    | 'reviewed'
    | 'interviewed'
    | 'hired'
    | 'rejected'
    | 'published'
    | 'draft'
    | 'closed'
    | 'approved'
    | string;

interface StatusBadgeProps {
    status: StatusType;
    customLabel?: string;
}

export default function StatusBadge({ status, customLabel }: StatusBadgeProps) {
    const normalized = status.toLowerCase();

    const config: Record<string, { label: string; style: string }> = {
        pending: {
            label: 'Pending',
            style: 'bg-status-warning-soft text-status-warning border-status-warning/20',
        },
        reviewed: {
            label: 'Reviewed',
            style: 'bg-status-info-soft text-status-info border-status-info/20',
        },
        interviewed: {
            label: 'Interviewed',
            style: 'bg-accent-soft text-accent border-accent/20',
        },
        hired: {
            label: 'Hired',
            style: 'bg-status-positive-soft text-status-positive border-status-positive/20',
        },
        rejected: {
            label: 'Rejected',
            style: 'bg-status-danger-soft text-status-danger border-status-danger/20',
        },
        published: {
            label: 'Published',
            style: 'bg-status-positive-soft text-status-positive border-status-positive/20',
        },
        draft: {
            label: 'Draft',
            style: 'bg-status-neutral-soft text-status-neutral border-border',
        },
        closed: {
            label: 'Closed',
            style: 'bg-status-danger-soft text-status-danger border-status-danger/20',
        },
        approved: {
            label: 'Approved',
            style: 'bg-status-positive-soft text-status-positive border-status-positive/20',
        },
    };

    const current = config[normalized] || {
        label: customLabel || status,
        style: 'bg-status-neutral-soft text-status-neutral border-border',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${current.style}`}
        >
            {customLabel || current.label}
        </span>
    );
}
