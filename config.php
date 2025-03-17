<?php

return [
    'secret_key' => env('SECRET_KEY', 'default_secret'),
    'debug' => env('APP_DEBUG', true),
    'database_url' => env('DATABASE_URL', 'sqlite:database/database.sqlite'),
];
