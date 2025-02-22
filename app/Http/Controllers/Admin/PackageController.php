<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreatePackageRequest;
use App\Http\Resources\Admin\PackageResource;
use App\Models\Category;
use App\Models\Index;
use App\Models\Package;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Thefeqy\ModelStatus\Status;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = Package::query()->with(['index', 'categories'])->paginate(12);
        return Inertia::render('Admin/Package/Index', [
            'packages' => PackageResource::collection($packages),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $indexes = Index::query()->withActive()->select('name as label', 'id as value')->get();
        $categories = Category::query()->withActive()->select('name as label', 'id as value')->forPackages()->get();
        return Inertia::render('Admin/Package/Create', [
            'indexes' => $indexes,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePackageRequest $request)
    {
//        dd($request->safe()->merge(['status' => $request->active ? Status::active() : Status::inactive()])->all());
        try {
            DB::beginTransaction();

            $package = Package::create($request->safe()->merge(['status' => $request->active ? Status::active() : Status::inactive()])->all());

            $package->categories()->sync($request->category_ids);

            DB::commit();
            return redirect()
                ->route('admin.packages.packages.index')
                ->with('message', 'Package created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Package $package)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Package $package)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Package $package)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Package $package)
    {
        $package->delete();
        return redirect()
            ->route('admin.packages.packages.index')
            ->with('message', 'Package deleted successfully');
    }
}
