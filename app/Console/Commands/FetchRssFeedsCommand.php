<?php

namespace App\Console\Commands;

use App\Actions\Feed\FetchRssFeedAction;
use App\Actions\Feed\StoreFeedPostAction;
use App\Models\FeedSource;
use Illuminate\Console\Command;

class FetchRssFeedsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'feed:fetch {--source= : Specific source ID to fetch}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch RSS feeds from all active sources or a specific source';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $fetchAction = new FetchRssFeedAction;
        $storeAction = new StoreFeedPostAction;

        $query = FeedSource::active();

        if ($sourceId = $this->option('source')) {
            $query->where('id', $sourceId);
        } else {
            $query->needsFetch();
        }

        $sources = $query->get();

        if ($sources->isEmpty()) {
            $this->info('No sources to fetch.');

            return 0;
        }

        $this->info("Fetching feeds from {$sources->count()} source(s)...");

        $totalPosts = 0;
        $totalNewPosts = 0;
        $totalUpdatedPosts = 0;
        $totalSkippedPosts = 0;

        foreach ($sources as $source) {
            $this->line("Fetching: {$source->name}");

            try {
                $items = $fetchAction->execute($source);

                $newPosts = 0;
                $updatedPosts = 0;
                $skippedPosts = 0;

                foreach ($items as $item) {
                    $result = $storeAction->execute($source, $item);

                    if ($result['skipped'] ?? false) {
                        $skippedPosts++;
                        $totalSkippedPosts++;
                        $this->line("  ⊘ Skipped: {$item['title']} ({$result['reason']})");
                    } elseif ($result['is_new']) {
                        $newPosts++;
                        $totalNewPosts++;
                        $this->line("  → New: {$result['post']->title}");
                    } else {
                        $updatedPosts++;
                        $totalUpdatedPosts++;
                    }

                    $totalPosts++;
                }

                $source->update(['last_fetched_at' => now()]);

                $this->info("✓ {$source->name}: ".count($items)." total ({$newPosts} new, {$updatedPosts} updated, {$skippedPosts} skipped)");
            } catch (\Exception $e) {
                $this->error("✗ {$source->name}: ".$e->getMessage());
            }
        }

        $this->newLine();
        $this->info('Summary:');
        $this->info("  Total posts processed: {$totalPosts}");
        $this->info("  New posts: {$totalNewPosts}");
        $this->info("  Updated posts: {$totalUpdatedPosts}");
        $this->info("  Skipped posts (no image): {$totalSkippedPosts}");

        return 0;
    }
}
