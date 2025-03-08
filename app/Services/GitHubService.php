<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

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
            throw new NotFoundHttpException('Repository not found');
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

    /**
     * Fetch README.md content from a GitHub repository
     */
    public static function fetchReadmeContent(string $repoUrl): ?string
    {
        ['owner' => $owner, 'name' => $repo] = self::getGithubRepositoryData($repoUrl) ?? throw new NotFoundHttpException('Invalid repository URL');

        $apiUrl = "https://api.github.com/repos/{$owner}/{$repo}/readme";

        $response = Http::withHeaders([
            'Accept' => 'application/vnd.github.v3+json',
            'Authorization' => 'Bearer '.env('GITHUB_TOKEN'),
        ])->get($apiUrl);

        if ($response->failed()) {
            throw new NotFoundHttpException('README file not found');
        }

        $readmeData = $response->json();

        return isset($readmeData['content']) ? base64_decode($readmeData['content']) : null;
    }

    private static function getGithubRepositoryData(string $repoUrl): ?array
    {
        preg_match('/github\.com\/([^\/]+)\/([^\/]+)/', $repoUrl, $matches);
        if (count($matches) < 3) {
            return null;
        }
        [$fullMatch, $owner, $repo] = $matches;

        return [
            'name' => $repo,
            'owner' => $owner,
        ];
    }
}
