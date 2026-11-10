import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import {
    DEFAULT_LANG,
    htmlLang,
    readLanguageCookie,
    setCurrentLang,
    translate,
    writeLanguageCookie,
} from '@/i18n';
import type { Lang, TranslationKey, TranslationVars } from '@/i18n';

export type { Lang } from '@/i18n';

type LanguageContextType = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: TranslationKey, vars?: TranslationVars) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
    children: ReactNode;
    /**
     * The language the server rendered the page with (from the shared `locale` prop).
     * It already reflects the `lang` cookie, so both sides start in step.
     */
    initialLang?: Lang;
}

export function LanguageProvider({
    children,
    initialLang,
}: LanguageProviderProps) {
    const [lang, setLangState] = useState<Lang>(
        () => initialLang ?? readLanguageCookie() ?? DEFAULT_LANG,
    );

    // Keep the non-React translate helper in step before the first paint.
    setCurrentLang(lang);

    useEffect(() => {
        setCurrentLang(lang);

        if (typeof document !== 'undefined') {
            document.documentElement.lang = htmlLang(lang);
        }
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        writeLanguageCookie(next);
        setLangState(next);
    }, []);

    const value = useMemo<LanguageContextType>(
        () => ({
            lang,
            setLang,
            t: (key, vars) => translate(lang, key, vars),
        }),
        [lang, setLang],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }

    return context;
}

/**
 * Translation hook for components. Re-renders when the language changes.
 */
export function useTranslation() {
    const { t, lang } = useLanguage();

    return { t, lang };
}
