<?php

use App\Http\Controllers\Api\BookmarkController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

Route::get('search', SearchController::class)
    ->name('search')
    ->middleware('throttle:60,1');

Route::get('feed', [FeedController::class, 'index'])
    ->name('api.feed')
    ->middleware(['web', 'auth']);

Route::get('bookmarks', [BookmarkController::class, 'index'])
    ->name('api.bookmarks')
    ->middleware(['web', 'auth']);
