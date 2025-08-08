<?php

namespace App\Queries;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Collection;

class LatestPublishedPostsQuery
{
    public function get(): Collection
    {
        return BlogPost::query()
            ->published()
            ->select(['id', 'title', 'sub_title', 'slug', 'published_at', 'meta_description'])
            ->with('categories:id,name,slug')
            ->latest('published_at')
            ->limit(6)
            ->get();
    }
}
