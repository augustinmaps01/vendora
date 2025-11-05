<?php

namespace App\Http\Controllers\Api\Vendor;

use App\Http\Controllers\Api\BaseAuthController;
use App\Http\Requests\Vendor\LoginRequest;
use App\Http\Requests\Vendor\RegisterRequest;
use App\Http\Requests\Vendor\Verify2FARequest;
use App\Http\Requests\PasswordResetRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\EmailVerificationRequest;
use App\Models\Vendor;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseAuthController
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new vendor
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $vendor = Vendor::create([
                'business_name' => $request->business_name,
                'email' => $request->email,
                'password_hash' => $request->password,
                'subscription_plan' => $request->subscription_plan,
                'subscription_status' => 'trial',
                'status' => 'active',
            ]);

            // For development: Email verification is disabled in login, so users can login immediately
            $responseData = [
                'user' => $vendor->only(['id', 'business_name', 'email', 'subscription_plan', 'subscription_status', 'status']),
                'message' => 'Registration successful. You can now login with your credentials.',
            ];

            return $this->successResponse($responseData, 'Vendor account created successfully', 201);

        } catch (\Exception $e) {
            return $this->errorResponse('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Login vendor user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $throttleKey = $this->throttleKey($request->email);

        if ($this->hasTooManyLoginAttempts($throttleKey)) {
            $seconds = $this->availableIn($throttleKey);
            return $this->errorResponse(
                'Too many login attempts. Please try again in ' . ceil($seconds / 60) . ' minutes.',
                429,
                ['account_locked' => true, 'lockout_expiry' => now()->addSeconds($seconds)->toIso8601String()]
            );
        }

        $vendor = Vendor::where('email', $request->email)->first();

        if (!$vendor) {
            $this->incrementLoginAttempts($throttleKey);
            return $this->errorResponse('Invalid credentials', 401);
        }

        if ($this->authService->isAccountLocked($vendor)) {
            return $this->errorResponse(
                'Account is locked due to multiple failed attempts',
                423,
                ['account_locked' => true, 'lockout_expiry' => $vendor->account_locked_until->toIso8601String()]
            );
        }

        if (in_array($vendor->status, ['suspended', 'deleted'])) {
            return $this->errorResponse('Account has been ' . $vendor->status, 403);
        }

        if (!Hash::check($request->password, $vendor->password_hash)) {
            $this->incrementLoginAttempts($throttleKey);
            $this->authService->incrementFailedAttempts($vendor);
            return $this->errorResponse('Invalid credentials', 401);
        }

        // Email verification check disabled for development
        // if (!$vendor->is_email_verified) {
        //     return $this->errorResponse(
        //         'Email not verified. Please check your email.',
        //         403,
        //         ['requires_email_verification' => true]
        //     );
        // }

        if ($vendor->two_factor_enabled) {
            session(['2fa_email' => $vendor->email, '2fa_user_type' => 'vendor']);
            return $this->successResponse([
                'requires_two_factor' => true,
                'message' => 'Please enter your 2FA code',
            ], 'Two-factor authentication required');
        }

        $this->clearLoginAttempts($throttleKey);
        $this->authService->clearFailedAttempts($vendor);

        $token = $this->authService->createToken($vendor);
        $this->authService->createSession($vendor, $token, $this->getClientIp(), $this->getClientUserAgent());

        return $this->successResponse([
            'user' => $vendor->only(['id', 'business_name', 'email', 'subscription_plan', 'subscription_status', 'store_domain', 'status', 'is_email_verified', 'two_factor_enabled']),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl', 60) * 60,
        ], 'Login successful');
    }

    /**
     * Verify 2FA code
     */
    public function verify2FA(Verify2FARequest $request): JsonResponse
    {
        $vendor = Vendor::where('email', $request->email)->first();

        if (!$vendor || !$vendor->two_factor_enabled) {
            return $this->errorResponse('Invalid request', 400);
        }

        if (!$this->authService->verify2FACode($vendor, $request->code)) {
            return $this->errorResponse('Invalid verification code', 401);
        }

        session()->forget(['2fa_email', '2fa_user_type']);
        $this->authService->clearFailedAttempts($vendor);

        $token = $this->authService->createToken($vendor);
        $this->authService->createSession($vendor, $token, $this->getClientIp(), $this->getClientUserAgent());

        return $this->successResponse([
            'user' => $vendor->only(['id', 'business_name', 'email', 'subscription_plan', 'subscription_status', 'store_domain', 'status']),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl', 60) * 60,
        ], '2FA verification successful');
    }

    /**
     * Logout vendor user
     */
    public function logout(): JsonResponse
    {
        try {
            $user = auth()->user();
            if ($user) {
                $this->authService->invalidateToken();
            }
            return $this->successResponse([], 'Logged out successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Logout failed', 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function me(): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return $this->errorResponse('Unauthenticated', 401);
            }
            return $this->successResponse([
                'user' => $user->only(['id', 'business_name', 'email', 'subscription_plan', 'subscription_status', 'store_domain', 'status', 'is_email_verified', 'two_factor_enabled', 'last_login_at', 'created_at']),
            ], 'User retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve user', 500);
        }
    }

    /**
     * Refresh JWT token
     */
    public function refresh(): JsonResponse
    {
        try {
            $token = $this->authService->refreshToken();
            return $this->successResponse([
                'token' => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl', 60) * 60,
            ], 'Token refreshed successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Token refresh failed', 401);
        }
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $vendor = Vendor::where('email', $request->email)->first();

        if (!$vendor) {
            return $this->successResponse([], 'If your email exists, you will receive a password reset link.');
        }

        $token = $this->authService->createPasswordResetToken($request->email, 'vendor');

        return $this->successResponse([], 'Password reset link sent to your email');
    }

    /**
     * Reset password
     */
    public function resetPassword(PasswordResetRequest $request): JsonResponse
    {
        $resetToken = $this->authService->verifyPasswordResetToken($request->email, $request->token, 'vendor');

        if (!$resetToken) {
            return $this->errorResponse('Invalid or expired reset token', 400);
        }

        $vendor = Vendor::where('email', $request->email)->first();

        if (!$vendor) {
            return $this->errorResponse('User not found', 404);
        }

        $vendor->update(['password_hash' => $request->password]);
        $resetToken->markAsUsed();
        $this->authService->invalidateAllSessions($vendor);

        return $this->successResponse([], 'Password reset successfully');
    }

    /**
     * Verify email
     */
    public function verifyEmail(EmailVerificationRequest $request): JsonResponse
    {
        $vendor = $this->authService->verifyEmailToken($request->token, 'vendor');

        if (!$vendor) {
            return $this->errorResponse('Invalid or expired verification token', 400);
        }

        return $this->successResponse([
            'user' => $vendor->only(['id', 'email', 'is_email_verified']),
        ], 'Email verified successfully');
    }

    /**
     * Resend verification email
     */
    public function resendVerification(): JsonResponse
    {
        $user = auth()->user();

        if (!$user) {
            return $this->errorResponse('Unauthenticated', 401);
        }

        if ($user->is_email_verified) {
            return $this->errorResponse('Email already verified', 400);
        }

        $token = $this->authService->createEmailVerificationToken($user);

        return $this->successResponse([], 'Verification email sent');
    }
}
