<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PackageResource;
use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Package;
use Inertia\Inertia;

class HomePageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $categories = Category::query()
            ->whereHas('packages')
            ->forPackages()
            ->withCount('packages')
            ->get();

        $packages = Package::query()
            ->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar')
            ->orderBy('stars', 'desc')
            ->take(6)
            ->get();

        $packages->load('categories');

        $stars = Package::sum('stars');

        $latestPosts = BlogPost::published()
            ->select('id', 'title', 'sub_title', 'slug', 'published_at', 'meta_description')
            ->with(['categories'])
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Index', [
            'categories' => CategoryResource::collection($categories),
            'packages' => PackageResource::collection($packages),
            'packagesCount' => Package::count(),
            'stars' => $stars,
            'latestPosts' => BlogPostResource::collection($latestPosts),
        ]);
    }
}
