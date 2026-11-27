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
    className ='',
    id,
    ...props
}: TextAreaProps) {
    const textAreaId =
        id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={textAreaId}
                    className="block text-xs font-semibold text-ink"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textAreaId}
                rows={rows}
                className={`w-full rounded-control border px-3 py-2.5 text-xs transition-all focus:ring-2 focus:outline-none ${
                    error
                        ? 'border-status-danger focus:border-status-danger focus:ring-status-danger/20'
                        : 'border-border focus:border-brand focus:ring-brand/20'
                } bg-surface text-ink placeholder:text-muted disabled:cursor-not-allowed disabled:bg-surface-muted ${className}`}
                {...props}
            />
            {error ? (
                <p className="text-xs font-medium text-status-danger">
                    {error}
                </p>
            ) : helperText ? (
                <p className="text-xs text-muted">{helperText}</p>
            ) : null}
        </div>
    );
}
