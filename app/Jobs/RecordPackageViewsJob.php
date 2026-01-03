<?php

namespace App\Jobs;

use App\Models\PackageView;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RecordPackageViewsJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly int $packageId,
        public readonly string $ipAddress,
        public readonly ?string $userAgent,
        public readonly ?string $sessionId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $view = PackageView::query()
            ->where('package_id', $this->packageId)
            ->where('ip_address', $this->ipAddress)
            ->where('user_agent', $this->userAgent)
            ->where('session_id', $this->sessionId)
            ->first();

        if (! $view) {
            PackageView::query()->create([
                'package_id' => $this->packageId,
                'ip_address' => $this->ipAddress,
                'user_agent' => $this->userAgent,
                'session_id' => $this->sessionId,
            ]);
        }
    }

    public function tags()
    {
        return [
            'RecordPackageViewsJob',
            'Package:'.$this->packageId,
        ];
    }
}
