<?php

namespace App\Providers;

use Filament\Tables\Actions\CreateAction;
use Filament\Tables\Actions\EditAction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Model::preventLazyLoading();

        //        Request::macro('admin', function () {
        //            return $this->user('admin');
        //        });
        //
        //        Auth::macro('admin', function () {
        //            return Auth::guard('admin')->user();
        //        });

        CreateAction::configureUsing(function (CreateAction $action) {
            return $action->slideOver();
        });

        EditAction::configureUsing(function (EditAction $action) {
            return $action->slideOver();
        });

        $this->configureModels();
    }

    /**
     * Configure the application's models.
     */
    private function configureModels(): void
    {
        Model::unguard();

        Model::preventLazyLoading();
    }
}
