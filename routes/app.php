<?php

use App\Http\Controllers\Application\Feed\BookmarkController;
use App\Http\Controllers\Application\Feed\FeedCommentController;
use App\Http\Controllers\Application\Feed\FeedController;
use App\Http\Controllers\Application\Feed\FeedPostController;
use App\Http\Controllers\Application\Feed\ToggleCommentVoteController;
use App\Http\Controllers\Application\Feed\TogglePostBookmarkController;
use App\Http\Controllers\Application\Feed\TogglePostVoteController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PackageSubmissionController;
use App\Http\Controllers\Profile\ProfileInformationController;
use App\Http\Controllers\Profile\ProfileSecurityController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::domain(config('app.app_domain'))->middleware('web')->as('app.')->group(function () {
    // Logout route for app subdomain
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth')
        ->name('logout');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::prefix('/user')
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

        Route::as('feed.')
            ->group(function () {
                Route::get('/', [FeedController::class, 'index'])
                    ->name('home');

                Route::get('bookmarks', [BookmarkController::class, 'index'])->name('bookmarks');

                Route::prefix('posts')
                    ->as('posts.')
                    ->group(function () {
                        Route::get('/', [FeedPostController::class, 'index'])->name('posts.index');
                        Route::get('/{feedPost:slug}', [FeedPostController::class, 'show'])->name('show');
                        Route::post('/{feedPost}/comments', FeedCommentController::class)->name('comments.store');
                        Route::post('/{feedPost}/vote', TogglePostVoteController::class)->name('vote');
                        Route::post('/{feedPost}/bookmark', TogglePostBookmarkController::class)->name('bookmark');
                    });
                Route::post('comments/{feedComment}/vote', ToggleCommentVoteController::class)->name('comments.vote');
            });
    });
});
