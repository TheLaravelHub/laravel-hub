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
        Schema::create('blog_post_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_post_id')->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('session_id')->nullable();
            $table->timestamps();

            // Create a unique index to prevent duplicate views
            $table->unique(['blog_post_id', 'ip_address', 'user_agent', 'session_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    /**
     * Reverse the migrations.
     *
     * Per project standards, down() method is omitted for new migrations.
     */
    public function down(): void
    {
        // Omitted as per project standards
    }
};
