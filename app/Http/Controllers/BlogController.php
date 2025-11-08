<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Jobs\RecordBlogPostViewsJob;
use App\Models\BlogPost;
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

    public function show(BlogPost $blogPost)
    {
        $blogPost->load('categories');

        RecordBlogPostViewsJob::dispatch(
            $blogPost->id,
            request()->ip(),
            request()->userAgent(),
            request()->session()->getId()
        );

        return Inertia::render('BlogPost', [
            'blogPost' => new BlogPostResource($blogPost),
        ]);
    }
}
