<?php

namespace App\Http\Controllers;

use App\Actions\GeneratePackageOgImageAction;
use App\Http\Resources\Admin\CategoryResource;
use App\Http\Resources\PackageResource;
use App\Models\Category;
use App\Models\Package;
use App\Queries\PackageQuery;
use App\Services\GitHubService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query()
            ->whereHas('packages')
            ->forPackages()
            ->withCount('packages')
            ->get();

        $packages = (new PackageQuery($request))->getPaginated();
        $packages->load('categories');

        if ($request->expectsJson()) {
            return PackageResource::collection($packages);
        }

        return Inertia::render('Packages', [
            'categories' => CategoryResource::collection($categories),
            'packages' => PackageResource::collection($packages),
            'filters' => $request->only(['search', 'category', 'lang']),
        ]);
    }

    /**
     * Handle the incoming request.
     */
    public function show(string $slug)
    {
        $package = Package::query()
            ->with('media')
            ->select('id', 'index_id', 'name', 'slug', 'description', 'repository_url', 'meta_title', 'meta_description', 'language', 'stars', 'owner', 'owner_avatar', 'created_at')
            ->with(['categories', 'indexes', 'media'])
            ->where('slug', $slug)
            ->firstOrFail();

        if (! $package->hasMedia('og-images')) {
            try {
                app(GeneratePackageOgImageAction::class)->handle($package);

                $package->load('media');
            } catch (\Exception $e) {
                Log::error('Failed to generate OG image in controller', [
                    'package_id' => $package->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return Inertia::render('Package', [
            'package' => new PackageResource($package),
            'readme' => Inertia::defer(fn () => GitHubService::fetchReadmeContent($package->repository_url)),
        ]);
    }
}
