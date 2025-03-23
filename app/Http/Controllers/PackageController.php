<?php

namespace App\Http\Controllers;

use App\Http\Resources\Admin\CategoryResource;
use App\Http\Resources\PackageResource;
use App\Models\Category;
use App\Models\Package;
use App\Services\GitHubService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 30;
        $categorySlug = $request->input('category');

        $categories = Category::query()
            ->whereHas('packages')
            ->forPackages()
            ->withCount('packages')
            ->get();

        $packagesQuery = Package::query()
            ->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar')
            ->when($categorySlug, function ($query) use ($categorySlug) {
                return $query->whereHas('categories', function ($query) use ($categorySlug) {
                    $query->where('slug', $categorySlug);
                });
            });

        $packages = $request->input('search')
            ? Package::search($request->input('search'))
                ->query(function ($query) use ($categorySlug) {
                    $query = $query->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar');
                    
                    if ($categorySlug) {
                        $query->whereHas('categories', function ($query) use ($categorySlug) {
                            $query->where('slug', $categorySlug);
                        });
                    }
                    
                    return $query;
                })
                ->paginate(perPage: $perPage, page: $page)
            : $packagesQuery->paginate(perPage: $perPage, page: $page);

        $packages->load('categories');

        if ($request->expectsJson()) {
            return PackageResource::collection($packages);
        }

        return Inertia::render('Packages', [
            'categories' => CategoryResource::collection($categories),
            'packages' => PackageResource::collection($packages),
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $categorySlug,
            ],
        ]);
    }

    /**
     * Handle the incoming request.
     */
    public function show(string $slug)
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
