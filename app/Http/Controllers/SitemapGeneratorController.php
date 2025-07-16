<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Package;
use Carbon\Carbon;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapGeneratorController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $sitemap = Sitemap::create()
            ->add(Url::create('/')
                ->setLastModificationDate(Carbon::yesterday())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                ->setPriority(1.0)
            );

        BlogPost::all()->each(function ($post) use ($sitemap) {
            $sitemap->add(
                Url::create(route('blog.show', $post->slug))
                    ->setLastModificationDate($post->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.7)
            );
        });

        Package::all()->each(function ($package) use ($sitemap) {
            $sitemap->add(
                Url::create(route('packages.show', $package->slug))
                    ->setLastModificationDate($package->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.6)
            );
        });

        return $sitemap->toResponse(request());
    }
}
