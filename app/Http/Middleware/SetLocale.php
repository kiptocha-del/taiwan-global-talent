<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

/**
 * Applies the language the visitor picked in the UI to the backend as well,
 * so flash messages and validation errors match the page.
 *
 * The frontend writes a plain `lang` cookie (en, id or zh); this maps it to the
 * matching Laravel locale and falls back to the configured default otherwise.
 */
class SetLocale
{
    public const COOKIE = 'lang';

    /**
     * Frontend language code => Laravel locale.
     *
     * @var array<string, string>
     */
    public const LOCALES = [
        'en' => 'en',
        'id' => 'id',
        'zh' => 'zh_TW',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $lang = $request->cookie(self::COOKIE);

        if (is_string($lang) && isset(self::LOCALES[$lang])) {
            App::setLocale(self::LOCALES[$lang]);
        }

        return $next($request);
    }

    /**
     * The frontend language code for the locale currently in use.
     */
    public static function currentLanguage(): string
    {
        $language = array_search(App::getLocale(), self::LOCALES, true);

        return $language === false ? 'en' : $language;
    }
}
