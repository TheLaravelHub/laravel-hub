<?php

namespace App\Console\Commands;

use App\Models\Package;
use Illuminate\Console\Command;

class RelateIndexesToPackages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:relate-indexes-to-packages';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Relate indexes to packages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Relating indexes to packages...');

        $packages = Package::withoutActive()->get();

        foreach ($packages as $package) {
            $package->indexes()->sync($package->index_id);
        }

        $this->info('Indexes related to packages.');

        $this->info('Refreshing Algolia..');
        $this->call('scout:import', ['model' => Package::class]);
        $this->info('Algolia index refreshed.');
    }
}
