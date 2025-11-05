<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AuthController;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register Admin API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group with "admin" prefix.
|
*/

// Public Admin Authentication Routes (No Auth Required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('admin.auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('admin.auth.login');
    Route::post('/verify-2fa', [AuthController::class, 'verify2FA'])->name('admin.auth.verify2fa');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('admin.auth.forgot-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('admin.auth.reset-password');
    Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail'])->name('admin.auth.verify-email');
});

// Protected Admin Routes (Requires Admin Authentication)
Route::middleware(['auth.admin'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('admin.auth.logout');
        Route::get('/me', [AuthController::class, 'me'])->name('admin.auth.me');
        Route::post('/refresh', [AuthController::class, 'refresh'])->name('admin.auth.refresh');
        Route::post('/resend-verification', [AuthController::class, 'resendVerification'])->name('admin.auth.resend-verification');
    });

    // Additional protected admin routes can be added here
    // Example:
    // Route::prefix('dashboard')->group(function () {
    //     Route::get('/stats', [DashboardController::class, 'stats']);
    // });
});