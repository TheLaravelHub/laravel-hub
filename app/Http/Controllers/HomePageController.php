<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Http\Resources\PackageResource;
use App\Queries\AvatarUsersMapQuery;
use App\Queries\LatestPublishedPostsQuery;
use App\Queries\MostReadPostsThisWeekQuery;
use App\Queries\PackagesOrderedByFeaturedQuery;
use App\Settings\SeoSettings;
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
        MostReadPostsThisWeekQuery $mostReadPosts,
        SeoSettings $seoSettings
    ) {
        return Inertia::render('Index', [
            'users' => $users->get(),
            'packages' => PackageResource::collection($packages->get()),
            'latestPosts' => BlogPostResource::collection($latestPosts->get()),
            'mostReadPosts' => BlogPostResource::collection($mostReadPosts->get()),
            'seoSettings' => [
                'title' => $seoSettings->title ?? 'Laravel Hub – The Central Community for Laravel Developers',
                'description' => $seoSettings->description ?? 'Laravel Hub is an all-in-one platform and community for Laravel developers to discover packages, stay updated with curated content, and connect with other professionals in the ecosystem.',
                'keywords' => $seoSettings->keywords ?? 'Laravel Hub, Laravel community, Laravel packages, PHP libraries, Laravel tutorials, Laravel news, Laravel ecosystem, Laravel developers',
                'og_type' => $seoSettings->og_type ?? 'website',
                'og_title' => $seoSettings->og_title ?? $seoSettings->title ?? 'Laravel Hub – The Central Community for Laravel Developers',
                'og_description' => $seoSettings->og_description ?? $seoSettings->description ?? 'An all-in-one platform where Laravel developers can discover packages, stay updated with curated content, and connect with other professionals.',
                'og_image' => $seoSettings->og_image,
                'og_url' => $seoSettings->og_url,
                'og_site_name' => $seoSettings->og_site_name ?? 'Laravel Hub',
                'og_locale' => $seoSettings->og_locale ?? 'en_US',
                'twitter_card' => $seoSettings->twitter_card ?? 'summary_large_image',
                'twitter_site' => $seoSettings->twitter_site ?? '@thelaravelhub',
                'twitter_title' => $seoSettings->twitter_title ?? $seoSettings->og_title ?? $seoSettings->title ?? 'Laravel Hub – The Central Community for Laravel Developers',
                'twitter_description' => $seoSettings->twitter_description ?? $seoSettings->og_description ?? $seoSettings->description ?? 'Discover and explore the best Laravel packages, stay updated with curated content, and connect with other professionals.',
                'twitter_image' => $seoSettings->twitter_image ?? $seoSettings->og_image,
            ],
        ]);
    }
}
