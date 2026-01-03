<?php

namespace App\Http\Controllers;

use App\Http\Resources\Admin\CategoryResource;
use App\Http\Resources\PackageResource;
use App\Jobs\GenerateOgImageForPackageJob;
use App\Jobs\RecordPackageViewsJob;
use App\Models\Category;
use App\Models\Package;
use App\Queries\PackageQuery;
use App\Services\GitHubService;
use Illuminate\Http\Request;
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

        RecordPackageViewsJob::dispatch(
            $package->id,
            request()->ip(),
            request()->userAgent(),
            request()->session()->getId()
        );

        if (! $package->hasMedia('og-images')) {
            GenerateOgImageForPackageJob::dispatch($package);
        }

        return Inertia::render('Package', [
            'package' => new PackageResource($package),
            'readme' => Inertia::defer(fn () => GitHubService::fetchReadmeContent($package->repository_url)),
        ]);
    }
}
