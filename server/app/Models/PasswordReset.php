<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'password_resets';

    public $timestamps = false;

    protected $fillable = [
        'user_type',
        'email',
        'reset_token',
        'expires_at',
        'used',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'used' => 'boolean',
            'expires_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    public function isValid(): bool
    {
        return !$this->used && !$this->isExpired();
    }

    public function markAsUsed(): void
    {
        $this->update(['used' => true]);
    }
}
