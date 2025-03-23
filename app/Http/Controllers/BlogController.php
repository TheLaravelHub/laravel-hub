<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Auth;
use Inertia\Inertia;

final class BlogController extends Controller
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
        $blogPost = BlogPost::with(['categories'])
            ->where('slug', $slug);

        if (! Auth::check() || ! Auth::user()->is_admin) {
            $blogPost->where('status', 'published');
        }

        $blogPost = $blogPost->firstOrFail();

        return Inertia::render('BlogPost', [
            'blogPost' => new BlogPostResource($blogPost),
        ]);
    }
}
