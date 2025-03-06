<?php

namespace App\Models;

use App\Traits\HasStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Str;
use Thefeqy\ModelStatus\Casts\StatusCast;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Category extends Model
{
    use HasActiveScope;
    use SoftDeletes;
    use HasStatus;

    protected $fillable = ['name', 'slug', 'meta_title', 'meta_description', 'category_type'];

    protected array $cascadeDeactivate = ['packages'];

    protected static function boot()
    {
        parent::boot();
        static::creating(static function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }

//    public function casts()
//    {
//        return [
//            'status' => StatusCast::class,
//        ];
//    }

    /**
     * Scope to filter only package categories.
     * TODO: Add actual class names after creating models
     */
    public function scopeForPackages($query)
    {
        return $query->where('category_type', 'App\Models\Package');
    }

    /**
     * Scope to filter only blog categories.
     * TODO: Add actual class names after creating models
     */
    public function scopeForBlogPosts($query)
    {
        return $query->where('category_type', 'App\Models\BlogPost');
    }

    /**
     * Relationship: Category belongs to many Packages.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function packages()
    {
        return $this->belongsToMany(Package::class, 'category_package');
    }
}
