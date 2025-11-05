<?php

namespace App\Services;

use App\Models\AdminUser;
use App\Models\Vendor;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;

class AuthService
{
    /**
     * Create JWT token for user
     */
    public function createToken($user): string
    {
        return JWTAuth::fromUser($user);
    }

    /**
     * Refresh JWT token
     */
    public function refreshToken(): string
    {
        return JWTAuth::refresh();
    }

    /**
     * Invalidate JWT token
     */
    public function invalidateToken(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    /**
     * Get authenticated user from token
     */
    public function getAuthenticatedUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }

    /**
     * Create session for user
     */
    public function createSession($user, string $token, string $ipAddress, string $userAgent): void
    {
        $sessionClass = $user instanceof AdminUser ? \App\Models\AdminSession::class : \App\Models\VendorSession::class;
        $foreignKey = $user instanceof AdminUser ? 'admin_user_id' : 'vendor_id';

        $sessionClass::create([
            $foreignKey => $user->id,
            'session_token' => hash('sha256', $token),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'is_active' => true,
            'created_at' => now(),
            'expires_at' => now()->addMinutes(config('jwt.ttl', 60)),
        ]);
    }

    /**
     * Invalidate all user sessions
     */
    public function invalidateAllSessions($user): void
    {
        $sessionClass = $user instanceof AdminUser ? \App\Models\AdminSession::class : \App\Models\VendorSession::class;
        $foreignKey = $user instanceof AdminUser ? 'admin_user_id' : 'vendor_id';

        $sessionClass::where($foreignKey, $user->id)
            ->update(['is_active' => false]);
    }

    /**
     * Create password reset token
     */
    public function createPasswordResetToken(string $email, string $userType): string
    {
        // Delete old tokens
        PasswordReset::where('email', $email)
            ->where('user_type', $userType)
            ->delete();

        $token = Str::random(64);

        PasswordReset::create([
            'user_type' => $userType,
            'email' => $email,
            'reset_token' => hash('sha256', $token),
            'expires_at' => now()->addHour(),
            'used' => false,
            'created_at' => now(),
        ]);

        return $token;
    }

    /**
     * Verify password reset token
     */
    public function verifyPasswordResetToken(string $email, string $token, string $userType): ?PasswordReset
    {
        return PasswordReset::where('email', $email)
            ->where('user_type', $userType)
            ->where('reset_token', hash('sha256', $token))
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();
    }

    /**
     * Create email verification token
     */
    public function createEmailVerificationToken($user): string
    {
        $token = Str::random(64);

        $user->update([
            'email_verification_token' => hash('sha256', $token),
            'email_token_expiry' => now()->addHour(),
        ]);

        return $token;
    }

    /**
     * Verify email token
     */
    public function verifyEmailToken(string $token, string $userType)
    {
        $modelClass = $userType === 'admin' ? AdminUser::class : Vendor::class;

        $user = $modelClass::where('email_verification_token', hash('sha256', $token))
            ->where('email_token_expiry', '>', now())
            ->first();

        if ($user) {
            $user->update([
                'is_email_verified' => true,
                'email_verification_token' => null,
                'email_token_expiry' => null,
            ]);
        }

        return $user;
    }

    /**
     * Check if account is locked
     */
    public function isAccountLocked($user): bool
    {
        if ($user->account_locked_until) {
            return Carbon::parse($user->account_locked_until)->isFuture();
        }

        return false;
    }

    /**
     * Lock account
     */
    public function lockAccount($user): void
    {
        $user->update([
            'account_locked_until' => now()->addMinutes(15),
            'failed_login_attempts' => $user->failed_login_attempts + 1,
        ]);
    }

    /**
     * Increment failed login attempts
     */
    public function incrementFailedAttempts($user): void
    {
        $attempts = $user->failed_login_attempts + 1;

        if ($attempts >= 5) {
            $this->lockAccount($user);
        } else {
            $user->update([
                'failed_login_attempts' => $attempts,
            ]);
        }
    }

    /**
     * Clear failed login attempts
     */
    public function clearFailedAttempts($user): void
    {
        $user->update([
            'failed_login_attempts' => 0,
            'account_locked_until' => null,
            'last_login_at' => now(),
        ]);
    }

    /**
     * Generate 2FA secret
     */
    public function generate2FASecret(): string
    {
        return Str::random(32);
    }

    /**
     * Verify 2FA code
     */
    public function verify2FACode($user, string $code): bool
    {
        // This is a simple implementation
        // In production, use a proper TOTP library like pragmarx/google2fa
        // For now, we'll use a simple time-based code
        $secret = $user->two_factor_secret;
        $timestamp = floor(time() / 30);
        $expectedCode = substr(hash('sha256', $secret . $timestamp), 0, 6);

        return $code === $expectedCode;
    }
}