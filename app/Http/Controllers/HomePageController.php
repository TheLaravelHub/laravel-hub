<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Http\Resources\PackageResource;
use App\Queries\AvatarUsersMapQuery;
use App\Queries\LatestPublishedPostsQuery;
use App\Queries\MostReadPostsThisWeekQuery;
use App\Queries\PackagesOrderedByFeaturedQuery;
use Inertia\Inertia;

class HomePageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(
        AvatarUsersMapQuery $users,
        PackagesOrderedByFeaturedQuery $packages,
        LatestPublishedPostsQuery $latestPosts,
        MostReadPostsThisWeekQuery $mostReadPosts
    ) {
        return Inertia::render('Index', [
            'users' => $users->get(),
            'packages' => PackageResource::collection($packages->get()),
            'latestPosts' => BlogPostResource::collection($latestPosts->get()),
            'mostReadPosts' => BlogPostResource::collection($mostReadPosts->get()),
        ]);
    }
}
