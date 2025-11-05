<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Vendor extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasApiTokens, HasUuids;

    protected $table = 'vendors';

    protected $fillable = [
        'business_name',
        'email',
        'password_hash',
        'subscription_plan',
        'subscription_status',
        'store_domain',
        'is_email_verified',
        'email_verification_token',
        'email_token_expiry',
        'two_factor_enabled',
        'two_factor_secret',
        'last_login_at',
        'failed_login_attempts',
        'account_locked_until',
        'status',
    ];

    protected $hidden = [
        'password_hash',
        'email_verification_token',
        'two_factor_secret',
    ];

    protected function casts(): array
    {
        return [
            'is_email_verified' => 'boolean',
            'two_factor_enabled' => 'boolean',
            'email_token_expiry' => 'datetime',
            'last_login_at' => 'datetime',
            'account_locked_until' => 'datetime',
            'password_hash' => 'hashed',
        ];
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(VendorSession::class, 'vendor_id');
    }

    public function activeSessions(): HasMany
    {
        return $this->hasMany(VendorSession::class, 'vendor_id')
            ->where('is_active', true)
            ->where('expires_at', '>', now());
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class, 'vendor_id');
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class, 'vendor_id')
            ->where('status', 'active');
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [
            'user_type' => 'vendor',
            'business_name' => $this->business_name,
            'email' => $this->email,
            'subscription_plan' => $this->subscription_plan,
            'subscription_status' => $this->subscription_status,
        ];
    }
}
