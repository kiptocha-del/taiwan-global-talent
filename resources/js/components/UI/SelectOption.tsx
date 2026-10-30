import React from 'react';

export interface SelectItemOption {
    value: string;
    label: string;
}

interface SelectOptionProps extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'onChange'
> {
    label?: string;
    options: SelectItemOption[];
    onChange: (value: string) => void;
    error?: string;
    placeholderOption?: string;
}

export default function SelectOption({
    label,
    value,
    onChange,
    options,
    error,
    placeholderOption,
    className = '',
    id,
    ...props
}: SelectOptionProps) {
    const selectId =
        id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-xs font-semibold text-ink"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-control border px-3 py-2.5 text-xs transition-all focus:ring-2 focus:outline-none ${
                    error
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-border focus:border-brand focus:ring-brand/20'
                } cursor-pointer bg-surface text-ink disabled:cursor-not-allowed disabled:bg-surface-muted ${className}`}
                {...props}
            >
                {placeholderOption && (
                    <option value="" disabled>
                        {placeholderOption}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-xs font-medium text-status-danger">
                    {error}
                </p>
            )}
        </div>
    );
}
