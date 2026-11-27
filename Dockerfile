# Container image for Vercel's Container runtime: FrankenPHP (Caddy + PHP) serving Laravel.

FROM dunglas/frankenphp:1-php8.4-bookworm AS base

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && install-php-extensions intl zip pdo_mysql bcmath opcache \
    && printf 'upload_max_filesize=20M\npost_max_size=25M\n' > "$PHP_INI_DIR/conf.d/uploads.ini"

WORKDIR /app

# PHP dependencies and application source.
FROM base AS dependencies

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --no-scripts --prefer-dist

COPY . .
RUN mkdir -p \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && composer dump-autoload --no-dev --optimize

# Frontend build. It runs on top of the PHP stage because the Wayfinder Vite
# plugin calls `php artisan wayfinder:generate` to create the route helpers.
FROM dependencies AS assets

COPY --from=node:22-bookworm-slim /usr/local/bin /usr/local/bin
COPY --from=node:22-bookworm-slim /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN npm ci --no-audit --no-fund && npm run build

FROM base AS runtime

COPY --from=dependencies --chown=www-data:www-data /app /app
COPY --from=assets --chown=www-data:www-data /app/public/build /app/public/build
COPY --chown=www-data:www-data Caddyfile /etc/frankenphp/Caddyfile

RUN setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp \
    && chown -R www-data:www-data /config/caddy /data/caddy

# Config is deliberately not cached: Vercel injects APP_KEY, DB_* and the other
# secrets at runtime, so they are not available while the image is built.
ENV PORT=80 \
    APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    QUEUE_CONNECTION=sync

USER www-data

RUN php artisan storage:link && php artisan view:cache

CMD ["frankenphp", "run", "--config", "/etc/frankenphp/Caddyfile"]
