<?php

use App\Http\Controllers\Admin\GetPackageRepoDataController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomePageController::class)->name('homepage');

Route::get('get-repository-data', GetPackageRepoDataController::class)
    ->middleware('throttle:5,1')
    ->name('get-repository-data');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->middleware(['verified'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// require __DIR__.'/auth.php';
