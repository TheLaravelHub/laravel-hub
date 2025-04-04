<?php

namespace App\Http\Controllers;

use App\Actions\RecordBlogPostViewAction;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Auth;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogPosts = BlogPost::published()
            ->select('id', 'title', 'slug', 'published_at')
            ->with(['categories'])
            ->latest('published_at')
            ->paginate(24);

        return Inertia::render('Blog', [
            'blogPosts' => BlogPostResource::collection($blogPosts),
        ]);
    }

    public function show(string $slug, RecordBlogPostViewAction $recordViewAction)
    {
        $blogPost = BlogPost::with(['categories'])
            ->where('slug', $slug);

        if (! Auth::check() || ! Auth::user()->is_admin) {
            $blogPost->where('status', 'published');
        }

        $blogPost = $blogPost->firstOrFail();
        
        // Record the view for this blog post
        $recordViewAction->handle($blogPost, request());

        return Inertia::render('BlogPost', [
            'blogPost' => new BlogPostResource($blogPost),
        ]);
    }
}
