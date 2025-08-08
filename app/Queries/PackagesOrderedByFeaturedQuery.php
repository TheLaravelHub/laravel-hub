<?php

namespace App\Queries;

use App\Models\Package;
use Illuminate\Support\Collection;

class PackagesOrderedByFeaturedQuery
{
    public function get(): Collection
    {
        return Package::query()
            ->select(['id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar'])
            ->filter(['is_featured' => true])
            ->with('categories:id,name,slug')
            ->orderByDesc('stars')
            ->limit(6)
            ->get();
    }
}
