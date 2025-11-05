<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

abstract class BaseAuthController extends Controller
{
    /**
     * Maximum login attempts before lockout
     */
    protected int $maxAttempts = 5;

    /**
     * Lockout duration in minutes
     */
    protected int $decayMinutes = 15;

    /**
     * Check if too many login attempts
     */
    protected function hasTooManyLoginAttempts(string $key): bool
    {
        return RateLimiter::tooManyAttempts($key, $this->maxAttempts);
    }

    /**
     * Increment login attempts
     */
    protected function incrementLoginAttempts(string $key): void
    {
        RateLimiter::hit($key, $this->decayMinutes * 60);
    }

    /**
     * Clear login attempts
     */
    protected function clearLoginAttempts(string $key): void
    {
        RateLimiter::clear($key);
    }

    /**
     * Get throttle key for login
     */
    protected function throttleKey(string $email): string
    {
        return Str::transliterate(Str::lower($email).'|'.request()->ip());
    }

    /**
     * Get seconds until lockout expires
     */
    protected function availableIn(string $key): int
    {
        return RateLimiter::availableIn($key);
    }

    /**
     * Send success response
     */
    protected function successResponse(array $data, string $message = 'Success', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Send error response
     */
    protected function errorResponse(string $message, int $status = 400, array $errors = []): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }

    /**
     * Get client IP address
     */
    protected function getClientIp(): string
    {
        return request()->ip();
    }

    /**
     * Get client user agent
     */
    protected function getClientUserAgent(): string
    {
        return request()->userAgent() ?? 'Unknown';
    }
}