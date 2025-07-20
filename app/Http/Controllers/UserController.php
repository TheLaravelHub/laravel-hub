<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogPostResource;
use App\Http\Resources\UserResource;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = $request->user()->withCount('packages')->first();
        $popularBlogPosts = BlogPost::popularThisWeek();

        return inertia('User/Index', [
            'user' => UserResource::make($user),
            'popularBlogPosts' => BlogPostResource::collection($popularBlogPosts),
        ]);
    }
}
