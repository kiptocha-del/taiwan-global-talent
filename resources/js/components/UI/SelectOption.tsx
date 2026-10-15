import React from 'react';

export interface SelectItemOption {
    value: string;
    label: string;
}

interface SelectOptionProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
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
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-xl border px-3 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 ${
                    error
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${className}`}
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
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        </div>
    );
}