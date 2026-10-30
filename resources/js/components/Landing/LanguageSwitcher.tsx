import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
    const { lang, setLang } = useLanguage();

    return (
        <div
            role="group"
            aria-label="Choose language"
            className="flex items-center gap-1 rounded-sm border border-[#24458F]/15 bg-white/70 p-1 text-xs font-bold dark:border-border dark:bg-surface"
        >
            {(['en', 'id', 'zh'] as const).map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    aria-label={
                        l === 'en'
                            ? 'English'
                            : l === 'id'
                              ? 'Bahasa Indonesia'
                              : 'Traditional Chinese'
                    }
                    aria-pressed={lang === l}
                    className={`rounded-sm px-2 py-1 transition ${
                        lang === l
                            ? 'bg-[#24458F] text-white dark:bg-accent dark:text-[#262018]'
                            : 'text-[#24458F] hover:bg-[#FFE0C2] dark:text-ink dark:hover:bg-surface-muted'
                    }`}
                >
                    {l === 'zh' ? '中文' : l.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
