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
        Schema::create('password_resets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('user_type', ['admin', 'vendor']);
            $table->string('email', 255);
            $table->string('reset_token', 255);
            $table->timestamp('expires_at');
            $table->boolean('used')->default(false);
            $table->timestamp('created_at');

            $table->index(['email', 'user_type']);
            $table->index('reset_token');
            $table->index('used');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_resets');
    }
};
