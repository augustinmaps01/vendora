<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Vendor\AuthController;

/*
|--------------------------------------------------------------------------
| Vendor/POS API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register Vendor/POS API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group with "vendor" prefix.
|
*/

// Public Vendor Authentication Routes (No Auth Required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('vendor.auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('vendor.auth.login');
    Route::post('/verify-2fa', [AuthController::class, 'verify2FA'])->name('vendor.auth.verify2fa');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('vendor.auth.forgot-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('vendor.auth.reset-password');
    Route::get('/verify-email/{token}', [AuthController::class, 'verifyEmail'])->name('vendor.auth.verify-email');
});

// Protected Vendor Routes (Requires Vendor Authentication + Active Subscription)
Route::middleware(['auth.vendor'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('vendor.auth.logout');
        Route::get('/me', [AuthController::class, 'me'])->name('vendor.auth.me');
        Route::post('/refresh', [AuthController::class, 'refresh'])->name('vendor.auth.refresh');
        Route::post('/resend-verification', [AuthController::class, 'resendVerification'])->name('vendor.auth.resend-verification');
    });

    // Additional protected vendor routes can be added here
    // Example:
    // Route::prefix('products')->group(function () {
    //     Route::get('/', [ProductController::class, 'index']);
    //     Route::post('/', [ProductController::class, 'store']);
    // });

    // Route::prefix('orders')->group(function () {
    //     Route::get('/', [OrderController::class, 'index']);
    //     Route::get('/{id}', [OrderController::class, 'show']);
    // });

    // Route::prefix('pos')->group(function () {
    //     Route::post('/checkout', [POSController::class, 'checkout']);
    //     Route::get('/transactions', [POSController::class, 'transactions']);
    // });
});