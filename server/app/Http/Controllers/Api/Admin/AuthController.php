<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseAuthController;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Requests\Admin\RegisterRequest;
use App\Http\Requests\Admin\Verify2FARequest;
use App\Http\Requests\PasswordResetRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\EmailVerificationRequest;
use App\Models\AdminUser;
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
     * Register a new admin user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = AdminUser::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'password_hash' => $request->password,
                'role' => 'support', // Default role
                'status' => 'active',
            ]);

            // Generate email verification token
            $token = $this->authService->createEmailVerificationToken($user);

            // TODO: Send verification email
            // Mail::to($user->email)->send(new EmailVerification($token));

            return $this->successResponse([
                'user' => $user->only(['id', 'full_name', 'email', 'role', 'status']),
                'message' => 'Registration successful. Please check your email for verification.',
            ], 'Admin account created successfully', 201);

        } catch (\Exception $e) {
            return $this->errorResponse('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Login admin user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $throttleKey = $this->throttleKey($request->email);

        // Check rate limiting
        if ($this->hasTooManyLoginAttempts($throttleKey)) {
            $seconds = $this->availableIn($throttleKey);

            return $this->errorResponse(
                'Too many login attempts. Please try again in ' . ceil($seconds / 60) . ' minutes.',
                429,
                [
                    'account_locked' => true,
                    'lockout_expiry' => now()->addSeconds($seconds)->toIso8601String(),
                ]
            );
        }

        $user = AdminUser::where('email', $request->email)->first();

        if (!$user) {
            $this->incrementLoginAttempts($throttleKey);
            return $this->errorResponse('Invalid credentials', 401);
        }

        // Check if account is locked
        if ($this->authService->isAccountLocked($user)) {
            return $this->errorResponse(
                'Account is locked due to multiple failed attempts',
                423,
                [
                    'account_locked' => true,
                    'lockout_expiry' => $user->account_locked_until->toIso8601String(),
                ]
            );
        }

        // Check if account is suspended
        if ($user->status === 'suspended') {
            return $this->errorResponse('Account has been suspended', 403);
        }

        // Verify password
        if (!Hash::check($request->password, $user->password_hash)) {
            $this->incrementLoginAttempts($throttleKey);
            $this->authService->incrementFailedAttempts($user);

            return $this->errorResponse('Invalid credentials', 401);
        }

        // Check if email is verified
        if (!$user->is_email_verified) {
            return $this->errorResponse(
                'Email not verified. Please check your email.',
                403,
                ['requires_email_verification' => true]
            );
        }

        // Check if 2FA is enabled
        if ($user->two_factor_enabled) {
            // Store email in session for 2FA verification
            session(['2fa_email' => $user->email, '2fa_user_type' => 'admin']);

            return $this->successResponse([
                'requires_two_factor' => true,
                'message' => 'Please enter your 2FA code',
            ], 'Two-factor authentication required');
        }

        // Clear failed attempts
        $this->clearLoginAttempts($throttleKey);
        $this->authService->clearFailedAttempts($user);

        // Generate JWT token
        $token = $this->authService->createToken($user);

        // Create session
        $this->authService->createSession(
            $user,
            $token,
            $this->getClientIp(),
            $this->getClientUserAgent()
        );

        return $this->successResponse([
            'user' => $user->only(['id', 'full_name', 'email', 'role', 'status', 'is_email_verified', 'two_factor_enabled']),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl', 60) * 60, // in seconds
        ], 'Login successful');
    }

    /**
     * Verify 2FA code
     */
    public function verify2FA(Verify2FARequest $request): JsonResponse
    {
        $user = AdminUser::where('email', $request->email)->first();

        if (!$user || !$user->two_factor_enabled) {
            return $this->errorResponse('Invalid request', 400);
        }

        // Verify 2FA code
        if (!$this->authService->verify2FACode($user, $request->code)) {
            return $this->errorResponse('Invalid verification code', 401);
        }

        // Clear session data
        session()->forget(['2fa_email', '2fa_user_type']);

        // Clear failed attempts
        $this->authService->clearFailedAttempts($user);

        // Generate JWT token
        $token = $this->authService->createToken($user);

        // Create session
        $this->authService->createSession(
            $user,
            $token,
            $this->getClientIp(),
            $this->getClientUserAgent()
        );

        return $this->successResponse([
            'user' => $user->only(['id', 'full_name', 'email', 'role', 'status']),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl', 60) * 60,
        ], '2FA verification successful');
    }

    /**
     * Logout admin user
     */
    public function logout(): JsonResponse
    {
        try {
            $user = auth()->user();

            if ($user) {
                // Invalidate current session
                $this->authService->invalidateToken();

                // You may want to mark the session as inactive in DB
                // $this->authService->invalidateCurrentSession($user);
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
                'user' => $user->only(['id', 'full_name', 'email', 'role', 'status', 'is_email_verified', 'two_factor_enabled', 'last_login_at', 'created_at']),
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
        $user = AdminUser::where('email', $request->email)->first();

        if (!$user) {
            // Don't reveal if email exists
            return $this->successResponse([], 'If your email exists, you will receive a password reset link.');
        }

        $token = $this->authService->createPasswordResetToken($request->email, 'admin');

        // TODO: Send password reset email
        // Mail::to($user->email)->send(new PasswordResetMail($token));

        return $this->successResponse([], 'Password reset link sent to your email');
    }

    /**
     * Reset password
     */
    public function resetPassword(PasswordResetRequest $request): JsonResponse
    {
        $resetToken = $this->authService->verifyPasswordResetToken(
            $request->email,
            $request->token,
            'admin'
        );

        if (!$resetToken) {
            return $this->errorResponse('Invalid or expired reset token', 400);
        }

        $user = AdminUser::where('email', $request->email)->first();

        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }

        // Update password
        $user->update([
            'password_hash' => $request->password,
        ]);

        // Mark token as used
        $resetToken->markAsUsed();

        // Invalidate all sessions
        $this->authService->invalidateAllSessions($user);

        return $this->successResponse([], 'Password reset successfully');
    }

    /**
     * Verify email
     */
    public function verifyEmail(EmailVerificationRequest $request): JsonResponse
    {
        $user = $this->authService->verifyEmailToken($request->token, 'admin');

        if (!$user) {
            return $this->errorResponse('Invalid or expired verification token', 400);
        }

        return $this->successResponse([
            'user' => $user->only(['id', 'email', 'is_email_verified']),
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

        // TODO: Send verification email
        // Mail::to($user->email)->send(new EmailVerification($token));

        return $this->successResponse([], 'Verification email sent');
    }
}