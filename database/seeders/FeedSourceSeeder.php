<?php

namespace Database\Seeders;

use App\Models\FeedSource;
use Illuminate\Database\Seeder;

class FeedSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sources = [
            [
                'name' => 'Laravel News',
                'slug' => 'laravel-news',
                'description' => 'The official Laravel News website',
                'logo_url' => 'https://laravel-news.com/images/logo.png',
                'website_url' => 'https://laravel-news.com',
                'rss_feed_url' => 'https://feed.laravel-news.com',
                'type' => 'article',
                'is_active' => true,
                'fetch_frequency_minutes' => 60,
            ],
            //            [
            //                'name' => 'PHP.Watch',
            //                'slug' => 'php-watch',
            //                'description' => 'PHP Watch - A curated list of articles, videos, and more',
            //                'logo_url' => 'https://php.watch/icon.png',
            //                'website_url' => 'https://php.watch',
            //                'rss_feed_url' => 'https://php.watch/feed',
            //                'type' => 'article',
            //                'is_active' => true,
            //                'fetch_frequency_minutes' => 120,
            //            ],
            //            [
            //                'name' => 'Freek.dev',
            //                'slug' => 'freek-dev',
            //                'description' => 'Web development, Laravel and other stuff by Freek Van der Herten',
            //                'logo_url' => 'https://freek.dev/favicon.ico',
            //                'website_url' => 'https://freek.dev',
            //                'rss_feed_url' => 'https://freek.dev/feed',
            //                'type' => 'article',
            //                'is_active' => true,
            //                'fetch_frequency_minutes' => 180,
            //            ],
            //            [
            //                'name' => 'Laracasts',
            //                'slug' => 'laracasts',
            //                'description' => 'Laracasts is the leading resource for Laravel tutorials',
            //                'logo_url' => 'https://laracasts.com/images/logo/logo-circle.svg',
            //                'website_url' => 'https://laracasts.com',
            //                'rss_feed_url' => 'https://laracasts.com/feed',
            //                'type' => 'video',
            //                'is_active' => true,
            //                'fetch_frequency_minutes' => 120,
            //            ],
            //            [
            //                'name' => 'PHP Weekly',
            //                'slug' => 'php-weekly',
            //                'description' => 'Weekly PHP news and articles',
            //                'logo_url' => 'https://www.phpweekly.com/images/logo.png',
            //                'website_url' => 'https://www.phpweekly.com',
            //                'rss_feed_url' => 'https://www.phpweekly.com/rss',
            //                'type' => 'article',
            //                'is_active' => true,
            //                'fetch_frequency_minutes' => 1440, // Daily
            //            ],
            [
                'name' => 'Laravel Hub',
                'slug' => 'laravel-hub',
                'description' => 'Laravel Hub is an all-in-one platform and community for Laravel developers to discover packages, stay updated with curated content, and connect with other professionals in the ecosystem.',
                'logo_url' => 'https://laravel-hub.com/assets/images/logo.png',
                'website_url' => 'https://www.laravel-hub.com',
                'rss_feed_url' => 'https://laravel-hub.com/rss/blog',
                'type' => 'article',
                'is_active' => true,
                'fetch_frequency_minutes' => 1440, // Daily
            ],
        ];

        foreach ($sources as $source) {
            FeedSource::updateOrCreate(
                ['slug' => $source['slug']],
                $source
            );
        }
    }
}
