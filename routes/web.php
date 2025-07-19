<?php

use App\Http\Controllers\Admin\GetPackageRepoDataController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitemapGeneratorController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomePageController::class)->name('homepage');
Route::get('/sitemap.xml', SitemapGeneratorController::class);

Route::controller(PackageController::class)
    ->group(function () {
        Route::get('/packages', 'index')->name('packages.index');
        Route::get('/package/{slug}', 'show')->name('packages.show');
    });

Route::prefix('blog')
    ->controller(BlogController::class)
    ->group(function () {
        Route::get('/', 'index')->name('blog.index');
        Route::get('/{slug}', 'show')->name('blog.show');
    });

Route::get('get-repository-data', GetPackageRepoDataController::class)
    ->middleware('throttle:5,1')
    ->name('get-repository-data');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->middleware(['verified'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__.'/auth.php';
