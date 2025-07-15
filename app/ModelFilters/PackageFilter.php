<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;

class PackageFilter extends ModelFilter
{
    public function lang(string $lang)
    {
        return $this->whereRaw('LOWER(language) = ?', [strtolower($lang)]);
    }
}
