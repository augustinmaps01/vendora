<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admin_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('full_name', 150);
            $table->string('email', 255)->unique();
            $table->text('password_hash');
            $table->enum('role', ['super_admin', 'support', 'billing'])->default('support');
            $table->boolean('is_email_verified')->default(false);
            $table->string('email_verification_token', 255)->nullable();
            $table->dateTime('email_token_expiry')->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->string('two_factor_secret', 255)->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->integer('failed_login_attempts')->default(0);
            $table->dateTime('account_locked_until')->nullable();
            $table->enum('status', ['active', 'suspended'])->default('active');
            $table->timestamps();

            $table->index('email');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_users');
    }
};
