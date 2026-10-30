import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-brand transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            <Moon className="size-4 dark:hidden" aria-hidden="true" />
            <Sun className="hidden size-4 dark:block" aria-hidden="true" />
        </button>
    );
}
