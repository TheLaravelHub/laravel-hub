<?php

namespace App\Http\Controllers;

use App\Http\Resources\PackageResource;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomePageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $page = $request->input('page', 1);

        $categories = Category::query()
            ->whereHas('packages')
            ->forPackages()
            ->withCount('packages')
            ->get();

        $packages = $request->input('search')
            ? Package::search($request->input('search'))
                ->query(function ($query) {
                    return $query->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar');
                })
                ->paginate(perPage: 24, page: $page)
            : Package::query()
                ->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar')
                ->paginate(perPage: 24, page: $page);

        $packages->load('categories');

        $stars = Package::sum('stars');

        if ($request->expectsJson()) {
            return PackageResource::collection($packages);
        }

        return Inertia::render('Index', [
            'categories' => CategoryResource::collection($categories),
            'packages' => PackageResource::collection($packages),
            'stars' => $stars,
            'categories_count' => $categories->count(),
        ]);
    }
}
