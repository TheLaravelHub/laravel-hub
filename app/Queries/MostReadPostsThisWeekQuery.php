<?php

namespace App\Queries;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Collection;

class MostReadPostsThisWeekQuery
{
    public function get(): Collection
    {
        return BlogPost::popularThisWeek();
    }
}
