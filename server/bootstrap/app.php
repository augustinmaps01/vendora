<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            // Register Admin API Routes with /api/admin prefix
            Route::prefix('api/admin')
                ->middleware('api')
                ->group(base_path('routes/admin.php'));

            // Register Vendor/POS API Routes with /api/vendor prefix
            Route::prefix('api/vendor')
                ->middleware('api')
                ->group(base_path('routes/vendor.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Add CORS middleware to all API routes
        $middleware->append(\App\Http\Middleware\CorsMiddleware::class);

        // Register custom middleware aliases
        $middleware->alias([
            'auth.admin' => \App\Http\Middleware\AdminAuthMiddleware::class,
            'auth.vendor' => \App\Http\Middleware\VendorAuthMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
