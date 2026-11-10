import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGES } from '@/i18n';

const SHORT_LABELS = { en: 'EN', id: 'ID', zh: '中文' } as const;

export default function LanguageSwitcher() {
    const { lang, setLang, t } = useLanguage();

    return (
        <div
            role="group"
            aria-label={t('lang.choose')}
            className="flex items-center gap-1 rounded-sm border border-[#24458F]/15 bg-white/70 p-1 text-xs font-bold dark:border-border dark:bg-surface"
        >
            {LANGUAGES.map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    aria-label={t(`lang.${l}`)}
                    aria-pressed={lang === l}
                    lang={l === 'zh' ? 'zh-Hant' : l}
                    className={`rounded-sm px-2 py-1 transition ${
                        lang === l
                            ? 'bg-[#24458F] text-white dark:bg-accent dark:text-[#262018]'
                            : 'text-[#24458F] hover:bg-[#FFE0C2] dark:text-ink dark:hover:bg-surface-muted'
                    }`}
                >
                    {SHORT_LABELS[l]}
                </button>
            ))}
        </div>
    );
}
