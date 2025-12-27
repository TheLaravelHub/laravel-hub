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
            $response = Http::timeout(30)->get($source->rss_feed_url);

            if (! $response->successful()) {
                Log::error("Failed to fetch RSS feed for {$source->name}", [
                    'source_id' => $source->id,
                    'status' => $response->status(),
                ]);

                return [];
            }

            $xml = new SimpleXMLElement($response->body());
            $items = [];

            // Handle RSS 2.0 format
            if (isset($xml->channel->item)) {
                foreach ($xml->channel->item as $item) {
                    $items[] = $this->parseRssItem($item, $source);
                }
            }
            // Handle Atom format
            elseif (isset($xml->entry)) {
                foreach ($xml->entry as $entry) {
                    $items[] = $this->parseAtomEntry($entry, $source);
                }
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
}
