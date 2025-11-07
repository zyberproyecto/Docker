<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\SolicitudController;

Route::options('{any}', fn () => response()->noContent())
    ->where('any', '.*');

Route::get('/health', fn () => ['ok' => true]);

Route::post('/register', [SolicitudController::class, 'store'])->name('register');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {

Route::get('/me',      [AuthController::class, 'me'])->name('me');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/perfil/basic', [PerfilController::class, 'perfil'])->name('perfil.basic');

Route::get('/perfil', [PerfilController::class, 'show'])->name('perfil.show');    

Route::put('/perfil', [PerfilController::class, 'update'])->name('perfil.update'); 
});