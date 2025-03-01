<?php

namespace App\Http\Controllers;

use App\Http\Resources\Admin\CategoryResource;
use App\Http\Resources\Admin\PackageResource;
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
        $categories = Category::query()
            ->whereHas('packages')
            ->forPackages()
            ->get();
        $packages = Package::search()
            ->paginate(24);

        $packages->load('categories');

        return Inertia::render('Index', [
            'categories' => CategoryResource::collection($categories),
            'packages' => PackageResource::collection($packages),
        ]);
    }
}
