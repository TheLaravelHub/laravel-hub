<?php

namespace App\Http\Controllers;

use App\Models\Package;

class OgImageController extends Controller
{
    /**
     * Render the OG image for a package
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function package(Package $package)
    {
        return view('og-images.package', compact('package'));
    }
}
