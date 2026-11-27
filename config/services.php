<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    // 'postmark' => [
    //     'key' => env('POSTMARK_API_KEY'),
    // ],

    // 'resend' => [
    //     'key' => env('RESEND_API_KEY'),
    // ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    // 'slack' => [
    //     'notifications' => [
    //         'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
    //         'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
    //     ],
    // ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI') ?: rtrim(env('APP_URL', 'http://localhost'), '/').'/auth/google/callback',
        'refresh_token' => env('GOOGLE_REFRESH_TOKEN'),
        'tts_credentials' => env('GOOGLE_TTS_APPLICATION_CREDENTIALS'),
        'application_credentials' => env('GOOGLE_APPLICATION_CREDENTIALS'),
    ],

    // Mirrors Get Involved contact form messages into a Google Sheet (optional).
    'google_sheets' => [
        'credentials' => env('GOOGLE_SHEETS_CREDENTIALS'),
        'spreadsheet_id' => env('GOOGLE_SHEETS_SPREADSHEET_ID'),
        'tab' => env('GOOGLE_SHEETS_TAB', 'Sheet1'),
    ],

    'sightengine' => [
        'api_user' => env('SIGHTENGINE_API_USER'),
        'api_secret' => env('SIGHTENGINE_API_SECRET'),
    ],

    'bootstrap_admin' => [
        'name' => env('ADMIN_NAME', 'Administrator'),
        'email' => env('ADMIN_EMAIL'),
        'password' => env('ADMIN_PASSWORD'),
    ],
];
