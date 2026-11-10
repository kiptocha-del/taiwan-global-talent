import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from '../../vendor/tightenco/ziggy';
import { LanguageProvider } from './context/LanguageContext';
import { isLang } from './i18n';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name: string) => {
        const pages = import.meta.glob('./pages/**/*.tsx');

        return resolvePageComponent(`./pages/${name}.tsx`, pages) as any;
    },

    setup({ el, App, props }) {
        if (!el || typeof window === 'undefined') {
            return;
        }

        // Fix window.route
        (window as any).route = route;

        // The server reads the `lang` cookie and shares the active locale with every page.
        const locale = (props.initialPage.props as { locale?: unknown }).locale;

        createRoot(el).render(
            <LanguageProvider initialLang={isLang(locale) ? locale : undefined}>
                <App {...props} />
            </LanguageProvider>,
        );
    },

    progress: {
        color: '#E60063',
    },
});
