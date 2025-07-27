<?php

namespace App\Http\Controllers;

use App\Actions\CreatePackageSubmissionAction;
use App\Http\Requests\CreatePackageSubmissionRequest;
use App\Http\Resources\PackageSubmissionResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageSubmissionController extends Controller
{
    /**
     * Display the user's package submissions.
     */
    public function index(Request $request): Response
    {
        $submissions = $request->user()->packageSubmissions()
            ->latest()
            ->paginate(10);

        return Inertia::render('PackageSubmissions/Index', [
            'submissions' => PackageSubmissionResource::collection($submissions),
        ]);
    }

    /**
     * Display the package submission form.
     */
    public function create(): Response
    {
        return Inertia::render('PackageSubmissions/Create');
    }

    /**
     * Store a newly created package submission.
     */
    public function store(CreatePackageSubmissionRequest $request, CreatePackageSubmissionAction $action): RedirectResponse
    {
        $action->handle($request->user(), $request->validated());

        return redirect()->route('user.packages.index')
            ->with('success', 'Your package has been submitted for review. We will notify you once it has been processed.');
    }
}
