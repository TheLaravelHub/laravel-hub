<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feed_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feed_source_id')->constrained('feed_sources')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('subtitle')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('image_url')->nullable();
            $table->string('external_url');
            $table->string('external_id')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->integer('upvotes_count')->default(0);
            $table->integer('downvotes_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->integer('bookmarks_count')->default(0);
            $table->integer('shares_count')->default(0);
            $table->integer('views_count')->default(0);
            $table->json('tags')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('feed_source_id');
            $table->index('published_at');
            $table->index('upvotes_count');
            $table->index('created_at');
            $table->unique(['feed_source_id', 'external_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feed_posts');
    }
};
