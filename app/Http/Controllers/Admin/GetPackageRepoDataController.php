<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GetPackageRepoDataRequest;
use App\Services\GitHubService;
use Illuminate\Http\Request;

class GetPackageRepoDataController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(GetPackageRepoDataRequest $request)
    {
        try {
            $repositoryData = GitHubService::fetchRepositoryData($request->repository_url);

            return response()->json($repositoryData);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
