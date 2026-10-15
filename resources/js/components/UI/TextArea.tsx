import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export default function TextArea({
    label,
    error,
    helperText,
    rows = 4,
    className = '',
    id,
    ...props
}: TextAreaProps) {
    const textAreaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={textAreaId}
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textAreaId}
                rows={rows}
                className={`w-full rounded-xl border px-3 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 ${
                    error
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${className}`}
                {...props}
            />
            {error ? (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-400">{helperText}</p>
            ) : null}
        </div>
    );
}