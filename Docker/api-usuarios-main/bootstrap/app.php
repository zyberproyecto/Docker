<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global: respeta config/cors.php
        $middleware->use([
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Alias útiles para APIs
        $middleware->alias([
            'auth'      => \Illuminate\Auth\Middleware\Authenticate::class, // usado por auth:sanctum
            'throttle'  => \Illuminate\Routing\Middleware\ThrottleRequests::class,

            // Sanctum (abilities opcionales)
            'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability'   => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,

            // NUEVO: sólo socios aprobados (lo usaremos en api-cooperativa)
            'require.approved' => \App\Http\Middleware\RequireApprovedSocio::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();