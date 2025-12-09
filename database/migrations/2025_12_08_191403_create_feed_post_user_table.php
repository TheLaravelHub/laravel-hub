<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_post_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feed_post_id')->constrained('feed_posts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('interaction_type', ['upvote', 'downvote', 'bookmark', 'view']);
            $table->timestamps();

            $table->unique(['feed_post_id', 'user_id', 'interaction_type']);
            $table->index(['user_id', 'interaction_type']);
            $table->index('feed_post_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_post_user');
    }
};
