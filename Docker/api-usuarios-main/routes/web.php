<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'ok' => true,
        'service' => 'api-usuarios',
        'message' => 'Servicio de autenticación Zyber en ejecución'
    ]);
});