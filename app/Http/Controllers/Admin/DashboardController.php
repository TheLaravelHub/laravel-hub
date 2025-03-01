<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $packagesCount = Package::count();
        $activePackagesCount = Package::query()->active()->count();
        $inActivePackagesCount = Package::query()->inActive()->count();

        return Inertia::render('Admin/Dashboard/Index',
            compact('packagesCount', 'activePackagesCount', 'inActivePackagesCount'));
    }
}
