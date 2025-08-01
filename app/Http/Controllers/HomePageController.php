<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PackageResource;
use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Package;
use App\Models\User;
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

        $users = User::query()
            ->select('id', 'avatar', 'name')
            ->whereNotNull('avatar')
            ->limit(4)
            ->get()
            ->mapWithKeys(function ($user) {
                return [
                    $user->id => [
                        'name' => $user->name,
                        'avatar' => $user->avatar,
                    ],
                ];
            })
            ->toArray();

        $packages = Package::query()
            ->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar')
            ->filter(['is_featured' => true])
            ->orderBy('stars', 'desc')
            ->take(6)
            ->get();

        $packages->load('categories');

        $stars = Package::sum('stars');

        $latestPosts = BlogPost::published()
            ->select('id', 'title', 'sub_title', 'slug', 'published_at', 'meta_description')
            ->with(['categories'])
            ->latest('published_at')
            ->take(6)
            ->get();

        $mostReadPosts = BlogPost::popularThisWeek();

        return Inertia::render('Index', [
            'users' => $users,
            'categories' => CategoryResource::collection($categories),
            'packages' => PackageResource::collection($packages),
            'packagesCount' => Package::count(),
            'stars' => $stars,
            'latestPosts' => BlogPostResource::collection($latestPosts),
            'mostReadPosts' => BlogPostResource::collection($mostReadPosts),
        ]);
    }
}
