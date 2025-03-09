<?php

namespace App\Http\Controllers;

use App\Http\Resources\PackageResource;
use App\Models\Package;
use App\Services\GitHubService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $slug)
    {
        $package = Package::query()
            ->select('id', 'index_id', 'name', 'slug', 'description', 'repository_url', 'meta_title', 'meta_description', 'language', 'stars', 'owner', 'owner_avatar', 'created_at')
            ->with(['categories', 'indexes'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Package', [
            'package' => new PackageResource($package),
            'readme' => Inertia::defer(fn () => GitHubService::fetchReadmeContent($package->repository_url)),
        ]);
    }
}
