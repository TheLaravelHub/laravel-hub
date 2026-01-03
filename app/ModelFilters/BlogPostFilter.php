<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class BlogPostFilter extends ModelFilter
{
    /**
     * Related Models that have ModelFilters as well as the method on the ModelFilter
     * As [relationMethod => [input_key1, input_key2]].
     *
     * @var array
     */
    public $relations = [];

    /**
     * Filter by search term (searches in title, sub_title, and content)
     */
    public function search($search)
    {
        return $this->where(function ($query) use ($search) {
            $query->whereAny(
                ['title', 'sub_title', 'content'],
                'ILIKE',
                "%{$search}%"
            );
        });
    }

    /**
     * Filter by categories (accepts single category ID or array of IDs)
     */
    public function categories($categories)
    {
        if (! is_array($categories)) {
            $categories = [$categories];
        }

        // Filter out empty values
        $categories = array_filter($categories);

        if (empty($categories)) {
            return $this;
        }

        return $this->whereHas('categories', function ($query) use ($categories) {
            $query->whereIn('categories.slug', $categories);
        });
    }

    /**
     * Alternative method name for category filtering
     */
    public function category($category)
    {
        return $this->categories($category);
    }
}
