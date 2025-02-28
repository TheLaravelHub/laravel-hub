<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $packages = Package::search(trim($request->input('term')) ?? '')
            ->get();

        $packages->load('categories');

        return response()->json($packages);
    }
}
