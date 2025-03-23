<?php

declare(strict_types=1);

use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

Route::get('search', SearchController::class)
    ->name('search')
    ->middleware('throttle:60,1');
