<?php

namespace App\Jobs;

use App\Actions\GeneratePackageOgImageAction;
use App\Models\Package;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class GenerateOgImageForPackageJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public readonly Package $package) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            app(GeneratePackageOgImageAction::class)->handle($this->package);

            $this->package->load('media');
        } catch (\Exception $e) {
            Log::error('Failed to generate OG image in controller', [
                'package_id' => $this->package->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function tags()
    {
        return [
            'OgImageGeneration',
            'Package:'.$this->package->id,
        ];
    }
}
