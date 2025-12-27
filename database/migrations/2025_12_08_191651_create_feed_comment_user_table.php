<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_comment_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feed_comment_id')->constrained('feed_comments')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('vote_type', ['upvote', 'downvote']);
            $table->timestamps();

            $table->unique(['feed_comment_id', 'user_id']);
            $table->index('user_id');
            $table->index('feed_comment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_comment_user');
    }
};
