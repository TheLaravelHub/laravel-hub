<?php

use App\Http\Controllers\Admin\GetPackageRepoDataController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\OgImageController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\SitemapGeneratorController;
use Illuminate\Support\Facades\Route;

Route::domain(config('app.main_domain'))->group(function () {
    Route::get('/', HomePageController::class)->name('homepage');
    Route::get('/sitemap.xml', SitemapGeneratorController::class);

    // RSS Feeds - Powered by Spatie Laravel Feed
    Route::feeds();

    Route::post('/newsletter/subscribe', NewsletterSubscriptionController::class)
        ->middleware('throttle:1,1')
        ->name('newsletter.subscribe');

    Route::controller(PackageController::class)
        ->group(function () {
            Route::get('/packages', 'index')->name('packages.index');
            Route::get('/package/{slug}', 'show')->name('packages.show');
        });

    Route::prefix('blog')
        ->controller(BlogController::class)
        ->group(function () {
            Route::get('/', 'index')->name('blog.index');
            Route::get('/{blog_post:slug}', 'show')->name('blog.show');
        });

    Route::get('get-repository-data', GetPackageRepoDataController::class)
        ->middleware('throttle:5,1')
        ->name('get-repository-data');

    // OG Image routes
    Route::get('og-images/package/{package}', [OgImageController::class, 'package'])
        ->middleware('throttle:60,1')
        ->name('og-images.package');
});

require __DIR__.'/auth.php';
require __DIR__.'/app.php';
