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
            style: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        reviewed: {
            label: 'Reviewed',
            style: 'bg-blue-50 text-blue-700 border-blue-200',
        },
        interviewed: {
            label: 'Interviewed',
            style: 'bg-purple-50 text-purple-700 border-purple-200',
        },
        hired: {
            label: 'Hired',
            style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        rejected: {
            label: 'Rejected',
            style: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        published: {
            label: 'Published',
            style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        draft: {
            label: 'Draft',
            style: 'bg-gray-100 text-gray-600 border-gray-200',
        },
        closed: {
            label: 'Closed',
            style: 'bg-rose-50 text-rose-700 border-rose-200',
        },
        approved: {
            label: 'Approved',
            style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
    };

    const current = config[normalized] || {
        label: customLabel || status,
        style: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${current.style}`}
        >
            {customLabel || current.label}
        </span>
    );
}
