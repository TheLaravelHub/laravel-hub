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
        Schema::table('blog_post_views', function (Blueprint $table) {
            $table->text('user_agent')
                ->nullable()
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blog_post_views', function (Blueprint $table) {
            $table->string('user_agent')
                ->nullable()
                ->change();
        });
    }
};
