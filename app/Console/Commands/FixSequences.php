<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixSequences extends Command
{
    protected $signature = 'db:fix-sequences';

    protected $description = 'Fix PostgreSQL sequences for tables with existing data';

    protected array $tables = [
        'blog_post_views',
        'blog_posts',
        'categories',
        'category_package',
        'index_package',
        'indexes',
        'packages',
        'users',
    ];

    public function handle()
    {
        $this->info('🔧 Starting sequence fix...');

        foreach ($this->tables as $table) {
            try {
                $sequence = DB::selectOne("SELECT pg_get_serial_sequence('{$table}', 'id') AS seq")->seq;

                if (! $sequence) {
                    $this->warn("⚠️ No sequence found for {$table}. Skipping...");

                    continue;
                }

                DB::statement("SELECT setval('{$sequence}', (SELECT COALESCE(MAX(id), 0) FROM {$table}))");

                $this->info("✅ Sequence fixed for {$table} ({$sequence})");
            } catch (\Exception $e) {
                $this->error("❌ Failed for {$table}: ".$e->getMessage());
            }
        }

        $this->info('✅ All done!');
    }
}
