import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    children?: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon,
    iconPosition = 'left',
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    // Base Styles
    const baseStyles =
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    // Variant Styles
    const variantStyles: Record<ButtonVariant, string> = {
        primary:
            'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs focus:ring-indigo-500 shadow-indigo-500/20 dark:bg-indigo-600 dark:hover:bg-indigo-700',
        secondary:
            'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus:ring-slate-400',
        outline:
            'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:ring-indigo-500',
        danger:
            'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500 shadow-rose-500/20',
        ghost:
            'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400',
    };

    // Size Styles
    const sizeStyles: Record<ButtonSize, string> = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-xs gap-2',
        lg: 'px-5 py-2.5 text-sm gap-2.5',
    };

    // Icon Sizes according to button size
    const iconSizes: Record<ButtonSize, string> = {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-4.5 w-4.5',
    };

    const iconSizeClass = iconSizes[size];

    return (
        <button
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 className={`${iconSizeClass} animate-spin`} />
            ) : (
                Icon && iconPosition === 'left' && <Icon className={iconSizeClass} />
            )}

            {children && <span>{children}</span>}

            {!isLoading && Icon && iconPosition === 'right' && (
                <Icon className={iconSizeClass} />
            )}
        </button>
    );
}