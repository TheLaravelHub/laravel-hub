<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class RoadmapController extends Controller
{
    /**
     * Display the Laravel roadmap page.
     */
    public function __invoke()
    {
        $roadmapPath = base_path('laravel-roadmap.json');

        if (! File::exists($roadmapPath)) {
            abort(404, 'Roadmap data not found');
        }

        $roadmapData = json_decode(File::get($roadmapPath), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            abort(500, 'Error parsing roadmap data');
        }

        return Inertia::render('Roadmap', [
            'roadmap' => $roadmapData,
            'seoSettings' => [
                'title' => 'Laravel Developer Roadmap 2026 - Complete Learning Path',
                'description' => 'Complete Laravel developer roadmap with curated resources. Learn Laravel from basics to advanced topics including Eloquent ORM, authentication, API development, queues, testing, and more. Perfect for beginners and experienced developers.',
                'keywords' => 'Laravel roadmap, learn Laravel, Laravel tutorial, Laravel developer path, Laravel learning guide, Laravel course, PHP Laravel, Laravel beginner, Laravel advanced, Laravel resources, how to learn Laravel, Laravel developer roadmap, Laravel 11, become Laravel developer',
                'og_type' => 'article',
                'og_title' => 'Laravel Developer Roadmap 2026 - Your Complete Guide to Mastering Laravel',
                'og_description' => 'Step-by-step roadmap to becoming a Laravel developer. From PHP basics to advanced Laravel concepts with the best learning resources and tutorials.',
                'og_site_name' => 'Laravel Hub',
                'og_locale' => 'en_US',
                'twitter_card' => 'summary_large_image',
                'twitter_site' => '@thelaravelhub',
                'twitter_title' => 'Laravel Developer Roadmap 2026 - Complete Learning Path',
                'twitter_description' => 'Master Laravel with this comprehensive roadmap covering everything from basics to advanced topics with curated resources.',
            ],
        ]);
    }
}
