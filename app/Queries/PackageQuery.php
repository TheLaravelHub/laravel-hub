<?php

namespace App\Queries;

use App\Models\Package;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class PackageQuery
{
    public function __construct(
        protected Request $request,
        protected int $perPage = 30
    ) {}

    public function getPaginated(): LengthAwarePaginator
    {
        $search = $this->request->input('search');
        $categorySlug = $this->request->input('category');
        $page = $this->request->input('page', 1);

        if ($search) {
            return Package::search($search)
                ->query(function (Builder $query) use ($categorySlug) {
                    $query->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar');

                    if ($categorySlug) {
                        $query->whereHas('categories', fn ($q) => $q->where('slug', $categorySlug));
                    }

                    return $query;
                })
                ->paginate($this->perPage, page: $page);
        }

        return Package::query()
            ->select('id', 'name', 'slug', 'description', 'stars', 'owner', 'owner_avatar')
            ->filter($this->request->all())
            ->when($categorySlug, function ($query) use ($categorySlug) {
                $query->whereHas('categories', fn ($q) => $q->where('slug', $categorySlug));
            })
            ->paginate($this->perPage, page: $page);
    }
}
