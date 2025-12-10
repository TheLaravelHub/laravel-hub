<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class FeedPostFilter extends ModelFilter
{
    protected array $filters = ['query'];

    public function query(string $query)
    {
        return $this->query->whereAny(['title', 'excerpt'], 'ILIKE', "%{$query}%");
    }
}
