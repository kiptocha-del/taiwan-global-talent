import { en } from './en';
import { id } from './id';
import { zh } from './zh';

export type Lang = 'en' | 'id' | 'zh';

export type TranslationKey = keyof typeof en;

export type Dictionary = Record<TranslationKey, string>;

export const LANGUAGES: readonly Lang[] = ['en', 'id', 'zh'];

export const DEFAULT_LANG: Lang = 'en';

export const LANGUAGE_COOKIE = 'lang';

const dictionaries: Record<Lang, Dictionary> = { en, id, zh };

export function isLang(value: unknown): value is Lang {
    return typeof value === 'string' && (LANGUAGES as string[]).includes(value);
}

/**
 * Values substituted into `{placeholder}` tokens inside a translation.
 */
export type TranslationVars = Record<string, string | number>;

/**
 * Look up a key in the given language, falling back to English and then to the key itself.
 */
export function translate(
    lang: Lang,
    key: TranslationKey,
    vars?: TranslationVars,
): string {
    const text = dictionaries[lang][key] ?? dictionaries.en[key] ?? key;

    if (!vars) {
        return text;
    }

    return text.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
    );
}

/**
 * The HTML `lang` attribute value for a language.
 */
export function htmlLang(lang: Lang): string {
    return lang === 'zh' ? 'zh-Hant' : lang;
}

export function readLanguageCookie(): Lang | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const match = document.cookie.match(
        new RegExp(`(?:^|; )${LANGUAGE_COOKIE}=([^;]*)`),
    );
    const value = match ? decodeURIComponent(match[1]) : null;

    return isLang(value) ? value : null;
}

export function writeLanguageCookie(lang: Lang): void {
    if (typeof document === 'undefined') {
        return;
    }

    const oneYear = 60 * 60 * 24 * 365;

    document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/; max-age=${oneYear}; SameSite=Lax`;
}

// The language currently applied, kept here so code outside React (helpers, alerts) can translate too.
let currentLang: Lang = DEFAULT_LANG;

export function setCurrentLang(lang: Lang): void {
    currentLang = lang;
}

export function getCurrentLang(): Lang {
    return currentLang;
}

/**
 * Translate with the language currently applied. Prefer `useTranslation()` inside components
 * so they re-render when the language changes.
 */
export function t(key: TranslationKey, vars?: TranslationVars): string {
    return translate(currentLang, key, vars);
}
