<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;

final class PublishScheduledPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:publish-scheduled-posts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish scheduled blog posts when their scheduled time arrives';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $posts = BlogPost::needsPublishing()->get();

        foreach ($posts as $post) {
            $post->update([
                'status' => 'published',
                'published_at' => now(),
            ]);

            $this->info("Published: {$post->title}");
        }
    }
}
