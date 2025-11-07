<?php

return [

    'defaults' => [
        'guard' => 'api',      // API por defecto (Sanctum)
        'passwords' => 'users',
    ],

    'guards' => [
        // Guard de sesión (lo podés dejar por compatibilidad)
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],

        // Guard para APIs con Sanctum (tokens personales)
        'api' => [
            'driver'   => 'sanctum',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model'  => \App\Models\Usuario::class, // <- tu modelo de socios
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => 'password_reset_tokens',
            'expire'   => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,

];