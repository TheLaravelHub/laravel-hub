<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Class GitHubService
 */
class GitHubService
{
    /**
     * Fetch repository data from GitHub API
     */
    public static function fetchRepositoryData(string $repoUrl): ?array
    {
        // Extract "owner/repo" from the URL
        preg_match('/github\.com\/([^\/]+)\/([^\/]+)/', $repoUrl, $matches);
        if (count($matches) < 3) {
            return null;
        }
        [$fullMatch, $owner, $repo] = $matches;

        $apiUrl = "https://api.github.com/repos/{$owner}/{$repo}";

        $response = Http::withHeaders([
            'Accept' => 'application/vnd.github.v3+json',
            'Authorization' => 'Bearer '.env('GITHUB_TOKEN'),
        ])->get($apiUrl);

        if ($response->failed()) {
            return null;
        }

        $repoData = $response->json();

        return [
            'name' => $repoData['name'],
            'description' => $repoData['description'],
            'repository_url' => $repoData['html_url'],
            'language' => $repoData['language'],
            'stars' => $repoData['stargazers_count'],
            'owner' => $repoData['owner']['login'],
            'owner_avatar' => $repoData['owner']['avatar_url'],
        ];
    }
}
