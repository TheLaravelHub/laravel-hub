<?php

namespace App\Actions;

use App\Models\BlogPost;
use App\Models\BlogPostView;
use Illuminate\Http\Request;

class RecordBlogPostViewAction
{
    /**
     * Record a unique view for a blog post.
     */
    public function handle(BlogPost $blogPost, Request $request): void
    {
        // Check if this view already exists to ensure uniqueness
        $view = BlogPostView::query()
            ->where('blog_post_id', $blogPost->id)
            ->where('ip_address', $request->ip())
            ->where('user_agent', $request->userAgent())
            ->where('session_id', $request->session()->getId())
            ->first();

        // If the view doesn't exist, create it
        if (! $view) {
            BlogPostView::query()->create([
                'blog_post_id' => $blogPost->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'session_id' => $request->session()->getId(),
            ]);
        }
    }
}
