<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Jobs\RecordBlogPostViewsJob;
use App\Models\BlogPost;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'categories']);

        $blogPosts = BlogPost::query()
            ->filter($filters)
            ->published()
            ->select('id', 'title', 'slug', 'published_at', 'sub_title')
            ->with(['categories'])
            ->latest('published_at')
            ->paginate(24)
            ->withQueryString();

        $categories = Category::forBlogPosts()
            ->active()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Blog', [
            'blogPosts' => BlogPostResource::collection($blogPosts),
            'categories' => $categories,
            'filters' => $filters,
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
