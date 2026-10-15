import React from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export default function InputText({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: InputTextProps) {
    const inputId =
        id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full rounded-xl border px-3 py-2.5 text-xs transition-all focus:ring-2 focus:outline-none ${
                    error
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700'
                } bg-white text-slate-900 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800 ${className}`}
                {...props}
            />
            {error ? (
                <p className="text-xs font-medium text-rose-500">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-400">{helperText}</p>
            ) : null}
        </div>
    );
}
