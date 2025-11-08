<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class PublishedScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // Only apply the published filter if user is not authenticated as admin
        if (! Auth::check() || ! Auth::user()->is_admin) {
            $builder->where('status', 'published')
                ->where('published_at', '<=', now());
        }
    }
}
