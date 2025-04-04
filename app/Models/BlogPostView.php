<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPostView extends Model
{
    /**
     * Get the blog post that this view belongs to.
     */
    public function blogPost()
    {
        return $this->belongsTo(BlogPost::class);
    }
}
