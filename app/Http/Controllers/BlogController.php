<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
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

    public function show(string $slug)
    {
        $blogPost = BlogPost::published()
            ->with(['categories'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('BlogPost', [
            'blogPost' => new BlogPostResource($blogPost),
        ]);
    }
}
