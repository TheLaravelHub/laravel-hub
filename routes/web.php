<?php

use App\Http\Controllers\Admin\GetPackageRepoDataController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\OgImageController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PackageSubmissionController;
use App\Http\Controllers\Profile\ProfileInformationController;
use App\Http\Controllers\Profile\ProfileSecurityController;
use App\Http\Controllers\SitemapGeneratorController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

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

Route::middleware(['auth', 'verified'])
    ->prefix('/user')
    ->name('user.')
    ->group(function () {
        Route::get('/', UserController::class)
            ->name('dashboard');

        Route::controller(PackageSubmissionController::class)
            ->prefix('packages')
            ->name('packages.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store')
                    ->middleware('throttle:2,1');
            });

        // Profile routes
        Route::prefix('profile')->name('profile.')->group(function () {
            Route::get('information', [ProfileInformationController::class, 'edit'])->name('information.edit');
            Route::patch('information', [ProfileInformationController::class, 'update'])->name('information.update');
            Route::get('security', [ProfileSecurityController::class, 'edit'])->name('security.edit');
            Route::put('security', [ProfileSecurityController::class, 'update'])->name('security.update');
        });
    });

require __DIR__.'/auth.php';
