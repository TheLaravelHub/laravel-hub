<?php

namespace App\Jobs;

use App\Models\BlogPostView;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RecordBlogPostViewsJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly int $blogPostId,
        public readonly string $ipAddress,
        public readonly ?string $userAgent,
        public readonly ?string $sessionId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $view = BlogPostView::query()
            ->where('blog_post_id', $this->blogPostId)
            ->where('ip_address', $this->ipAddress)
            ->where('user_agent', $this->userAgent)
            ->where('session_id', $this->sessionId)
            ->first();

        if (! $view) {
            BlogPostView::query()->create([
                'blog_post_id' => $this->blogPostId,
                'ip_address' => $this->ipAddress,
                'user_agent' => $this->userAgent,
                'session_id' => $this->sessionId,
            ]);
        }
    }

    public function tags()
    {
        return [
            'RecordBlogPostViewsJob',
            'BlogPost:'.$this->blogPostId,
        ];
    }
}
