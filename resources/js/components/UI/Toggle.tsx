interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

export default function Toggle({
    label,
    checked,
    onChange,
    disabled = false,
}: ToggleProps) {
    return (
        <label className="inline-flex cursor-pointer items-center gap-3 select-none">
            <span className="text-sm font-medium text-ink">{label}</span>
            <span className="relative inline-flex">
                <input
                    type="checkbox"
                    role="switch"
                    className="peer sr-only"
                    checked={checked}
                    disabled={disabled}
                    aria-checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                />
                <span className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:cursor-not-allowed peer-disabled:opacity-50"/>
                <span className="pointer-events-none absolute top-1 left-1 size-4 rounded-full bg-surface shadow-sm transition-transform peer-checked:translate-x-5"/>
            </span>
        </label>
    );
}
