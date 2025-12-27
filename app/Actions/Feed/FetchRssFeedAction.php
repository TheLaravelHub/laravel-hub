<?php

namespace App\Actions\Feed;

use App\Models\FeedSource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use SimpleXMLElement;

class FetchRssFeedAction
{
    public function execute(FeedSource $source): array
    {
        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' => 'en-US,en;q=0.9',
                    'Accept-Encoding' => 'gzip, deflate, br',
                    'DNT' => '1',
                    'Connection' => 'keep-alive',
                    'Upgrade-Insecure-Requests' => '1',
                ])
                ->get($source->rss_feed_url);

            if (! $response->successful()) {
                $logData = [
                    'source_id' => $source->id,
                    'status' => $response->status(),
                    'url' => $source->rss_feed_url,
                ];

                // Check if this is a Cloudflare challenge
                if ($response->status() === 403 && str_contains($response->header('Server') ?? '', 'cloudflare')) {
                    $cfMitigated = $response->header('cf-mitigated');
                    if ($cfMitigated === 'challenge') {
                        $logData['cloudflare_challenge'] = true;
                        $logData['note'] = 'This feed is protected by Cloudflare bot challenge which requires JavaScript execution. Consider using a headless browser solution or contacting the site owner to whitelist the scraper.';
                    }
                }

                Log::error("Failed to fetch RSS feed for {$source->name}", $logData);

                return [];
            }

            $xml = new SimpleXMLElement($response->body());
            $items = [];

            // Handle RSS 2.0 format
            if (isset($xml->channel->item)) {
                foreach ($xml->channel->item as $item) {
                    try {
                        $parsedItem = $this->parseRssItem($item, $source);

                        if (empty($parsedItem['image_url'])) {
                            Log::info("Skipping RSS item without image for {$source->name}", [
                                'item_title' => $parsedItem['title'] ?? 'Unknown',
                            ]);

                            continue;
                        }

                        $items[] = $parsedItem;
                    } catch (\Exception $e) {
                        Log::error("Error parsing RSS item for {$source->name}", [
                            'error' => $e->getMessage(),
                            'item_title' => (string) ($item->title ?? 'Unknown'),
                        ]);
                    }
                }
            }
            // Handle Atom format
            elseif (isset($xml->entry)) {
                foreach ($xml->entry as $entry) {
                    try {
                        $parsedEntry = $this->parseAtomEntry($entry, $source);

                        // Skip entries without images
                        if (empty($parsedEntry['image_url'])) {
                            Log::info("Skipping Atom entry without image for {$source->name}", [
                                'entry_title' => $parsedEntry['title'] ?? 'Unknown',
                            ]);

                            continue;
                        }

                        $items[] = $parsedEntry;
                    } catch (\Exception $e) {
                        Log::error("Error parsing Atom entry for {$source->name}", [
                            'error' => $e->getMessage(),
                            'entry_title' => (string) ($entry->title ?? 'Unknown'),
                        ]);
                    }
                }
            } else {
                Log::warning("Unknown feed format for {$source->name}");
            }

            $source->update(['last_fetched_at' => now()]);

            return $items;
        } catch (\Exception $e) {
            Log::error("Error fetching RSS feed for {$source->name}", [
                'source_id' => $source->id,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function parseRssItem($item, FeedSource $source): array
    {
        $title = (string) $item->title;
        $link = (string) $item->link;
        $description = (string) ($item->description ?? '');
        $content = (string) ($item->children('content', true)->encoded ?? $description);
        $pubDate = isset($item->pubDate) ? \Carbon\Carbon::parse((string) $item->pubDate) : now();

        // Extract image from various possible locations
        $imageUrl = null;
        if (isset($item->enclosure['url']) && str_contains((string) $item->enclosure['type'], 'image')) {
            $imageUrl = (string) $item->enclosure['url'];
        } elseif (isset($item->children('media', true)->content)) {
            $imageUrl = (string) $item->children('media', true)->content['url'];
        } elseif (isset($item->children('media', true)->thumbnail)) {
            $imageUrl = (string) $item->children('media', true)->thumbnail['url'];
        } else {
            // Try to extract image from content or description
            $imageUrl = $this->extractImageFromHtml($content) ?? $this->extractImageFromHtml($description);
        }

        // If no image found in feed, try to fetch from the article URL
        if (! $imageUrl && $link) {
            $imageUrl = $this->fetchImageFromUrl($link);
        }

        // Clean up image URL (URL encode spaces and special characters)
        if ($imageUrl) {
            $imageUrl = $this->cleanImageUrl($imageUrl);
        }

        // Get GUID or use link as external ID
        $externalId = isset($item->guid) ? (string) $item->guid : $link;

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(8),
            'excerpt' => Str::limit(strip_tags($description), 300),
            'content' => $content,
            'image_url' => $imageUrl,
            'external_url' => $link,
            'external_id' => md5($externalId),
            'published_at' => $pubDate,
        ];
    }

    private function parseAtomEntry($entry, FeedSource $source): array
    {
        $title = (string) $entry->title;
        $link = '';
        foreach ($entry->link as $linkItem) {
            if ((string) $linkItem['rel'] === 'alternate' || ! (string) $linkItem['rel']) {
                $link = (string) $linkItem['href'];
                break;
            }
        }

        $summary = (string) ($entry->summary ?? '');
        $content = (string) ($entry->content ?? $summary);
        $published = isset($entry->published) ? \Carbon\Carbon::parse((string) $entry->published) : now();

        $imageUrl = null;
        if (isset($entry->children('media', true)->thumbnail)) {
            $imageUrl = (string) $entry->children('media', true)->thumbnail['url'];
        } else {
            $imageUrl = $this->extractImageFromHtml($content) ?? $this->extractImageFromHtml($summary);
        }

        // If no image found in feed, try to fetch from the article URL
        if (! $imageUrl && $link) {
            $imageUrl = $this->fetchImageFromUrl($link);
        }

        // Clean up image URL
        if ($imageUrl) {
            $imageUrl = $this->cleanImageUrl($imageUrl);
        }

        $externalId = (string) ($entry->id ?? $link);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(8),
            'excerpt' => Str::limit(strip_tags($summary), 300),
            'content' => $content,
            'image_url' => $imageUrl,
            'external_url' => $link,
            'external_id' => md5($externalId),
            'published_at' => $published,
        ];
    }

    private function extractImageFromHtml(?string $html): ?string
    {
        if (! $html) {
            return null;
        }

        // Try to extract first image from HTML content
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/', $html, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function cleanImageUrl(string $url): string
    {
        // Just encode spaces and other special characters while preserving the structure
        // This handles URLs like: https://picperf.io/https://domain.com/path with spaces.png
        return str_replace(' ', '%20', $url);
    }

    private function fetchImageFromUrl(string $url): ?string
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' => 'en-US,en;q=0.9',
                    'Accept-Encoding' => 'gzip, deflate, br',
                    'DNT' => '1',
                    'Connection' => 'keep-alive',
                    'Upgrade-Insecure-Requests' => '1',
                ])
                ->get($url);

            if (! $response->successful()) {
                return null;
            }

            $html = $response->body();

            // Try to extract Open Graph image
            if (preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](https?:\/\/[^"\']+)["\']/', $html, $matches)) {
                return $matches[1];
            }

            // Try to extract Open Graph image (reversed attributes)
            if (preg_match('/<meta[^>]+content=["\'](https?:\/\/[^"\']+)["\'][^>]+property=["\']og:image["\']/', $html, $matches)) {
                return $matches[1];
            }

            // Try to extract Twitter card image
            if (preg_match('/<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\'](https?:\/\/[^"\']+)["\']/', $html, $matches)) {
                return $matches[1];
            }

            // Try to extract Twitter card image (reversed attributes)
            if (preg_match('/<meta[^>]+content=["\'](https?:\/\/[^"\']+)["\'][^>]+name=["\']twitter:image["\']/', $html, $matches)) {
                return $matches[1];
            }

            // Try to extract first img tag with absolute URL
            if (preg_match('/<img[^>]+src=["\'](https?:\/\/[^"\']+)["\']/', $html, $matches)) {
                return $matches[1];
            }

            return null;
        } catch (\Exception $e) {
            Log::warning("Failed to fetch image from URL: {$url}", [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
