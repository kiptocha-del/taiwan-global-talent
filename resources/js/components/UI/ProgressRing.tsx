import { useEffect, useState } from 'react';

interface ProgressRingProps {
    /** Whole percentage from 0 to 100. */
    value: number;
    /** Outer diameter in pixels. */
    size?: number;
    strokeWidth?: number;
    /** Accessible name, for example "Mandarin Foundations progress". */
    label?: string;
    className?: string;
}

/**
 * Circular progress indicator. The arc starts at twelve o'clock and fills
 * clockwise, animating from empty to the current value on mount.
 */
export default function ProgressRing({
    value,
    size = 96,
    strokeWidth = 8,
    label,
    className ='',
}: ProgressRingProps) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const targetOffset = circumference * (1 - clamped / 100);

    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setOffset(targetOffset));

        return () => cancelAnimationFrame(frame);
    }, [targetOffset]);

    return (
        <div
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label}
            className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
                aria-hidden="true"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className="stroke-surface-muted"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="stroke-brand transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
                />
            </svg>
            <span className="absolute font-display text-lg font-bold text-ink">
                {clamped}%
            </span>
        </div>
    );
}
