<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PackageResource;
use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomePageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $page = $request->input('page', 1);

        $categories = Category::query()
            ->whereHas('packages')
            ->forPackages()
            ->withCount('packages')
            ->get();

        $packages = $request->input('search')
            ? Package::search($request->input('search'))
                ->query(function ($query) {
                    return $query->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar');
                })
                ->paginate(perPage: 24, page: $page)
            : Package::query()
                ->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar')
                ->paginate(perPage: 24, page: $page);

        $packages->load('categories');

        $stars = Package::sum('stars');

        $latestPosts = BlogPost::published()
            ->select('id', 'title', 'sub_title', 'slug', 'published_at', 'meta_description')
            ->with(['categories'])
            ->latest('published_at')
            ->take(3)
            ->get();

        if ($request->expectsJson()) {
            return PackageResource::collection($packages);
        }

        return Inertia::render('Index', [
            'categories' => CategoryResource::collection($categories),
            'packages' => PackageResource::collection($packages),
            'stars' => $stars,
            'categories_count' => $categories->count(),
            'latestPosts' => BlogPostResource::collection($latestPosts),
        ]);
    }
}
