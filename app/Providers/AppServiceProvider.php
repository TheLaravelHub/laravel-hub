<?php

namespace App\Providers;

use Filament\Tables\Actions\CreateAction;
use Filament\Tables\Actions\EditAction;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\URL;
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

        JsonResource::withoutWrapping();

        $this->configureFilament();

        $this->configureModels();

        $this->forceSSLOnProduction();

        $this->configurePasswordRateLimiting();

    }

    protected function configurePasswordRateLimiting(): void
    {
        RateLimiter::for('password-reset', function (Request $request) {
            $email = (string)$request->get('email');

            $key = 'password_reset_attempts:' . sha1($email);
            $attempts = cache()->get($key, 0);

            $waitMinutes = match (true) {
                $attempts === 0 => 1,
                $attempts === 1 => 5,
                default => 10,
            };

            cache()->put($key, $waitMinutes);

            return Limit::perMinutes($waitMinutes, 1)->by($key);
        });
    }

    /**
     * Configure the application's models.
     */
    private function configureModels(): void
    {
        Model::unguard();

        Model::preventLazyLoading();
    }

    private function forceSSLOnProduction(): void
    {
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
    }

    private function configureFilament(): void
    {
        CreateAction::configureUsing(function (CreateAction $action) {
            return $action->slideOver();
        });

        EditAction::configureUsing(function (EditAction $action) {
            return $action->slideOver();
        });
    }
}
